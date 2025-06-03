package com.lighthouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("orders")
public class Order {
    
    /**
     * 订单ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 订单号
     */
    @TableField("order_no")
    private String orderNo;
    
    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;
    
    /**
     * 订单类型
     */
    @TableField("order_type")
    private OrderType orderType;
    
    /**
     * 订单状态
     */
    @TableField("order_status")
    private OrderStatus orderStatus;
    
    /**
     * 支付状态
     */
    @TableField("payment_status")
    private PaymentStatus paymentStatus;
    
    /**
     * 订单总金额
     */
    @TableField("total_amount")
    private BigDecimal totalAmount;
    
    /**
     * 优惠金额
     */
    @TableField("discount_amount")
    private BigDecimal discountAmount;
    
    /**
     * 运费
     */
    @TableField("shipping_fee")
    private BigDecimal shippingFee;
    
    /**
     * 实际支付金额
     */
    @TableField("actual_amount")
    private BigDecimal actualAmount;
    
    /**
     * 支付方式
     */
    @TableField("payment_method")
    private PaymentMethod paymentMethod;
    
    /**
     * 支付时间
     */
    @TableField("payment_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime paymentTime;
    
    /**
     * 收货地址ID
     */
    @TableField("shipping_address_id")
    private Long shippingAddressId;
    
    /**
     * 收货人姓名
     */
    @TableField("shipping_name")
    private String shippingName;
    
    /**
     * 收货人电话
     */
    @TableField("shipping_phone")
    private String shippingPhone;
    
    /**
     * 收货地址详情
     */
    @TableField("shipping_address")
    private String shippingAddress;
    
    /**
     * 发货时间
     */
    @TableField("shipping_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime shippingTime;
    
    /**
     * 送达时间
     */
    @TableField("delivery_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime deliveryTime;
    
    /**
     * 完成时间
     */
    @TableField("completion_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime completionTime;
    
    /**
     * 取消原因
     */
    @TableField("cancel_reason")
    private String cancelReason;
    
    /**
     * 取消时间
     */
    @TableField("cancel_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime cancelTime;
    
    /**
     * 订单备注
     */
    @TableField("remark")
    private String remark;
    
    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    /**
     * 订单项列表（非数据库字段）
     */
    @TableField(exist = false)
    private List<OrderItem> orderItems;
    
    /**
     * 订单类型枚举
     */
    public enum OrderType {
        SOLUTION("SOLUTION", "方案订单"),
        PRODUCT("PRODUCT", "商品订单"),
        MIXED("MIXED", "混合订单");
        
        private final String code;
        private final String description;
        
        OrderType(String code, String description) {
            this.code = code;
            this.description = description;
        }
        
        public String getCode() {
            return code;
        }
        
        public String getDescription() {
            return description;
        }
    }
    
    /**
     * 订单状态枚举
     */
    public enum OrderStatus {
        PENDING_PAYMENT("PENDING_PAYMENT", "待付款"),
        PAID("PAID", "已付款"),
        SHIPPED("SHIPPED", "已发货"),
        DELIVERED("DELIVERED", "已送达"),
        COMPLETED("COMPLETED", "已完成"),
        CANCELLED("CANCELLED", "已取消"),
        REFUNDED("REFUNDED", "已退款");
        
        private final String code;
        private final String description;
        
        OrderStatus(String code, String description) {
            this.code = code;
            this.description = description;
        }
        
        public String getCode() {
            return code;
        }
        
        public String getDescription() {
            return description;
        }
    }
    
    /**
     * 支付状态枚举
     */
    public enum PaymentStatus {
        UNPAID("UNPAID", "未支付"),
        PAID("PAID", "已支付"),
        REFUNDED("REFUNDED", "已退款");
        
        private final String code;
        private final String description;
        
        PaymentStatus(String code, String description) {
            this.code = code;
            this.description = description;
        }
        
        public String getCode() {
            return code;
        }
        
        public String getDescription() {
            return description;
        }
    }
    
    /**
     * 支付方式枚举
     */
    public enum PaymentMethod {
        WECHAT("WECHAT", "微信支付"),
        ALIPAY("ALIPAY", "支付宝");
        
        private final String code;
        private final String description;
        
        PaymentMethod(String code, String description) {
            this.code = code;
            this.description = description;
        }
        
        public String getCode() {
            return code;
        }
        
        public String getDescription() {
            return description;
        }
    }
} 