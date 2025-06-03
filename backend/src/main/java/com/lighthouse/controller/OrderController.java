package com.lighthouse.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.lighthouse.entity.Order;
import com.lighthouse.exception.BusinessException;
import com.lighthouse.common.ApiResponse;
import com.lighthouse.common.LogUtil;
import com.lighthouse.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 订单Controller
 */
@RestController
@RequestMapping("/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    /**
     * 根据ID查询订单详情
     */
    @GetMapping("/{id}")
    public ApiResponse<Order> getOrderById(@PathVariable Long id) {
        LogUtil.business("查询订单", "根据ID查询订单详情", id);
        Order order = orderService.getOrderById(id);
        if (order != null) {
            return ApiResponse.success(order);
        } else {
            throw new BusinessException("订单不存在");
        }
    }
    
    /**
     * 根据订单号查询订单详情
     */
    @GetMapping("/orderNo/{orderNo}")
    public ApiResponse<Order> getOrderByOrderNo(@PathVariable String orderNo) {
        LogUtil.business("查询订单", "根据订单号查询订单详情", orderNo);
        Order order = orderService.getOrderByOrderNo(orderNo);
        if (order != null) {
            return ApiResponse.success(order);
        } else {
            throw new BusinessException("订单不存在");
        }
    }
    
    /**
     * 根据用户ID分页查询订单列表
     */
    @GetMapping("/user/{userId}")
    public ApiResponse<IPage<Order>> getOrdersByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        LogUtil.business("查询订单列表", "根据用户ID分页查询", userId, page, size);
        IPage<Order> orders = orderService.getOrdersByUserId(userId, page, size);
        return ApiResponse.success(orders);
    }
    
    /**
     * 根据用户ID和订单状态分页查询订单列表
     */
    @GetMapping("/user/{userId}/status/{orderStatus}")
    public ApiResponse<IPage<Order>> getOrdersByUserIdAndStatus(
            @PathVariable Long userId,
            @PathVariable String orderStatus,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        LogUtil.business("查询订单列表", "根据用户ID和状态分页查询", userId, orderStatus, page, size);
        IPage<Order> orders = orderService.getOrdersByUserIdAndStatus(userId, orderStatus, page, size);
        return ApiResponse.success(orders);
    }
    
    /**
     * 创建订单
     */
    @PostMapping
    public ApiResponse<Order> createOrder(@RequestBody Order order) {
        LogUtil.business("创建订单", "用户创建新订单", order.getUserId());
        Order createdOrder = orderService.createOrder(order);
        LogUtil.userAction(String.valueOf(order.getUserId()), "创建订单", "订单号: " + createdOrder.getOrderNo());
        return ApiResponse.success(createdOrder);
    }
    
    /**
     * 更新订单状态
     */
    @PutMapping("/{id}/status")
    public ApiResponse<Boolean> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String orderStatus) {
        LogUtil.business("更新订单状态", "订单状态变更", id, orderStatus);
        Order.OrderStatus status = Order.OrderStatus.valueOf(orderStatus);
        boolean success = orderService.updateOrderStatus(id, status);
        if (success) {
            return ApiResponse.success(true);
        } else {
            throw new BusinessException("更新订单状态失败");
        }
    }
    
    /**
     * 更新支付状态
     */
    @PutMapping("/{id}/payment")
    public ApiResponse<Boolean> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam String paymentStatus) {
        LogUtil.business("更新支付状态", "支付状态变更", id, paymentStatus);
        Order.PaymentStatus status = Order.PaymentStatus.valueOf(paymentStatus);
        boolean success = orderService.updatePaymentStatus(id, status);
        if (success) {
            return ApiResponse.success(true);
        } else {
            throw new BusinessException("更新支付状态失败");
        }
    }
    
    /**
     * 取消订单
     */
    @PutMapping("/{id}/cancel")
    public ApiResponse<Boolean> cancelOrder(
            @PathVariable Long id,
            @RequestParam(required = false) String cancelReason) {
        LogUtil.business("取消订单", "用户取消订单", id, cancelReason);
        boolean success = orderService.cancelOrder(id, cancelReason);
        if (success) {
            return ApiResponse.success(true);
        } else {
            throw new BusinessException("取消订单失败");
        }
    }
    
    /**
     * 发货
     */
    @PutMapping("/{id}/ship")
    public ApiResponse<Boolean> shipOrder(@PathVariable Long id) {
        LogUtil.business("订单发货", "商家发货", id);
        boolean success = orderService.shipOrder(id);
        if (success) {
            return ApiResponse.success(true);
        } else {
            throw new BusinessException("发货失败");
        }
    }
    
    /**
     * 确认收货
     */
    @PutMapping("/{id}/confirm")
    public ApiResponse<Boolean> confirmDelivery(@PathVariable Long id) {
        LogUtil.business("确认收货", "用户确认收货", id);
        boolean success = orderService.confirmDelivery(id);
        if (success) {
            return ApiResponse.success(true);
        } else {
            throw new BusinessException("确认收货失败");
        }
    }
    
    /**
     * 完成订单
     */
    @PutMapping("/{id}/complete")
    public ApiResponse<Boolean> completeOrder(@PathVariable Long id) {
        LogUtil.business("完成订单", "订单完成", id);
        boolean success = orderService.completeOrder(id);
        if (success) {
            return ApiResponse.success(true);
        } else {
            throw new BusinessException("完成订单失败");
        }
    }
    
    /**
     * 统计用户各状态订单数量
     */
    @GetMapping("/user/{userId}/count")
    public ApiResponse<Map<String, Long>> countOrdersByUserIdAndStatus(@PathVariable Long userId) {
        LogUtil.business("统计订单", "统计用户各状态订单数量", userId);
        Map<String, Long> counts = orderService.countOrdersByUserIdAndStatus(userId);
        return ApiResponse.success(counts);
    }
    
    /**
     * 删除订单
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> deleteOrder(@PathVariable Long id) {
        LogUtil.business("删除订单", "删除订单记录", id);
        boolean success = orderService.deleteOrder(id);
        if (success) {
            return ApiResponse.success(true);
        } else {
            throw new BusinessException("删除订单失败");
        }
    }
    
    /**
     * 获取所有订单（管理员用）
     */
    @GetMapping("/admin/all")
    public ApiResponse<IPage<Order>> getAllOrders(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        LogUtil.business("管理员查询", "获取所有订单", page, size);
        IPage<Order> orders = orderService.getAllOrders(page, size);
        return ApiResponse.success(orders);
    }
} 