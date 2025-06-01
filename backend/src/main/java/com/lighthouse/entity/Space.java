package com.lighthouse.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

/**
 * 空间类型实体
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("spaces")
public class Space {
    
    /**
     * 空间ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    
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