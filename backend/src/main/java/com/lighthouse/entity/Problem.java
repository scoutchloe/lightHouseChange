package com.lighthouse.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * 问题类型实体
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Problem {
    
    /**
     * 问题ID
     */
    private Integer id;
    
    /**
     * 问题名称
     */
    private String name;
    
    /**
     * 图标名称
     */
    private String icon;
    
    /**
     * 问题描述
     */
    private String description;
    
    /**
     * 所属空间ID
     */
    private Integer spaceId;
} 