package com.lighthouse.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lighthouse.entity.Recommendation;
import com.lighthouse.mapper.RecommendationMapper;
import com.lighthouse.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 推荐内容服务实现类
 */
@Service
public class RecommendationServiceImpl extends ServiceImpl<RecommendationMapper, Recommendation> implements RecommendationService {

    @Autowired
    private RecommendationMapper recommendationMapper;

    @Override
    public List<Recommendation> getActiveRecommendations() {
        return recommendationMapper.findActiveRecommendationsOrderBySort();
    }

    @Override
    public List<Recommendation> getHotRecommendations(Integer limit) {
        return recommendationMapper.findHotRecommendations(limit);
    }
} 