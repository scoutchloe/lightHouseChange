package com.nextera.managelighthouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.nextera.managelighthouse.entity.Banner;

import java.util.List;

/**
 * 轮播图管理Service接口
 */
public interface BannerService extends IService<Banner> {
    
    /**
     * 分页查询轮播图列表
     */
    IPage<Banner> getBannerPage(Page<Banner> page, String title, Integer status, Integer isTabBar);
    
    /**
     * 创建轮播图
     */
    Banner createBanner(Banner banner);
    
    /**
     * 更新轮播图
     */
    Banner updateBanner(Banner banner);
    
    /**
     * 删除轮播图
     */
    boolean deleteBanner(Long id);
    
    /**
     * 批量删除轮播图
     */
    boolean deleteBanners(List<Long> ids);
    
    /**
     * 更新轮播图状态
     */
    boolean updateBannerStatus(Long id, Integer status);
} 