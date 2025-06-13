package com.nextera.managelighthouse.controller;

import com.nextera.managelighthouse.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 测试控制器
 */
@RestController
@RequestMapping("/test")
@Tag(name = "系统测试", description = "系统测试相关接口")
public class TestController {
    
    @GetMapping("/health")
    @Operation(summary = "健康检查", description = "检查系统运行状态")
    public Result<Map<String, Object>> health() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("timestamp", LocalDateTime.now());
        data.put("message", "管理端后端服务运行正常");
        return Result.success(data);
    }
} 