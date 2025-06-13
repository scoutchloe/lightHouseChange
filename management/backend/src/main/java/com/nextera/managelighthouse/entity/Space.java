package com.nextera.managelighthouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 空间类型实体
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("spaces")
public class Space {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 空间名称
     */
    @TableField("name")
    private String name;
    
    /**
     * 图标名称
     */
    @TableField("icon")
    private String icon;
    
    /**
     * 图标颜色
     */
    @TableField("icon_color")
    private String iconColor;
    
    /**
     * 空间描述
     */
    @TableField("description")
    private String description;
    
    /**
     * 空间图片URL
     */
    @TableField("image")
    private String image;
    
    /**
     * 状态：0-禁用，1-启用
     */
    @TableField("status")
    private Integer status;

    /**
     * 排序权重
     */
    @TableField("sort")
    private Integer sort;
    
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