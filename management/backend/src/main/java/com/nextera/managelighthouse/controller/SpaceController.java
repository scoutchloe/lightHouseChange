package com.nextera.managelighthouse.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nextera.managelighthouse.annotation.OperationLog;
import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.entity.Space;
import com.nextera.managelighthouse.service.SpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 空间管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/content/space")
@RequiredArgsConstructor
@Tag(name = "空间管理", description = "空间类型管理相关接口")
public class SpaceController {

    private final SpaceService spaceService;

    @GetMapping("/page")
    @Operation(summary = "分页查询空间列表", description = "分页查询空间类型列表")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.QUERY, description = "查询空间列表")
    public Result<IPage<Space>> getSpacePage(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer current,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "空间名称") @RequestParam(required = false) String name,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {

        Page<Space> page = new Page<>(current, size);
        IPage<Space> result = spaceService.getSpacePage(page, name, status);

        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询空间详情", description = "根据ID查询空间详情")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.QUERY, description = "查看空间详情")
    public Result<Space> getSpaceById(@Parameter(description = "空间ID") @PathVariable Long id) {
        Space space = spaceService.getById(id);
        if (space == null) {
            return Result.error("空间不存在");
        }
        return Result.success(space);
    }

    @PostMapping
    @Operation(summary = "创建空间", description = "创建新的空间类型")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.CREATE, description = "创建空间")
    public Result<Space> createSpace(@Valid @RequestBody Space space) {

        Space result = spaceService.createSpace(space);
        return Result.success("创建空间成功", result);

    }

    @PutMapping("/{id}")
    @Operation(summary = "更新空间", description = "更新空间信息")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.UPDATE, description = "更新空间")
    public Result<Space> updateSpace(
            @Parameter(description = "空间ID") @PathVariable Long id,
            @Valid @RequestBody Space space) {

        space.setId(id);
        Space result = spaceService.updateSpace(space);
        return Result.success("更新空间成功", result);

    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除空间", description = "删除空间")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.DELETE, description = "删除空间")
    public Result<String> deleteSpace(@Parameter(description = "空间ID") @PathVariable Long id) {

        boolean success = spaceService.deleteSpace(id);
        if (success) {
            return Result.success("删除空间成功");
        } else {
            return Result.error("删除空间失败");
        }

    }

    @DeleteMapping("/batch")
    @Operation(summary = "批量删除空间", description = "批量删除空间")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.DELETE, description = "批量删除空间")
    public Result<String> deleteSpaces(@RequestBody List<Long> ids) {
        try {
            boolean success = spaceService.deleteSpaces(ids);
            if (success) {
                return Result.success("批量删除空间成功");
            } else {
                return Result.error("批量删除空间失败");
            }
        } catch (Exception e) {
            log.error("批量删除空间失败: {}", e.getMessage(), e);
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "更新空间状态", description = "更新空间启用/禁用状态")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.UPDATE, description = "更新空间状态")
    public Result<String> updateSpaceStatus(
            @Parameter(description = "空间ID") @PathVariable Long id,
            @Parameter(description = "状态") @RequestParam Integer status) {
        try {
            boolean success = spaceService.updateSpaceStatus(id, status);
            if (success) {
                return Result.success("更新空间状态成功");
            } else {
                return Result.error("更新空间状态失败");
            }
        } catch (Exception e) {
            log.error("更新空间状态失败: {}", e.getMessage(), e);
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/list")
    @Operation(summary = "获取所有空间列表", description = "获取所有启用状态的空间列表，用于下拉选择")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.QUERY, description = "获取空间列表")
    public Result<List<Space>> getSpaceList() {
        List<Space> spaces = spaceService.lambdaQuery()
                .eq(Space::getStatus, 1)
                .orderByDesc(Space::getSort, Space::getCreatedAt)
                .list();
        return Result.success(spaces);
    }
} 