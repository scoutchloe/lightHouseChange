package com.lighthouse.mapper;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lighthouse.entity.Banner;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Banner Mapper 接口
 */
@Mapper
public interface BannerMapper extends BaseMapper<Banner> {
    
    /**
     * 获取启用状态的轮播图列表，按排序权重降序
     */
    List<Banner> findActiveBannersOrderBySort();
    
    /**
     * 获取底部导航栏轮播图
     */
    List<Banner> findTabBarBanners();
    
    /**
     * 根据状态查询轮播图
     */
    List<Banner> findByStatus(@Param("status") Boolean status);
    
    /**
     * 根据标题模糊查询
     */
    List<Banner> findByTitleContaining(@Param("title") String title);
    
    /**
     * 查询所有轮播图，按排序权重降序
     */
    List<Banner> findAllOrderBySort();
} 