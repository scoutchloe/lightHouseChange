package com.lighthouse.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 解决方案VO类 - 用于前端显示
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolutionVO {
    
    /**
     * 解决方案ID
     */
    private Long id;
    
    /**
     * 解决方案标题
     */
    private String title;
    
    /**
     * 价格
     */
    private BigDecimal price;
    
    /**
     * 评分
     */
    private BigDecimal rating;
    
    /**
     * 解决方案图片URL
     */
    private String image;
    
    /**
     * 解决方案描述
     */
    private String description;
    
    /**
     * 适用空间ID - 兼容前端的space字段
     */
    private Integer space;
    
    /**
     * 解决的问题ID数组 - 兼容前端的problems字段
     */
    private List<Integer> problems;
    
    /**
     * 标签数组 - 兼容前端的tags字段
     */
    private List<String> tags;
    
    /**
     * 方案优势
     */
    private String benefits;
    
    /**
     * 所需材料
     */
    private String materials;
    
    /**
     * 实施步骤
     */
    private String steps;
    
    /**
     * 难度等级：1-简单，2-中等，3-困难
     */
    private Integer difficultyLevel;
    
    /**
     * 所需时间
     */
    private String timeRequired;
    
    /**
     * 是否热门
     */
    private Boolean isHot;
    
    /**
     * 浏览次数
     */
    private Integer viewCount;
    
    /**
     * 收藏次数
     */
    private Integer favoriteCount;
    
    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
} 