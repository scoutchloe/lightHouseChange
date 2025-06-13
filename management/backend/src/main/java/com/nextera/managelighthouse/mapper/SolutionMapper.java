package com.nextera.managelighthouse.mapper;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nextera.managelighthouse.entity.Solution;
import org.apache.ibatis.annotations.Mapper;

/**
 * 解决方案管理Mapper接口
 */
@Mapper
@DS("slave")
public interface SolutionMapper extends BaseMapper<Solution> {
} 