package com.nextera.managelighthouse.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nextera.managelighthouse.annotation.OperationLog;
import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.entity.Banner;
import com.nextera.managelighthouse.service.BannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 轮播图管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/content/banner")
@RequiredArgsConstructor
@Tag(name = "轮播图管理", description = "轮播图管理相关接口")
public class BannerController {
    
    private final BannerService bannerService;
    
    @GetMapping("/page")
    @Operation(summary = "分页查询轮播图列表")
    public Result<IPage<Banner>> getPage(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer current,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "轮播图标题") @RequestParam(required = false) String title,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status,
            @Parameter(description = "是否为底部导航栏轮播图") @RequestParam(required = false) Integer isTabBar) {
        
        Page<Banner> page = new Page<>(current, size);
        IPage<Banner> result = bannerService.getBannerPage(page, title, status, isTabBar);
        return Result.success(result);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "获取轮播图详情")
    public Result<Banner> getById(@Parameter(description = "轮播图ID") @PathVariable Long id) {
        Banner banner = bannerService.getById(id);
        if (banner == null) {
            return Result.error("轮播图不存在");
        }
        return Result.success(banner);
    }
    
    @PostMapping
    @Operation(summary = "创建轮播图")
    @OperationLog(module = "轮播图管理", type = OperationLog.OperationType.CREATE, description = "创建轮播图")
    public Result<Banner> create(@Valid @RequestBody Banner banner) {
        Banner result = bannerService.createBanner(banner);
        return Result.success(result);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "更新轮播图")
    @OperationLog(module = "轮播图管理", type = OperationLog.OperationType.UPDATE, description = "更新轮播图")
    public Result<Banner> update(
            @Parameter(description = "轮播图ID") @PathVariable Long id,
            @Valid @RequestBody Banner banner) {
        banner.setId(id);
        Banner result = bannerService.updateBanner(banner);
        return Result.success(result);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "删除轮播图")
    @OperationLog(module = "轮播图管理", type = OperationLog.OperationType.DELETE, description = "删除轮播图")
    public Result<Boolean> delete(@Parameter(description = "轮播图ID") @PathVariable Long id) {
        boolean result = bannerService.deleteBanner(id);
        return Result.success(result);
    }
    
    @DeleteMapping("/batch")
    @Operation(summary = "批量删除轮播图")
    @OperationLog(module = "轮播图管理", type = OperationLog.OperationType.DELETE, description = "批量删除轮播图")
    public Result<Boolean> batchDelete(@RequestBody List<Long> ids) {
        boolean result = bannerService.deleteBanners(ids);
        return Result.success(result);
    }
    
    @PutMapping("/{id}/status")
    @Operation(summary = "更新轮播图状态")
    @OperationLog(module = "轮播图管理", type = OperationLog.OperationType.UPDATE, description = "更新轮播图状态")
    public Result<Boolean> updateStatus(
            @Parameter(description = "轮播图ID") @PathVariable Long id,
            @Parameter(description = "状态") @RequestParam Integer status) {
        boolean result = bannerService.updateBannerStatus(id, status);
        return Result.success(result);
    }
} 