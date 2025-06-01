package com.lighthouse.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lighthouse.entity.Banner;

import java.util.List;

/**
 * 轮播图服务接口
 */
public interface BannerService extends IService<Banner> {
    
    /**
     * 获取启用状态的轮播图列表，按排序权重降序
     */
    List<Banner> getActiveBanners();
    
    /**
     * 获取底部导航栏轮播图
     */
    List<Banner> getTabBarBanners();
} 