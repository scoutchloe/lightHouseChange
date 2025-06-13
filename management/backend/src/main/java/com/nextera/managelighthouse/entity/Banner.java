package com.nextera.managelighthouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 轮播图实体
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("banners")
public class Banner {
    
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
     * 状态：0-禁用，1-启用
     */
    @TableField("status")
    private Integer status;
    
    /**
     * 是否为底部导航栏轮播图：0-否，1-是
     */
    @TableField("is_tab_bar")
    private Integer isTabBar;
    
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
    
    /**
     * 是否删除：0-未删除，1-已删除
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;
} 