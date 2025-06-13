package com.nextera.managelighthouse.mapper;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nextera.managelighthouse.entity.Problem;
import org.apache.ibatis.annotations.Mapper;

/**
 * 问题管理Mapper接口
 */
@Mapper
@DS("slave")
public interface ProblemMapper extends BaseMapper<Problem> {
} 