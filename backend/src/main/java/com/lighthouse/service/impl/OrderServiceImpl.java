package com.lighthouse.service.impl;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lighthouse.entity.Order;
import com.lighthouse.entity.OrderItem;
import com.lighthouse.mapper.OrderItemMapper;
import com.lighthouse.mapper.OrderMapper;
import com.lighthouse.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 订单Service实现类
 */
@Slf4j
@Service
@DS("postgresql")
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderMapper orderMapper;
    
    @Autowired
    private OrderItemMapper orderItemMapper;
    
    @Override
    public Order getOrderById(Long id) {
        Order order = orderMapper.selectById(id);
        if (order != null) {
            // 查询订单项
            List<OrderItem> orderItems = orderItemMapper.selectByOrderId(id);
            order.setOrderItems(orderItems);
        }
        return order;
    }
    
    @Override
    public Order getOrderByOrderNo(String orderNo) {
        Order order = orderMapper.selectByOrderNo(orderNo);
        if (order != null) {
            // 查询订单项
            List<OrderItem> orderItems = orderItemMapper.selectByOrderId(order.getId());
            order.setOrderItems(orderItems);
        }
        return order;
    }
    
    @Override
    public IPage<Order> getOrdersByUserId(Long userId, Integer page, Integer size) {
        Page<Order> pageParam = new Page<>(page, size);
        IPage<Order> orderPage = orderMapper.selectOrdersByUserId(pageParam, userId);
        
        // 批量查询订单项
        if (!orderPage.getRecords().isEmpty()) {
            List<Long> orderIds = orderPage.getRecords().stream()
                    .map(Order::getId)
                    .collect(Collectors.toList());
            
            List<OrderItem> allOrderItems = orderItemMapper.selectByOrderIds(orderIds);
            Map<Long, List<OrderItem>> orderItemsMap = allOrderItems.stream()
                    .collect(Collectors.groupingBy(OrderItem::getOrderId));
            
            // 设置每个订单的订单项
            orderPage.getRecords().forEach(order -> 
                order.setOrderItems(orderItemsMap.getOrDefault(order.getId(), List.of()))
            );
        }
        
        return orderPage;
    }
    
    @Override
    public IPage<Order> getOrdersByUserIdAndStatus(Long userId, String orderStatus, Integer page, Integer size) {
        Page<Order> pageParam = new Page<>(page, size);
        IPage<Order> orderPage = orderMapper.selectOrdersByUserIdAndStatus(pageParam, userId, orderStatus);
        
        // 批量查询订单项
        if (!orderPage.getRecords().isEmpty()) {
            List<Long> orderIds = orderPage.getRecords().stream()
                    .map(Order::getId)
                    .collect(Collectors.toList());
            
            List<OrderItem> allOrderItems = orderItemMapper.selectByOrderIds(orderIds);
            Map<Long, List<OrderItem>> orderItemsMap = allOrderItems.stream()
                    .collect(Collectors.groupingBy(OrderItem::getOrderId));
            
            // 设置每个订单的订单项
            orderPage.getRecords().forEach(order -> 
                order.setOrderItems(orderItemsMap.getOrDefault(order.getId(), List.of()))
            );
        }
        
        return orderPage;
    }
    
    @Override
    @Transactional
    public Order createOrder(Order order) {
        // 生成订单号
        if (order.getOrderNo() == null || order.getOrderNo().isEmpty()) {
            order.setOrderNo(generateOrderNo());
        }
        
        // 设置默认值
        if (order.getOrderStatus() == null) {
            order.setOrderStatus(Order.OrderStatus.PENDING_PAYMENT);
        }
        if (order.getPaymentStatus() == null) {
            order.setPaymentStatus(Order.PaymentStatus.UNPAID);
        }
        
        // 保存订单
        orderMapper.insert(order);
        
        // 保存订单项
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            for (OrderItem orderItem : order.getOrderItems()) {
                orderItem.setOrderId(order.getId());
                orderItemMapper.insert(orderItem);
            }
        }
        
        return order;
    }
    
    @Override
    public boolean updateOrderStatus(Long orderId, Order.OrderStatus orderStatus) {
        UpdateWrapper<Order> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", orderId)
                    .set("order_status", orderStatus.getCode())
                    .set("updated_at", LocalDateTime.now());
        
        // 根据状态设置相应的时间字段
        switch (orderStatus) {
            case SHIPPED:
                updateWrapper.set("shipping_time", LocalDateTime.now());
                break;
            case DELIVERED:
                updateWrapper.set("delivery_time", LocalDateTime.now());
                break;
            case COMPLETED:
                updateWrapper.set("completion_time", LocalDateTime.now());
                break;
            case CANCELLED:
                updateWrapper.set("cancel_time", LocalDateTime.now());
                break;
        }
        
        return orderMapper.update(null, updateWrapper) > 0;
    }
    
    @Override
    public boolean updatePaymentStatus(Long orderId, Order.PaymentStatus paymentStatus) {
        UpdateWrapper<Order> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", orderId)
                    .set("payment_status", paymentStatus.getCode())
                    .set("updated_at", LocalDateTime.now());
        
        if (paymentStatus == Order.PaymentStatus.PAID) {
            updateWrapper.set("payment_time", LocalDateTime.now())
                        .set("order_status", Order.OrderStatus.PAID.getCode());
        }
        
        return orderMapper.update(null, updateWrapper) > 0;
    }
    
    @Override
    public boolean cancelOrder(Long orderId, String cancelReason) {
        UpdateWrapper<Order> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", orderId)
                    .set("order_status", Order.OrderStatus.CANCELLED.getCode())
                    .set("cancel_reason", cancelReason)
                    .set("cancel_time", LocalDateTime.now())
                    .set("updated_at", LocalDateTime.now());
        
        return orderMapper.update(null, updateWrapper) > 0;
    }
    
    @Override
    public boolean shipOrder(Long orderId) {
        return updateOrderStatus(orderId, Order.OrderStatus.SHIPPED);
    }
    
    @Override
    public boolean confirmDelivery(Long orderId) {
        return updateOrderStatus(orderId, Order.OrderStatus.DELIVERED);
    }
    
    @Override
    public boolean completeOrder(Long orderId) {
        return updateOrderStatus(orderId, Order.OrderStatus.COMPLETED);
    }
    
    @Override
    public Map<String, Long> countOrdersByUserIdAndStatus(Long userId) {
        List<OrderMapper.OrderStatusCount> statusCounts = orderMapper.countOrdersByUserIdAndStatus(userId);
        Map<String, Long> result = new HashMap<>();
        
        // 初始化所有状态为0
        for (Order.OrderStatus status : Order.OrderStatus.values()) {
            result.put(status.getCode(), 0L);
        }
        
        // 填充实际统计数据
        for (OrderMapper.OrderStatusCount statusCount : statusCounts) {
            result.put(statusCount.getOrderStatus(), statusCount.getCount());
        }
        
        return result;
    }
    
    @Override
    @Transactional
    public boolean deleteOrder(Long orderId) {
        // 先删除订单项
        QueryWrapper<OrderItem> itemQueryWrapper = new QueryWrapper<>();
        itemQueryWrapper.eq("order_id", orderId);
        orderItemMapper.delete(itemQueryWrapper);
        
        // 再删除订单
        return orderMapper.deleteById(orderId) > 0;
    }
    
    @Override
    public IPage<Order> getAllOrders(Integer page, Integer size) {
        Page<Order> pageParam = new Page<>(page, size);
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("created_at");
        
        IPage<Order> orderPage = orderMapper.selectPage(pageParam, queryWrapper);
        
        // 批量查询订单项
        if (!orderPage.getRecords().isEmpty()) {
            List<Long> orderIds = orderPage.getRecords().stream()
                    .map(Order::getId)
                    .collect(Collectors.toList());
            
            List<OrderItem> allOrderItems = orderItemMapper.selectByOrderIds(orderIds);
            Map<Long, List<OrderItem>> orderItemsMap = allOrderItems.stream()
                    .collect(Collectors.groupingBy(OrderItem::getOrderId));
            
            // 设置每个订单的订单项
            orderPage.getRecords().forEach(order -> 
                order.setOrderItems(orderItemsMap.getOrDefault(order.getId(), List.of()))
            );
        }
        
        return orderPage;
    }
    
    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.valueOf((int) (Math.random() * 9000) + 1000);
        return "LH" + timestamp + random;
    }
} 