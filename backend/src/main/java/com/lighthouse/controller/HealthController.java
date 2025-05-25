package com.lighthouse.controller;

import com.lighthouse.common.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查控制器
 */
@Slf4j
@RestController
@RequestMapping("/health")
public class HealthController {
    
    /**
     * 健康检查接口
     * 
     * @return 服务状态信息
     */
    @GetMapping
    public ApiResponse<Map<String, Object>> health() {
        log.info("健康检查请求");
        
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("service", "入舍 - 家居轻改造API");
        healthInfo.put("version", "1.0.0");
        healthInfo.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        healthInfo.put("description", "家居轻改造微信小程序后端API服务");
        
        return ApiResponse.success("服务运行正常", healthInfo);
    }
    
    /**
     * API信息接口
     * 
     * @return API信息
     */
    @GetMapping("/info")
    public ApiResponse<Map<String, Object>> info() {
        log.info("API信息请求");
        
        Map<String, Object> apiInfo = new HashMap<>();
        apiInfo.put("name", "入舍 - 家居轻改造API");
        apiInfo.put("version", "1.0.0");
        apiInfo.put("description", "提供家居轻改造相关数据接口");
        apiInfo.put("author", "lighthouse");
        apiInfo.put("baseUrl", "/api");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("GET /health", "健康检查");
        endpoints.put("GET /spaces", "获取所有空间类型");
        endpoints.put("GET /spaces/{id}", "根据ID获取空间信息");
        endpoints.put("GET /problems?spaceId={spaceId}", "根据空间ID获取问题列表");
        endpoints.put("GET /problems/space/{spaceId}", "根据空间ID获取问题列表（路径参数）");
        
        apiInfo.put("endpoints", endpoints);
        
        return ApiResponse.success("API信息获取成功", apiInfo);
    }
} 