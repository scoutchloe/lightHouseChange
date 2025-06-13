package com.nextera.managelighthouse.mapper;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nextera.managelighthouse.entity.Banner;
import org.apache.ibatis.annotations.Mapper;

/**
 * 轮播图管理Mapper接口
 */
@Mapper
@DS("slave")
public interface BannerMapper extends BaseMapper<Banner> {
} 