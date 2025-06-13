package com.nextera.managelighthouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.nextera.managelighthouse.entity.OperationLogs;

/**
 * 操作日志Service接口
 */
public interface OperationLogService extends IService<OperationLogs> {
    
    /**
     * 记录操作日志
     */
    void recordLog(OperationLogs operationLog);
    
    /**
     * 分页查询操作日志
     */
    IPage<OperationLogs> getOperationLogPage(Page<OperationLogs> page, String module,
                                             String operationType, String adminUsername,
                                             String startTime, String endTime);
    
    /**
     * 清理过期日志
     */
    void cleanExpiredLogs(int days);
} 