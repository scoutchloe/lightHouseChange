package com.nextera.managelighthouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nextera.managelighthouse.entity.Solution;
import com.nextera.managelighthouse.mapper.SolutionMapper;
import com.nextera.managelighthouse.service.SolutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 解决方案服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SolutionServiceImpl extends ServiceImpl<SolutionMapper, Solution> implements SolutionService {
    
    @Override
    public IPage<Solution> getActiveSolutions(Page<Solution> page) {
        LambdaQueryWrapper<Solution> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Solution::getStatus, 1)
                   .orderByDesc(Solution::getSortOrder, Solution::getCreatedAt);
        return page(page, queryWrapper);
    }
    
    @Override
    public IPage<Solution> getSolutionsBySpaceId(Page<Solution> page, Integer spaceId) {
        LambdaQueryWrapper<Solution> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Solution::getStatus, 1)
                   .eq(Solution::getSpaceId, spaceId)
                   .orderByDesc(Solution::getSortOrder, Solution::getCreatedAt);
        return page(page, queryWrapper);
    }
    
    @Override
    public IPage<Solution> searchSolutions(Page<Solution> page, String keyword) {
        LambdaQueryWrapper<Solution> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Solution::getStatus, 1)
                   .and(wrapper -> wrapper.like(Solution::getTitle, keyword)
                                         .or()
                                         .like(Solution::getDescription, keyword))
                   .orderByDesc(Solution::getSortOrder, Solution::getCreatedAt);
        return page(page, queryWrapper);
    }
    
    @Override
    public List<Solution> getHotSolutions(Integer limit) {
        LambdaQueryWrapper<Solution> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Solution::getStatus, 1)
                   .eq(Solution::getIsHot, 1)
                   .orderByDesc(Solution::getSortOrder, Solution::getCreatedAt);
        
        if (limit != null && limit > 0) {
            queryWrapper.last("LIMIT " + limit);
        }
        
        return list(queryWrapper);
    }
    
    @Override
    public Solution getSolutionDetail(Long id) {
        Solution solution = getById(id);
        if (solution != null) {
            // 增加浏览次数
            solution.setViewCount(solution.getViewCount() == null ? 1 : solution.getViewCount() + 1);
            updateById(solution);
        }
        return solution;
    }
    
    @Override
    public boolean incrementFavoriteCount(Long id) {
        Solution solution = getById(id);
        if (solution != null) {
            solution.setFavoriteCount(solution.getFavoriteCount() == null ? 1 : solution.getFavoriteCount() + 1);
            return updateById(solution);
        }
        return false;
    }
    
    @Override
    public boolean decrementFavoriteCount(Long id) {
        Solution solution = getById(id);
        if (solution != null && (solution.getFavoriteCount() == null || solution.getFavoriteCount() > 0)) {
            solution.setFavoriteCount(solution.getFavoriteCount() == null ? 0 : Math.max(0, solution.getFavoriteCount() - 1));
            return updateById(solution);
        }
        return false;
    }
    
    @Override
    public IPage<Solution> pageWithConditions(Page<Solution> page, String keyword, Integer spaceId, Boolean status, Boolean isHot) {
        LambdaQueryWrapper<Solution> queryWrapper = new LambdaQueryWrapper<>();
        
        // 关键词搜索
        if (StringUtils.hasText(keyword)) {
            queryWrapper.and(wrapper -> wrapper.like(Solution::getTitle, keyword)
                                               .or()
                                               .like(Solution::getDescription, keyword));
        }
        
        // 空间ID筛选
        if (spaceId != null) {
            queryWrapper.eq(Solution::getSpaceId, spaceId);
        }
        
        // 状态筛选
        if (status != null) {
            queryWrapper.eq(Solution::getStatus, status ? 1 : 0);
        }
        
        // 热门筛选
        if (isHot != null) {
            queryWrapper.eq(Solution::getIsHot, isHot ? 1 : 0);
        }
        
        // 排序
        queryWrapper.orderByDesc(Solution::getSortOrder, Solution::getCreatedAt);
        
        return page(page, queryWrapper);
    }
    
    @Override
    public boolean batchUpdateStatus(List<Long> ids, Boolean status) {
        if (ids.isEmpty()) {
            return false;
        }
        
        Solution solution = new Solution();
        solution.setStatus(status ? 1 : 0);
        
        LambdaQueryWrapper<Solution> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(Solution::getId, ids);
        
        return update(solution, queryWrapper);
    }
    
    @Override
    public boolean batchUpdateHotStatus(List<Long> ids, Boolean isHot) {
        if (ids.isEmpty()) {
            return false;
        }
        
        Solution solution = new Solution();
        solution.setIsHot(isHot ? 1 : 0);
        
        LambdaQueryWrapper<Solution> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.in(Solution::getId, ids);
        
        return update(solution, queryWrapper);
    }
} 