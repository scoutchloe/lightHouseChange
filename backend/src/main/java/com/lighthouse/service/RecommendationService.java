package com.lighthouse.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lighthouse.entity.Recommendation;

import java.util.List;

/**
 * 推荐内容服务接口
 */
public interface RecommendationService extends IService<Recommendation> {
    
    /**
     * 获取启用状态的推荐内容列表
     */
    List<Recommendation> getActiveRecommendations();
    
    /**
     * 获取热门推荐内容
     */
    List<Recommendation> getHotRecommendations(Integer limit);
} 