package com.lighthouse.controller;

import com.lighthouse.entity.Banner;
import com.lighthouse.common.ApiResponse;
import com.lighthouse.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 轮播图控制器
 */
@RestController
@RequestMapping("/banners")
//@CrossOrigin(origins = "*")
public class BannerController {

    @Autowired
    private BannerService bannerService;

    /**
     * 获取启用状态的轮播图列表
     */
    @GetMapping
    public ApiResponse<List<Banner>> getBanners() {
        List<Banner> banners = bannerService.getActiveBanners();
        return ApiResponse.success("获取轮播图成功", banners);
    }

    /**
     * 获取底部导航栏轮播图
     */
    @GetMapping("/tabbar")
    public ApiResponse<List<Banner>> getTabBarBanners() {
        List<Banner> banners = bannerService.getTabBarBanners();
        return ApiResponse.success("获取底部导航栏轮播图成功", banners);
    }

    /**
     * 根据ID获取轮播图信息
     */
    @GetMapping("/{id}")
    public ApiResponse<Banner> getBannerById(@PathVariable Long id) {
        Banner banner = bannerService.getById(id);
        if (banner == null) {
            return ApiResponse.error("轮播图不存在");
        }
        return ApiResponse.success(banner);
    }

    /**
     * 创建轮播图
     */
    @PostMapping
    public ApiResponse<Banner> createBanner(@RequestBody Banner banner) {
        boolean success = bannerService.save(banner);
        if (success) {
            return ApiResponse.success(banner);
        }
        return ApiResponse.error("创建轮播图失败");
    }

    /**
     * 更新轮播图
     */
    @PutMapping("/{id}")
    public ApiResponse<Banner> updateBanner(@PathVariable Long id, @RequestBody Banner banner) {
        banner.setId(id);
        boolean success = bannerService.updateById(banner);
        if (success) {
            return ApiResponse.success(banner);
        }
        return ApiResponse.error("更新轮播图失败");
    }

    /**
     * 删除轮播图
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBanner(@PathVariable Long id) {
        boolean success = bannerService.removeById(id);
        if (success) {
            return ApiResponse.success(null);
        }
        return ApiResponse.error("删除轮播图失败");
    }

    @GetMapping("/test")
    public ApiResponse<String> testBannerMapper() {
        try {
            List<Banner> banners = bannerService.list();
            List<Banner> activeBanners = bannerService.getActiveBanners();
            List<Banner> tabBarBanners = bannerService.getTabBarBanners();
            
            return ApiResponse.success("BannerMapper测试成功！总数: " + banners.size() + 
                                     ", 启用数: " + activeBanners.size() + 
                                     ", 底部导航数: " + tabBarBanners.size());
        } catch (Exception e) {
            return ApiResponse.error("BannerMapper测试失败: " + e.getMessage());
        }
    }

} 