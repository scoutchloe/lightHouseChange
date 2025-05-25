package com.lighthouse.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * 空间类型实体
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Space {
    
    /**
     * 空间ID
     */
    private Integer id;
    
    /**
     * 空间名称
     */
    private String name;
    
    /**
     * 图标名称
     */
    private String icon;
    
    /**
     * 图标颜色
     */
    private String iconColor;
    
    /**
     * 空间描述
     */
    private String description;
    
    /**
     * 空间图片URL
     */
    private String image;
} 