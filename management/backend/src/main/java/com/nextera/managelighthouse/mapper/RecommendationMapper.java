package com.nextera.managelighthouse.mapper;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nextera.managelighthouse.entity.Recommendation;
import org.apache.ibatis.annotations.Mapper;

/**
 * 推荐内容管理Mapper接口
 */
@Mapper
@DS("slave")
public interface RecommendationMapper extends BaseMapper<Recommendation> {
} 