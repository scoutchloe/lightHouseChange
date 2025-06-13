package com.nextera.managelighthouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nextera.managelighthouse.entity.Recommendation;
import com.nextera.managelighthouse.mapper.RecommendationMapper;
import com.nextera.managelighthouse.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 推荐内容服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl extends ServiceImpl<RecommendationMapper, Recommendation> implements RecommendationService {
    
    @Override
    public IPage<Recommendation> getActiveRecommendations(Page<Recommendation> page) {
        LambdaQueryWrapper<Recommendation> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Recommendation::getStatus, 1)
                   .orderByDesc(Recommendation::getSort, Recommendation::getCreatedAt);
        return page(page, queryWrapper);
    }
    
    @Override
    public IPage<Recommendation> searchRecommendations(Page<Recommendation> page, String keyword) {
        LambdaQueryWrapper<Recommendation> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Recommendation::getStatus, 1)
                   .and(wrapper -> wrapper.like(Recommendation::getTitle, keyword)
                                         .or()
                                         .like(Recommendation::getDescription, keyword))
                   .orderByDesc(Recommendation::getSort, Recommendation::getCreatedAt);
        return page(page, queryWrapper);
    }
    
    @Override
    public List<Recommendation> getHotRecommendations(Integer limit) {
        LambdaQueryWrapper<Recommendation> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Recommendation::getStatus, 1)
                   .eq(Recommendation::getIsHot, 1)
                   .orderByDesc(Recommendation::getSort, Recommendation::getCreatedAt);
        
        if (limit != null && limit > 0) {
            queryWrapper.last("LIMIT " + limit);
        }
        
        return list(queryWrapper);
    }
    
    @Override
    public IPage<Recommendation> pageWithConditions(Page<Recommendation> page, String keyword, Integer status, Boolean isHot) {
        LambdaQueryWrapper<Recommendation> queryWrapper = new LambdaQueryWrapper<>();
        
        // 关键词搜索
        if (StringUtils.hasText(keyword)) {
            queryWrapper.and(wrapper -> wrapper.like(Recommendation::getTitle, keyword)
                                               .or()
                                               .like(Recommendation::getDescription, keyword));
        }
        
        // 状态筛选
        if (status != null) {
            queryWrapper.eq(Recommendation::getStatus, status);
        }
        
        // 热门筛选
        if (isHot != null) {
            queryWrapper.eq(Recommendation::getIsHot, isHot ? 1 : 0);
        }
        
        // 排序
        queryWrapper.orderByDesc(Recommendation::getSort, Recommendation::getCreatedAt);
        
        return page(page, queryWrapper);
    }
    
    @Override
    public boolean batchUpdateStatus(List<Long> ids, Integer status) {
        if (ids.isEmpty()) {
            return false;
        }
        
        Recommendation recommendation = new Recommendation();
        recommendation.setStatus(status);
        
        LambdaQueryWrapper<Recommendation> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(Recommendation::getId, ids);
        
        return update(recommendation, queryWrapper);
    }
    
    @Override
    public boolean batchUpdateHotStatus(List<Long> ids, Integer isHot) {
        if (ids.isEmpty()) {
            return false;
        }
        
        Recommendation recommendation = new Recommendation();
        recommendation.setIsHot(isHot);
        
        LambdaQueryWrapper<Recommendation> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(Recommendation::getId, ids);
        
        return update(recommendation, queryWrapper);
    }
    
    @Override
    public boolean batchDelete(List<Long> ids) {
        if (ids.isEmpty()) {
            return false;
        }
        return removeByIds(ids);
    }
    
    @Override
    public boolean updateStatus(Long id, Integer status) {
        Recommendation recommendation = new Recommendation();
        recommendation.setId(id);
        recommendation.setStatus(status);
        return updateById(recommendation);
    }
} 