package com.lighthouse.controller;

import com.lighthouse.entity.Banner;
import com.lighthouse.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 轮播图控制器
 */
@RestController
@RequestMapping("/banners")
//@CrossOrigin(origins = "*")
public class BannerController {

    /**
     * 获取轮播图列表
     * @return 轮播图列表
     */
    @GetMapping
    public ApiResponse<List<Banner>> getBanners() {
        List<Banner> banners = new ArrayList<>();
        
        // 模拟轮播图数据
        banners.add(new Banner(
            1L,
            "春季家居焕新计划",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "/pages/solution-list/index",
            1,
            true,
            true,
            "春季家居装修优惠活动"
        ));
        
        banners.add(new Banner(
            2L,
            "智能家居解决方案",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "/pages/solution-detail/index?id=1",
            2,
            true,
            false,
            "全屋智能家居系统"
        ));
        
        banners.add(new Banner(
            3L,
            "专业设计师服务",
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "/pages/diy-design/index",
            3,
            true,
            false,
            "一对一专业设计师服务"
        ));
        
        banners.add(new Banner(
            4L,
            "照片智能诊断",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "/pages/photo-diagnosis/index",
            4,
            true,
            true,
            "AI智能分析家居问题"
        ));

        return ApiResponse.success("获取轮播图成功", banners);
    }
} 