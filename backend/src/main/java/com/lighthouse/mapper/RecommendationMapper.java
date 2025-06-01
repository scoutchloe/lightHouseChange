package com.lighthouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lighthouse.entity.Recommendation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Recommendation Mapper 接口
 */
@Mapper
public interface RecommendationMapper extends BaseMapper<Recommendation> {
    
    /**
     * 获取启用状态的推荐内容列表，按排序权重降序
     */
    List<Recommendation> findActiveRecommendationsOrderBySort();
    
    /**
     * 获取热门推荐内容
     */
    List<Recommendation> findHotRecommendations(@Param("limit") Integer limit);
    
    /**
     * 根据状态查询推荐内容
     */
    List<Recommendation> findByStatus(@Param("status") Boolean status);
    
    /**
     * 根据标题模糊查询
     */
    List<Recommendation> findByTitleContaining(@Param("title") String title);
    
    /**
     * 查询所有推荐内容，按排序权重降序
     */
    List<Recommendation> findAllOrderBySort();
} 