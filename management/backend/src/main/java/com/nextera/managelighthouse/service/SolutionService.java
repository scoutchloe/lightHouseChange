package com.nextera.managelighthouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.nextera.managelighthouse.entity.Solution;

import java.util.List;

/**
 * 解决方案服务接口
 */
public interface SolutionService extends IService<Solution> {
    
    /**
     * 分页查询启用状态的解决方案
     */
    IPage<Solution> getActiveSolutions(Page<Solution> page);
    
    /**
     * 根据空间ID分页查询解决方案
     */
    IPage<Solution> getSolutionsBySpaceId(Page<Solution> page, Integer spaceId);
    
    /**
     * 根据关键词搜索解决方案
     */
    IPage<Solution> searchSolutions(Page<Solution> page, String keyword);
    
    /**
     * 获取热门解决方案
     */
    List<Solution> getHotSolutions(Integer limit);
    
    /**
     * 根据ID获取解决方案详情（会增加浏览次数）
     */
    Solution getSolutionDetail(Long id);
    
    /**
     * 增加收藏次数
     */
    boolean incrementFavoriteCount(Long id);
    
    /**
     * 减少收藏次数
     */
    boolean decrementFavoriteCount(Long id);
    
    /**
     * 根据条件分页查询解决方案（管理端使用）
     */
    IPage<Solution> pageWithConditions(Page<Solution> page, String keyword, Integer spaceId, Boolean status, Boolean isHot);
    
    /**
     * 批量更新状态
     */
    boolean batchUpdateStatus(List<Long> ids, Boolean status);
    
    /**
     * 批量更新热门状态
     */
    boolean batchUpdateHotStatus(List<Long> ids, Boolean isHot);
} 