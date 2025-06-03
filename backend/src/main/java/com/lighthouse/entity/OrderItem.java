package com.lighthouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * 订单项实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("order_item")
public class OrderItem {
    
    /**
     * 订单项ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 订单ID
     */
    @TableField("order_id")
    private Long orderId;
    
    /**
     * 商品类型
     */
    @TableField("item_type")
    private ItemType itemType;
    
    /**
     * 商品ID
     */
    @TableField("item_id")
    private Long itemId;
    
    /**
     * 商品名称
     */
    @TableField("item_name")
    private String itemName;
    
    /**
     * 商品图片
     */
    @TableField("item_image")
    private String itemImage;
    
    /**
     * 商品描述
     */
    @TableField("item_description")
    private String itemDescription;
    
    /**
     * 单价
     */
    @TableField("unit_price")
    private BigDecimal unitPrice;
    
    /**
     * 数量
     */
    @TableField("quantity")
    private Integer quantity;
    
    /**
     * 小计金额
     */
    @TableField("total_price")
    private BigDecimal totalPrice;
    
    /**
     * 商品规格（JSON格式）
     */
    @TableField("specifications")
    private String specifications;
    
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
     * 获取规格信息Map
     */
    public Map<String, Object> getSpecificationsMap() {
        if (specifications == null || specifications.trim().isEmpty()) {
            return Map.of();
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(specifications, new TypeReference<Map<String, Object>>() {});
        } catch (JsonProcessingException e) {
            return Map.of();
        }
    }
    
    /**
     * 设置规格信息Map
     */
    public void setSpecificationsMap(Map<String, Object> specificationsMap) {
        if (specificationsMap == null || specificationsMap.isEmpty()) {
            this.specifications = null;
            return;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.specifications = mapper.writeValueAsString(specificationsMap);
        } catch (JsonProcessingException e) {
            this.specifications = null;
        }
    }
    
    /**
     * 商品类型枚举
     */
    public enum ItemType {
        SOLUTION("SOLUTION", "改造方案"),
        PRODUCT("PRODUCT", "商品");
        
        private final String code;
        private final String description;
        
        ItemType(String code, String description) {
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