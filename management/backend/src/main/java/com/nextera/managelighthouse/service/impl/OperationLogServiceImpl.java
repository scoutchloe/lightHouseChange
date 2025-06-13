package com.nextera.managelighthouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nextera.managelighthouse.entity.OperationLogs;
import com.nextera.managelighthouse.mapper.OperationLogMapper;
import com.nextera.managelighthouse.service.OperationLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 操作日志Service实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OperationLogServiceImpl extends ServiceImpl<OperationLogMapper, OperationLogs>
        implements OperationLogService {
    
    private final OperationLogMapper operationLogMapper;
    
    @Override
    @Async
    public void recordLog(OperationLogs operationLog) {
        try {
            operationLogMapper.insert(operationLog);
            log.debug("操作日志记录成功: {}", operationLog.getOperationDesc());
        } catch (Exception e) {
            log.error("操作日志记录失败", e);
        }
    }
    
    @Override
    public IPage<OperationLogs> getOperationLogPage(Page<OperationLogs> page, String module,
                                                    String operationType, String adminUsername,
                                                    String startTime, String endTime) {
        LambdaQueryWrapper<OperationLogs> wrapper = new LambdaQueryWrapper<>();
        
        // 模块筛选
        if (StringUtils.hasText(module)) {
            wrapper.eq(OperationLogs::getModule, module);
        }
        
        // 操作类型筛选
        if (StringUtils.hasText(operationType)) {
            wrapper.eq(OperationLogs::getOperationType, operationType);
        }
        
        // 操作人筛选
        if (StringUtils.hasText(adminUsername)) {
            wrapper.like(OperationLogs::getAdminUsername, adminUsername);
        }
        
        // 时间范围筛选
        if (StringUtils.hasText(startTime)) {
            LocalDateTime start = LocalDateTime.parse(startTime + " 00:00:00", 
                    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            wrapper.ge(OperationLogs::getOperationTime, start);
        }
        
        if (StringUtils.hasText(endTime)) {
            LocalDateTime end = LocalDateTime.parse(endTime + " 23:59:59", 
                    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            wrapper.le(OperationLogs::getOperationTime, end);
        }
        
        // 按操作时间倒序
        wrapper.orderByDesc(OperationLogs::getOperationTime);
        
        return operationLogMapper.selectPage(page, wrapper);
    }
    
    @Override
    public void cleanExpiredLogs(int days) {
        try {
            LocalDateTime expiredTime = LocalDateTime.now().minusDays(days);
            LambdaQueryWrapper<OperationLogs> wrapper = new LambdaQueryWrapper<>();
            wrapper.lt(OperationLogs::getCreatedAt, expiredTime);
            
            int deletedCount = operationLogMapper.delete(wrapper);
            log.info("清理过期操作日志完成，删除{}条记录", deletedCount);
        } catch (Exception e) {
            log.error("清理过期操作日志失败", e);
        }
    }
} 