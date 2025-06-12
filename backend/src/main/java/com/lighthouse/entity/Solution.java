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
import java.util.ArrayList;
import java.util.List;

/**
 * 解决方案实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("solutions")
public class Solution {
    
    /**
     * 解决方案ID
     */
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
    private Integer spaceId;
    
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
     * 状态：1-启用，0-禁用
     */
    @TableField("status")
    private Boolean status;
    
    /**
     * 是否热门：1-是，0-否
     */
    @TableField("is_hot")
    private Boolean isHot;
    
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
     * 排序权重，数字越大越靠前
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
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // ========== 辅助方法 ==========
    
    /**
     * 获取问题ID数组
     */
    @JsonProperty("problemsArray")
    public List<Integer> getProblemsArray() {
        if (problems == null || problems.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(problems, new TypeReference<List<Integer>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
    
    /**
     * 设置问题ID数组
     */
    public void setProblemsArray(List<Integer> problemsArray) {
        if (problemsArray == null || problemsArray.isEmpty()) {
            this.problems = "[]";
            return;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.problems = mapper.writeValueAsString(problemsArray);
        } catch (JsonProcessingException e) {
            this.problems = "[]";
        }
    }
    
    /**
     * 获取标签数组
     */
    @JsonProperty("tagsArray")
    public List<String> getTagsArray() {
        if (tags == null || tags.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(tags, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
    
    /**
     * 设置标签数组
     */
    public void setTagsArray(List<String> tagsArray) {
        if (tagsArray == null || tagsArray.isEmpty()) {
            this.tags = "[]";
            return;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.tags = mapper.writeValueAsString(tagsArray);
        } catch (JsonProcessingException e) {
            this.tags = "[]";
        }
    }
} 