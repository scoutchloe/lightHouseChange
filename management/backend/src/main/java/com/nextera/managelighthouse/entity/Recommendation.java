package com.nextera.managelighthouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 推荐内容实体
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("recommendation")
public class Recommendation {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 推荐内容标题
     */
    @TableField("title")
    private String title;

    @TableField("price")
    private BigDecimal price;

    @TableField("benefits")
    private String benefits;

    @TableField("rating")
    private Float rating;
    
    /**
     * 推荐内容描述
     */
    @TableField("description")
    private String description;
    
    /**
     * 推荐内容图片URL
     */
    @TableField("image")
    private String image;
    
    /**
     * 标签（JSON格式存储）
     */
    @TableField("tags")
    private String tags;
    
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
     * 是否为热门推荐：0-否，1-是
     */
    @TableField("is_hot")
    private Integer isHot;
    
    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    /**
     * 是否删除：0-未删除，1-已删除
     */
    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;
} 