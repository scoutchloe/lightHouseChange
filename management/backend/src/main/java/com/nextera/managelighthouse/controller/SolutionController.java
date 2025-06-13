package com.nextera.managelighthouse.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nextera.managelighthouse.annotation.OperationLog;
import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.entity.Solution;
import com.nextera.managelighthouse.service.SolutionService;
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
 * 解决方案管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/content/solution")
@RequiredArgsConstructor
@Tag(name = "解决方案管理", description = "解决方案管理相关接口")
public class SolutionController {

    private final SolutionService solutionService;

    @GetMapping("/page")
    @Operation(summary = "分页查询解决方案列表", description = "分页查询解决方案列表")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.QUERY, description = "查询解决方案列表")
    public Result<IPage<Solution>> getSolutionPage(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer current,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "空间ID") @RequestParam(required = false) Integer spaceId,
            @Parameter(description = "状态") @RequestParam(required = false) Boolean status,
            @Parameter(description = "是否热门") @RequestParam(required = false) Boolean isHot) {

        Page<Solution> page = new Page<>(current, size);
        IPage<Solution> result = solutionService.pageWithConditions(page, keyword, spaceId, status, isHot);

        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询解决方案详情", description = "根据ID查询解决方案详情")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.QUERY, description = "查看解决方案详情")
    public Result<Solution> getSolutionById(@Parameter(description = "解决方案ID") @PathVariable Long id) {
        Solution solution = solutionService.getById(id);
        if (solution == null) {
            return Result.error("解决方案不存在");
        }
        return Result.success(solution);
    }

    @PostMapping
    @Operation(summary = "创建解决方案", description = "创建新的解决方案")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.CREATE, description = "创建解决方案")
    public Result<Solution> createSolution(@Valid @RequestBody Solution solution) {

        boolean success = solutionService.save(solution);
        if (success) {
            return Result.success("创建解决方案成功", solution);
        } else {
            return Result.error("创建解决方案失败");
        }

    }

    @PutMapping("/{id}")
    @Operation(summary = "更新解决方案", description = "更新解决方案信息")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.UPDATE, description = "更新解决方案")
    public Result<Solution> updateSolution(
            @Parameter(description = "解决方案ID") @PathVariable Long id,
            @Valid @RequestBody Solution solution) {

        solution.setId(id);
        boolean success = solutionService.updateById(solution);
        if (success) {
            return Result.success("更新解决方案成功", solution);
        } else {
            return Result.error("更新解决方案失败");
        }

    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除解决方案", description = "删除解决方案")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.DELETE, description = "删除解决方案")
    public Result<String> deleteSolution(@Parameter(description = "解决方案ID") @PathVariable Long id) {

        boolean success = solutionService.removeById(id);
        if (success) {
            return Result.success("删除解决方案成功");
        } else {
            return Result.error("删除解决方案失败");
        }

    }

    @DeleteMapping("/batch")
    @Operation(summary = "批量删除解决方案", description = "批量删除解决方案")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.DELETE, description = "批量删除解决方案")
    public Result<String> deleteSolutions(@RequestBody List<Long> ids) {

        boolean success = solutionService.removeByIds(ids);
        if (success) {
            return Result.success("批量删除解决方案成功");
        } else {
            return Result.error("批量删除解决方案失败");
        }

    }

    @PutMapping("/{id}/status")
    @Operation(summary = "更新解决方案状态", description = "更新解决方案启用/禁用状态")
    @OperationLog(module = "内容管理", type = OperationLog.OperationType.UPDATE, description = "更新解决方案状态")
    public Result<String> updateSolutionStatus(
            @Parameter(description = "解决方案ID") @PathVariable Long id,
            @Parameter(description = "状态") @RequestParam Integer status) {

        Solution solution = new Solution();
        solution.setId(id);
        solution.setStatus(status);
        boolean success = solutionService.updateById(solution);
        if (success) {
            return Result.success("更新解决方案状态成功");
        } else {
            return Result.error("更新解决方案状态失败");
        }

    }
} 