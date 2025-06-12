package com.lighthouse.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lighthouse.common.ApiResponse;
import com.lighthouse.convert.SolutionConvert;
import com.lighthouse.entity.Solution;
import com.lighthouse.service.SolutionService;
import com.lighthouse.vo.SolutionVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 解决方案控制器
 */
@Slf4j
@RestController
@Tag(name = "解决方案相关接口")
public class SolutionController {

    @Autowired
    private SolutionService solutionService;

    /**
     * 获取解决方案列表（分页）
     */
    @GetMapping("/solutions")
    @Operation(summary = "获取解决方案列表", description = "支持分页、按空间筛选、关键词搜索")
    public ApiResponse<Map<String, Object>> getSolutions(
            @Parameter(description = "页码，从1开始") @RequestParam(defaultValue = "1") Long page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Long pageSize,
            @Parameter(description = "空间ID") @RequestParam(required = false) Integer spaceId,
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String keyword) {

        log.info("获取解决方案列表 - 页码：{}，页大小：{}，空间ID：{}，关键词：{}", page, pageSize, spaceId, keyword);

        Page<Solution> pageObj = new Page<>(page, pageSize);
        IPage<Solution> solutionPage;

        // 根据不同条件查询
        if (StringUtils.hasText(keyword)) {
            solutionPage = solutionService.searchSolutions(pageObj, keyword);
        } else if (spaceId != null) {
            solutionPage = solutionService.getSolutionsBySpaceId(pageObj, spaceId);
        } else {
            solutionPage = solutionService.getActiveSolutions(pageObj);
        }

        // 转换为VO
        List<SolutionVO> solutionVOs = solutionPage.getRecords().stream()
                .map(SolutionConvert::convertToVO)
                .collect(Collectors.toList());

        // 构建响应数据
        Map<String, Object> result = new HashMap<>();
        result.put("list", solutionVOs);
        result.put("total", solutionPage.getTotal());
        result.put("page", solutionPage.getCurrent());
        result.put("pageSize", solutionPage.getSize());
        result.put("totalPages", solutionPage.getPages());

        return ApiResponse.success("获取解决方案列表成功", result);

    }

    /**
     * 获取热门解决方案
     */
    @GetMapping("/solutions/hot")
    @Operation(summary = "获取热门解决方案", description = "获取热门标记的解决方案")
    public ApiResponse<List<SolutionVO>> getHotSolutions(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "3") Integer limit) {


        log.info("获取热门解决方案 - 限制数量：{}", limit);

        List<Solution> solutions = solutionService.getHotSolutions(limit);
        List<SolutionVO> solutionVOs = solutions.stream()
                .map(SolutionConvert::convertToVO)
                .collect(Collectors.toList());

        return ApiResponse.success("获取热门解决方案成功", solutionVOs);
    }

    /**
     * 获取解决方案详情
     */
    @GetMapping("/solutions/{id}")
    @Operation(summary = "获取解决方案详情", description = "根据ID获取解决方案详情，会增加浏览次数")
    public ApiResponse<SolutionVO> getSolutionDetail(
            @Parameter(description = "解决方案ID") @PathVariable Long id) {

        log.info("获取解决方案详情 - ID：{}", id);

        Solution solution = solutionService.getSolutionDetail(id);
        if (solution == null) {
            return ApiResponse.error("解决方案不存在");
        }

        SolutionVO solutionVO = SolutionConvert.convertToVO(solution);
        return ApiResponse.success("获取解决方案详情成功", solutionVO);
    }

    /**
     * 增加收藏
     */
    @PostMapping("/solutions/{id}/favorite")
    @Operation(summary = "增加收藏", description = "增加解决方案收藏次数")
    public ApiResponse<Void> addFavorite(
            @Parameter(description = "解决方案ID") @PathVariable Long id) {

        boolean success = solutionService.incrementFavoriteCount(id);
        if (success) {
            return ApiResponse.success("收藏成功", null);
        } else {
            return ApiResponse.error("收藏失败");
        }
    }

    /**
     * 取消收藏
     */
    @DeleteMapping("/solutions/{id}/favorite")
    @Operation(summary = "取消收藏", description = "减少解决方案收藏次数")
    public ApiResponse<Void> removeFavorite(
            @Parameter(description = "解决方案ID") @PathVariable Long id) {

        boolean success = solutionService.decrementFavoriteCount(id);
        if (success) {
            return ApiResponse.success("取消收藏成功", null);
        } else {
            return ApiResponse.error("取消收藏失败");
        }

    }
} 