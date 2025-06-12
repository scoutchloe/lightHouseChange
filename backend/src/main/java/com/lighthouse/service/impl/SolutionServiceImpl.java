package com.lighthouse.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lighthouse.entity.Solution;
import com.lighthouse.mapper.SolutionMapper;
import com.lighthouse.service.SolutionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 解决方案服务实现类
 */
@Slf4j
@Service
public class SolutionServiceImpl extends ServiceImpl<SolutionMapper, Solution> implements SolutionService {
    
    @Override
    public IPage<Solution> getActiveSolutions(Page<Solution> page) {
        log.info("获取启用状态的解决方案列表，页码：{}，页大小：{}", page.getCurrent(), page.getSize());
        return baseMapper.selectActiveSolutions(page);
    }
    
    @Override
    public IPage<Solution> getSolutionsBySpaceId(Page<Solution> page, Integer spaceId) {
        log.info("根据空间ID获取解决方案列表，空间ID：{}，页码：{}，页大小：{}", spaceId, page.getCurrent(), page.getSize());
        return baseMapper.selectSolutionsBySpaceId(page, spaceId);
    }
    
    @Override
    public IPage<Solution> searchSolutions(Page<Solution> page, String keyword) {
        log.info("搜索解决方案，关键词：{}，页码：{}，页大小：{}", keyword, page.getCurrent(), page.getSize());
        return baseMapper.searchSolutions(page, keyword);
    }
    
    @Override
    public List<Solution> getHotSolutions(Integer limit) {
        log.info("获取热门解决方案，限制数量：{}", limit);
        return baseMapper.selectHotSolutions(limit);
    }
    
    @Override
    public Solution getSolutionDetail(Long id) {
        log.info("获取解决方案详情，ID：{}", id);
        
        // 获取解决方案详情
        Solution solution = baseMapper.selectById(id);
        if (solution == null) {
            log.warn("解决方案不存在，ID：{}", id);
            return null;
        }
        
        // 增加浏览次数
        try {
            baseMapper.incrementViewCount(id);
            log.debug("增加解决方案浏览次数成功，ID：{}", id);
        } catch (Exception e) {
            log.error("增加解决方案浏览次数失败，ID：{}", id, e);
        }
        
        return solution;
    }
    
    @Override
    public boolean incrementFavoriteCount(Long id) {
        log.info("增加解决方案收藏次数，ID：{}", id);
        try {
            int result = baseMapper.incrementFavoriteCount(id);
            if (result > 0) {
                log.debug("增加解决方案收藏次数成功，ID：{}", id);
                return true;
            } else {
                log.warn("增加解决方案收藏次数失败，ID：{}", id);
                return false;
            }
        } catch (Exception e) {
            log.error("增加解决方案收藏次数异常，ID：{}", id, e);
            return false;
        }
    }
    
    @Override
    public boolean decrementFavoriteCount(Long id) {
        log.info("减少解决方案收藏次数，ID：{}", id);
        try {
            int result = baseMapper.decrementFavoriteCount(id);
            if (result > 0) {
                log.debug("减少解决方案收藏次数成功，ID：{}", id);
                return true;
            } else {
                log.warn("减少解决方案收藏次数失败，ID：{}", id);
                return false;
            }
        } catch (Exception e) {
            log.error("减少解决方案收藏次数异常，ID：{}", id, e);
            return false;
        }
    }
} 