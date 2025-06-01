package com.lighthouse.controller;

import com.lighthouse.entity.Recommendation;
import com.lighthouse.common.ApiResponse;
import com.lighthouse.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 推荐内容控制器
 */
@RestController
@RequestMapping("/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    /**
     * 获取推荐内容列表
     */
    @GetMapping
    public ApiResponse<List<Recommendation>> getRecommendations() {
        List<Recommendation> recommendations = recommendationService.getActiveRecommendations();
        return ApiResponse.success("获取推荐内容成功", recommendations);
    }

    /**
     * 获取热门推荐内容
     */
    @GetMapping("/hot")
    public ApiResponse<List<Recommendation>> getHotRecommendations(@RequestParam(defaultValue = "3") Integer limit) {
        List<Recommendation> recommendations = recommendationService.getHotRecommendations(limit);
        return ApiResponse.success("获取热门推荐成功", recommendations);
    }

    /**
     * 根据ID获取推荐内容详情
     */
    @GetMapping("/{id}")
    public ApiResponse<Recommendation> getRecommendationById(@PathVariable Long id) {
        Recommendation recommendation = recommendationService.getById(id);
        if (recommendation == null) {
            return ApiResponse.error("推荐内容不存在");
        }
        return ApiResponse.success(recommendation);
    }

    /**
     * 创建推荐内容
     */
    @PostMapping
    public ApiResponse<Recommendation> createRecommendation(@RequestBody Recommendation recommendation) {
        boolean success = recommendationService.save(recommendation);
        if (success) {
            return ApiResponse.success(recommendation);
        }
        return ApiResponse.error("创建推荐内容失败");
    }

    /**
     * 更新推荐内容
     */
    @PutMapping("/{id}")
    public ApiResponse<Recommendation> updateRecommendation(@PathVariable Long id, @RequestBody Recommendation recommendation) {
        recommendation.setId(id);
        boolean success = recommendationService.updateById(recommendation);
        if (success) {
            return ApiResponse.success(recommendation);
        }
        return ApiResponse.error("更新推荐内容失败");
    }

    /**
     * 删除推荐内容
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRecommendation(@PathVariable Long id) {
        boolean success = recommendationService.removeById(id);
        if (success) {
            return ApiResponse.success(null);
        }
        return ApiResponse.error("删除推荐内容失败");
    }
} 