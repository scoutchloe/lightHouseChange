package com.lighthouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 推荐内容实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("recommendation")
public class Recommendation {
    
    /**
     * 推荐内容ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 推荐内容标题
     */
    @TableField("title")
    private String title;

    private BigDecimal price;


    private String benefits;

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
     * 状态：1-启用，0-禁用
     */
    @TableField("status")
    private Boolean status;
    
    /**
     * 是否为热门推荐：1-是，0-否
     */
    @TableField("is_hot")
    private Boolean isHot;
    
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
    
    /**
     * 获取标签数组
     */
    @JsonProperty("tagsArray")
    public List<String> getTagsArray() {
        if (tags == null || tags.trim().isEmpty()) {
            return List.of();
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(tags, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return List.of();
        }
    }
} 