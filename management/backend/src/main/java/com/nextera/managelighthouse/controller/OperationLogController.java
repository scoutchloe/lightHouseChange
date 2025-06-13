package com.nextera.managelighthouse.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nextera.managelighthouse.annotation.OperationLog;
import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.service.OperationLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 操作日志控制器
 */
@Slf4j
@RestController
@RequestMapping("/operation-log")
@RequiredArgsConstructor
@Tag(name = "操作日志管理", description = "操作日志查询相关接口")
public class OperationLogController {
    
    private final OperationLogService operationLogService;
    
    @GetMapping("/page")
    @Operation(summary = "分页查询操作日志", description = "分页查询操作日志列表")
    @OperationLog(module = "操作日志", type = OperationLog.OperationType.QUERY, description = "查询操作日志")
    public Result<IPage<com.nextera.managelighthouse.entity.OperationLogs>> getOperationLogPage(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer current,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "操作模块") @RequestParam(required = false) String module,
            @Parameter(description = "操作类型") @RequestParam(required = false) String operationType,
            @Parameter(description = "操作人") @RequestParam(required = false) String adminUsername,
            @Parameter(description = "开始时间") @RequestParam(required = false) String startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) String endTime) {
        
        Page<com.nextera.managelighthouse.entity.OperationLogs> page = new Page<>(current, size);
        IPage<com.nextera.managelighthouse.entity.OperationLogs> result =
                operationLogService.getOperationLogPage(page, module, operationType, 
                                                       adminUsername, startTime, endTime);
        
        return Result.success(result);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "查询操作日志详情", description = "根据ID查询操作日志详情")
    @OperationLog(module = "操作日志", type = OperationLog.OperationType.QUERY, description = "查看操作日志详情")
    public Result<com.nextera.managelighthouse.entity.OperationLogs> getOperationLogById(
            @Parameter(description = "日志ID") @PathVariable Long id) {
        
        com.nextera.managelighthouse.entity.OperationLogs operationLog =
                operationLogService.getById(id);
        
        if (operationLog == null) {
            return Result.error("操作日志不存在");
        }
        
        return Result.success(operationLog);
    }
    
    @DeleteMapping("/clean/{days}")
    @Operation(summary = "清理过期日志", description = "清理指定天数之前的操作日志")
    @OperationLog(module = "操作日志", type = OperationLog.OperationType.DELETE, description = "清理过期操作日志")
    public Result<String> cleanExpiredLogs(
            @Parameter(description = "保留天数") @PathVariable Integer days) {
        
        if (days < 1) {
            return Result.error("保留天数必须大于0");
        }
        
        operationLogService.cleanExpiredLogs(days);
        return Result.success("清理过期日志成功");
    }
} 