package com.lighthouse.controller;

import com.lighthouse.common.ApiResponse;
import com.lighthouse.entity.Problem;
import com.lighthouse.service.DataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 问题相关接口控制器
 */
@Slf4j
@RestController
@RequestMapping("/problems")
@RequiredArgsConstructor
public class ProblemController {
    
    private final DataService dataService;
    
    /**
     * 根据空间ID获取问题列表
     * 
     * @param spaceId 空间ID
     * @return 问题列表
     */
    @GetMapping
    public ApiResponse<List<Problem>> getProblemsBySpaceId(@RequestParam Integer spaceId) {
        log.info("获取空间问题列表，空间ID: {}", spaceId);
        try {
            List<Problem> problems = dataService.getProblemsBySpaceId(spaceId);
            log.info("成功获取{}个问题，空间ID: {}", problems.size(), spaceId);
            return ApiResponse.success("获取问题列表成功", problems);
        } catch (Exception e) {
            log.error("获取问题列表失败，空间ID: {}", spaceId, e);
            return ApiResponse.error("获取问题列表失败");
        }
    }
    
    /**
     * 根据空间ID获取问题列表（路径参数方式）
     * 
     * @param spaceId 空间ID
     * @return 问题列表
     */
    @GetMapping("/space/{spaceId}")
    public ApiResponse<List<Problem>> getProblemsBySpaceIdPath(@PathVariable Integer spaceId) {
        log.info("获取空间问题列表（路径参数），空间ID: {}", spaceId);
        try {
            List<Problem> problems = dataService.getProblemsBySpaceId(spaceId);
            log.info("成功获取{}个问题，空间ID: {}", problems.size(), spaceId);
            return ApiResponse.success("获取问题列表成功", problems);
        } catch (Exception e) {
            log.error("获取问题列表失败，空间ID: {}", spaceId, e);
            return ApiResponse.error("获取问题列表失败");
        }
    }
} 