package com.nextera.managelighthouse.mapper;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nextera.managelighthouse.entity.Space;
import org.apache.ibatis.annotations.Mapper;

/**
 * 空间管理Mapper接口
 */
@Mapper
@DS("slave")
public interface SpaceMapper extends BaseMapper<Space> {
} 