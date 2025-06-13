package com.nextera.managelighthouse.config;

import com.nextera.managelighthouse.service.OperationLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * 定时任务配置
 */
@Slf4j
@Configuration
@EnableScheduling
@RequiredArgsConstructor
@ConditionalOnProperty(name = "schedule.enabled", havingValue = "true", matchIfMissing = true)
public class ScheduleConfig {
    
    private final OperationLogService operationLogService;
    
    /**
     * 每天凌晨2点清理30天前的操作日志
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanExpiredOperationLogs() {
        log.info("开始执行定时清理过期操作日志任务");
        try {
            operationLogService.cleanExpiredLogs(30);
            log.info("定时清理过期操作日志任务执行完成");
        } catch (Exception e) {
            log.error("定时清理过期操作日志任务执行失败", e);
        }
    }
} 