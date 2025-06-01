package com.lighthouse.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lighthouse.entity.Banner;
import com.lighthouse.mapper.BannerMapper;
import com.lighthouse.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 轮播图服务实现类
 */
@Service
public class BannerServiceImpl extends ServiceImpl<BannerMapper, Banner> implements BannerService {
    
    @Autowired
    private BannerMapper bannerMapper;
    
    @Override
    public List<Banner> getActiveBanners() {
        return bannerMapper.findActiveBannersOrderBySort();
    }
    
    @Override
    public List<Banner> getTabBarBanners() {
        return bannerMapper.findTabBarBanners();
    }
} 