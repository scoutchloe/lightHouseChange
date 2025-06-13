package com.nextera.managelighthouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nextera.managelighthouse.entity.Banner;
import com.nextera.managelighthouse.mapper.BannerMapper;
import com.nextera.managelighthouse.service.BannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 轮播图管理Service实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BannerServiceImpl extends ServiceImpl<BannerMapper, Banner> implements BannerService {
    
    @Override
    public IPage<Banner> getBannerPage(Page<Banner> page, String title, Integer status, Integer isTabBar) {
        LambdaQueryWrapper<Banner> queryWrapper = new LambdaQueryWrapper<>();
        
        // 标题模糊查询
        if (StringUtils.hasText(title)) {
            queryWrapper.like(Banner::getTitle, title);
        }
        
        // 状态筛选
        if (status != null) {
            queryWrapper.eq(Banner::getStatus, status);
        }
        
        // 是否为底部导航栏轮播图筛选
        if (isTabBar != null) {
            queryWrapper.eq(Banner::getIsTabBar, isTabBar);
        }
        
        // 按排序权重和创建时间倒序
        queryWrapper.orderByDesc(Banner::getSort, Banner::getCreatedAt);
        
        return page(page, queryWrapper);
    }
    
    @Override
    public Banner createBanner(Banner banner) {
        // 设置默认值
        if (banner.getStatus() == null) {
            banner.setStatus(1);
        }
        if (banner.getSort() == null) {
            banner.setSort(0);
        }
        if (banner.getIsTabBar() == null) {
            banner.setIsTabBar(0);
        }
        
        save(banner);
        return banner;
    }
    
    @Override
    public Banner updateBanner(Banner banner) {
        updateById(banner);
        return banner;
    }
    
    @Override
    public boolean deleteBanner(Long id) {
        return removeById(id);
    }
    
    @Override
    public boolean deleteBanners(List<Long> ids) {
        return removeByIds(ids);
    }
    
    @Override
    public boolean updateBannerStatus(Long id, Integer status) {
        Banner banner = new Banner();
        banner.setId(id);
        banner.setStatus(status);
        return updateById(banner);
    }
} 