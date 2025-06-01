package com.lighthouse.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

/**
 * 问题类型实体
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("problems")
public class Problem {
    
    /**
     * 问题ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    
    /**
     * 问题名称
     */
    @TableField("name")
    private String name;
    
    /**
     * 图标名称
     */
    @TableField("icon")
    private String icon;
    
    /**
     * 问题描述
     */
    @TableField("description")
    private String description;
    
    /**
     * 所属空间ID
     */
    @TableField("space_id")
    private Integer spaceId;
    
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