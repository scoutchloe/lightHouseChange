package com.nextera.managelighthouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 解决方案实体
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("solutions")
public class Solution {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 解决方案标题
     */
    @TableField("title")
    private String title;
    
    /**
     * 价格
     */
    @TableField("price")
    private BigDecimal price;
    
    /**
     * 评分
     */
    @TableField("rating")
    private BigDecimal rating;
    
    /**
     * 解决方案图片URL
     */
    @TableField("image")
    private String image;
    
    /**
     * 解决方案描述
     */
    @TableField("description")
    private String description;
    
    /**
     * 适用空间ID
     */
    @TableField("space_id")
    private Long spaceId;
    
    /**
     * 解决的问题ID数组（JSON格式存储）
     */
    @TableField("problems")
    private String problems;
    
    /**
     * 标签数组（JSON格式存储）
     */
    @TableField("tags")
    private String tags;
    
    /**
     * 方案优势
     */
    @TableField("benefits")
    private String benefits;
    
    /**
     * 所需材料
     */
    @TableField("materials")
    private String materials;
    
    /**
     * 实施步骤
     */
    @TableField("steps")
    private String steps;
    
    /**
     * 难度等级：1-简单，2-中等，3-困难
     */
    @TableField("difficulty_level")
    private Integer difficultyLevel;
    
    /**
     * 所需时间
     */
    @TableField("time_required")
    private String timeRequired;
    
    /**
     * 是否热门
     */
    @TableField("is_hot")
    private Integer isHot;
    
    /**
     * 浏览次数
     */
    @TableField("view_count")
    private Integer viewCount;
    
    /**
     * 收藏次数
     */
    @TableField("favorite_count")
    private Integer favoriteCount;
    
    /**
     * 状态：0-禁用，1-启用
     */
    @TableField("status")
    private Integer status;
    
    /**
     * 排序权重
     */
    @TableField("sort_order")
    private Integer sortOrder;
    
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
    private LocalDateTime updatedAt;
    
    /**
     * 是否删除：0-未删除，1-已删除
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;
} 