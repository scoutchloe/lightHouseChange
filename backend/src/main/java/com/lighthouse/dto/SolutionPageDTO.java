package com.lighthouse.dto;

import lombok.Data;

/**
 * 解决方案分页查询DTO
 */
@Data
public class SolutionPageDTO {
    
    /**
     * 页码，从1开始
     */
    private Long page = 1L;
    
    /**
     * 每页大小
     */
    private Long pageSize = 10L;
    
    /**
     * 空间ID
     */
    private Integer spaceId;
    
    /**
     * 搜索关键词
     */
    private String keyword;
    
    /**
     * 是否只查询热门
     */
    private Boolean hotOnly = false;
} 