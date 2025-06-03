package com.lighthouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lighthouse.entity.Order;
import com.lighthouse.mapper.OrderMapper;

import java.util.List;
import java.util.Map;

/**
 * 订单Service接口
 */
public interface OrderService {
    
    /**
     * 根据ID查询订单详情（包含订单项）
     */
    Order getOrderById(Long id);
    
    /**
     * 根据订单号查询订单详情（包含订单项）
     */
    Order getOrderByOrderNo(String orderNo);
    
    /**
     * 根据用户ID分页查询订单列表
     */
    IPage<Order> getOrdersByUserId(Long userId, Integer page, Integer size);
    
    /**
     * 根据用户ID和订单状态分页查询订单列表
     */
    IPage<Order> getOrdersByUserIdAndStatus(Long userId, String orderStatus, Integer page, Integer size);
    
    /**
     * 创建订单
     */
    Order createOrder(Order order);
    
    /**
     * 更新订单状态
     */
    boolean updateOrderStatus(Long orderId, Order.OrderStatus orderStatus);
    
    /**
     * 更新支付状态
     */
    boolean updatePaymentStatus(Long orderId, Order.PaymentStatus paymentStatus);
    
    /**
     * 取消订单
     */
    boolean cancelOrder(Long orderId, String cancelReason);
    
    /**
     * 发货
     */
    boolean shipOrder(Long orderId);
    
    /**
     * 确认收货
     */
    boolean confirmDelivery(Long orderId);
    
    /**
     * 完成订单
     */
    boolean completeOrder(Long orderId);
    
    /**
     * 统计用户各状态订单数量
     */
    Map<String, Long> countOrdersByUserIdAndStatus(Long userId);
    
    /**
     * 删除订单
     */
    boolean deleteOrder(Long orderId);
    
    /**
     * 获取所有订单（管理员用）
     */
    IPage<Order> getAllOrders(Integer page, Integer size);
} 