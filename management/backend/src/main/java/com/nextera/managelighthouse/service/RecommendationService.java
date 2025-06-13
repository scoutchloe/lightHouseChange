package com.nextera.managelighthouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.nextera.managelighthouse.entity.Recommendation;

import java.util.List;

/**
 * 推荐内容服务接口
 */
public interface RecommendationService extends IService<Recommendation> {
    
    /**
     * 分页查询启用状态的推荐内容
     */
    IPage<Recommendation> getActiveRecommendations(Page<Recommendation> page);
    
    /**
     * 根据关键词搜索推荐内容
     */
    IPage<Recommendation> searchRecommendations(Page<Recommendation> page, String keyword);
    
    /**
     * 获取热门推荐内容
     */
    List<Recommendation> getHotRecommendations(Integer limit);
    
    /**
     * 根据条件分页查询推荐内容（管理端使用）
     */
    IPage<Recommendation> pageWithConditions(Page<Recommendation> page, String keyword, Integer status, Boolean isHot);
    
    /**
     * 批量更新状态
     */
    boolean batchUpdateStatus(List<Long> ids, Integer status);
    
    /**
     * 批量更新热门状态
     */
    boolean batchUpdateHotStatus(List<Long> ids, Integer isHot);
    
    /**
     * 批量删除推荐内容
     */
    boolean batchDelete(List<Long> ids);
    
    /**
     * 更新推荐内容状态
     */
    boolean updateStatus(Long id, Integer status);
} 