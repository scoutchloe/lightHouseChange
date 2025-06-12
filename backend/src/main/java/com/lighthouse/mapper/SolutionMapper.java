package com.lighthouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lighthouse.entity.Solution;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 解决方案Mapper接口
 */
@Mapper
public interface SolutionMapper extends BaseMapper<Solution> {
    
    /**
     * 分页查询启用状态的解决方案
     */
    IPage<Solution> selectActiveSolutions(Page<Solution> page);
    
    /**
     * 根据空间ID分页查询解决方案
     */
    IPage<Solution> selectSolutionsBySpaceId(Page<Solution> page, @Param("spaceId") Integer spaceId);
    
    /**
     * 根据关键词搜索解决方案
     */
    IPage<Solution> searchSolutions(Page<Solution> page, @Param("keyword") String keyword);
    
    /**
     * 获取热门解决方案
     */
    List<Solution> selectHotSolutions(@Param("limit") Integer limit);
    
    /**
     * 根据多个条件查询解决方案（支持动态查询）
     */
    IPage<Solution> selectSolutionsByCondition(Page<Solution> page, @Param("id") Long id, 
                                               @Param("title") String title, 
                                               @Param("spaceId") Integer spaceId,
                                               @Param("status") Boolean status, 
                                               @Param("isHot") Boolean isHot,
                                               @Param("orderBy") String orderBy);
    
    /**
     * 增加浏览次数
     */
    int incrementViewCount(@Param("id") Long id);
    
    /**
     * 增加收藏次数
     */
    int incrementFavoriteCount(@Param("id") Long id);
    
    /**
     * 减少收藏次数
     */
    int decrementFavoriteCount(@Param("id") Long id);
    
    /**
     * 批量更新解决方案状态
     */
    int updateSolutionStatus(@Param("ids") List<Long> ids, @Param("status") Boolean status);
    
    /**
     * 批量更新热门标记
     */
    int updateHotStatus(@Param("ids") List<Long> ids, @Param("isHot") Boolean isHot);
    
    /**
     * 根据空间ID获取解决方案数量
     */
    int countSolutionsBySpaceId(@Param("spaceId") Integer spaceId);
    
    /**
     * 获取热门解决方案数量
     */
    int countHotSolutions();
    
    /**
     * 根据标签搜索解决方案
     */
    IPage<Solution> selectSolutionsByTag(Page<Solution> page, @Param("tag") String tag);
    
    /**
     * 根据问题ID搜索解决方案
     */
    IPage<Solution> selectSolutionsByProblemId(Page<Solution> page, @Param("problemId") Integer problemId);
    
    /**
     * 获取最受欢迎的解决方案（按收藏数排序）
     */
    List<Solution> selectMostFavoriteSolutions(@Param("limit") Integer limit);
    
    /**
     * 获取最新的解决方案
     */
    List<Solution> selectLatestSolutions(@Param("limit") Integer limit);
} 