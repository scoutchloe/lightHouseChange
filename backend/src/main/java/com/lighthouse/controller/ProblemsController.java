package com.lighthouse.controller;

import com.lighthouse.common.ApiResponse;
import com.lighthouse.entity.Problem;
import com.lighthouse.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 * 问题类型表 前端控制器
 * </p>
 *
 * @author ScoutChloe
 * @since 2025-06-01
 */
@RestController
@RequestMapping("/problems")
public class ProblemsController {

    @Autowired
    private ProblemService problemService;

    /**
     * 获取所有问题
     */
    @GetMapping
    public ApiResponse<List<Problem>> getAllProblems(@RequestParam(required = false) Integer spaceId) {
        List<Problem> problems;
        if (spaceId != null) {
            problems = problemService.getBySpaceId(spaceId);
        } else {
            problems = problemService.list();
        }
        return ApiResponse.success(problems);
    }

    /**
     * 根据空间ID获取问题列表（路径参数方式）
     */
    @GetMapping("/space/{spaceId}")
    public ApiResponse<List<Problem>> getProblemsBySpaceId(@PathVariable Integer spaceId) {
        List<Problem> problems = problemService.getBySpaceId(spaceId);
        return ApiResponse.success(problems);
    }

    /**
     * 根据ID获取问题信息
     */
    @GetMapping("/{id}")
    public ApiResponse<Problem> getProblemById(@PathVariable Integer id) {
        Problem problem = problemService.getById(id);
        if (problem == null) {
            return ApiResponse.error("问题不存在");
        }
        return ApiResponse.success(problem);
    }

    /**
     * 创建问题
     */
    @PostMapping
    public ApiResponse<Problem> createProblem(@RequestBody Problem problem) {
        boolean success = problemService.save(problem);
        if (success) {
            return ApiResponse.success(problem);
        }
        return ApiResponse.error("创建问题失败");
    }

    /**
     * 更新问题
     */
    @PutMapping("/{id}")
    public ApiResponse<Problem> updateProblem(@PathVariable Integer id, @RequestBody Problem problem) {
        problem.setId(id);
        boolean success = problemService.updateById(problem);
        if (success) {
            return ApiResponse.success(problem);
        }
        return ApiResponse.error("更新问题失败");
    }

    /**
     * 删除问题
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProblem(@PathVariable Integer id) {
        boolean success = problemService.removeById(id);
        if (success) {
            return ApiResponse.success(null);
        }
        return ApiResponse.error("删除问题失败");
    }
}
