package com.nextera.managelighthouse.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nextera.managelighthouse.annotation.OperationLog;
import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.entity.Problem;
import com.nextera.managelighthouse.service.ProblemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 问题管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/content/problem")
@RequiredArgsConstructor
@Tag(name = "问题管理", description = "问题管理相关接口")
public class ProblemController {
    
    private final ProblemService problemService;
    
    @GetMapping("/page")
    @Operation(summary = "分页查询问题列表")
    public Result<IPage<Problem>> getPage(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer current,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "问题名称") @RequestParam(required = false) String name,
            @Parameter(description = "空间ID") @RequestParam(required = false) Long spaceId,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        
        Page<Problem> page = new Page<>(current, size);
        IPage<Problem> result = problemService.getProblemPage(page, name, spaceId, status);
        return Result.success(result);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "获取问题详情")
    public Result<Problem> getById(@Parameter(description = "问题ID") @PathVariable Long id) {
        Problem problem = problemService.getById(id);
        if (problem == null) {
            return Result.error("问题不存在");
        }
        return Result.success(problem);
    }
    
    @PostMapping
    @Operation(summary = "创建问题")
    @OperationLog(module = "问题管理", type = OperationLog.OperationType.CREATE, description = "创建问题")
    public Result<Problem> create(@Valid @RequestBody Problem problem) {
        Problem result = problemService.createProblem(problem);
        return Result.success(result);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "更新问题")
    @OperationLog(module = "问题管理", type = OperationLog.OperationType.UPDATE, description = "更新问题")
    public Result<Problem> update(
            @Parameter(description = "问题ID") @PathVariable Long id,
            @Valid @RequestBody Problem problem) {
        problem.setId(id);
        Problem result = problemService.updateProblem(problem);
        return Result.success(result);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "删除问题")
    @OperationLog(module = "问题管理", type = OperationLog.OperationType.DELETE, description = "删除问题")
    public Result<Boolean> delete(@Parameter(description = "问题ID") @PathVariable Long id) {
        boolean result = problemService.deleteProblem(id);
        return Result.success(result);
    }
    
    @DeleteMapping("/batch")
    @Operation(summary = "批量删除问题")
    @OperationLog(module = "问题管理", type = OperationLog.OperationType.DELETE, description = "批量删除问题")
    public Result<Boolean> batchDelete(@RequestBody List<Long> ids) {
        boolean result = problemService.deleteProblems(ids);
        return Result.success(result);
    }
    
    @PutMapping("/{id}/status")
    @Operation(summary = "更新问题状态")
    @OperationLog(module = "问题管理", type = OperationLog.OperationType.UPDATE, description = "更新问题状态")
    public Result<Boolean> updateStatus(
            @Parameter(description = "问题ID") @PathVariable Long id,
            @Parameter(description = "状态") @RequestParam Integer status) {
        boolean result = problemService.updateProblemStatus(id, status);
        return Result.success(result);
    }
    
    @GetMapping("/space/{spaceId}")
    @Operation(summary = "根据空间ID获取问题列表")
    public Result<List<Problem>> getBySpaceId(@Parameter(description = "空间ID") @PathVariable Long spaceId) {
        List<Problem> result = problemService.getProblemsBySpaceId(spaceId);
        return Result.success(result);
    }
} 