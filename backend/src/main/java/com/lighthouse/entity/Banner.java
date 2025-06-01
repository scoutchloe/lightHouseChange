package com.lighthouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 轮播图实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("banners")
public class Banner {
    
    /**
     * 轮播图ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 轮播图标题
     */
    @TableField("title")
    private String title;
    
    /**
     * 轮播图图片URL
     */
    @TableField("image")
    private String image;
    
    /**
     * 跳转链接
     */
    @TableField("link")
    private String link;
    
    /**
     * 排序权重，数字越大越靠前
     */
    @TableField("sort")
    private Integer sort;
    
    /**
     * 状态：1-启用，0-禁用
     */
    @TableField("status")
    private Boolean status;
    
    /**
     * 是否为底部导航栏轮播图：1-是，0-否
     */
    @TableField("is_tab_bar")
    private Boolean isTabBar;
    
    /**
     * 轮播图描述
     */
    @TableField("description")
    private String description;
    
    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
} 