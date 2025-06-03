package com.lighthouse.common;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 统一日志管理工具类
 */
@Slf4j
public class LogUtil {
    
    // 数据库日志记录器
    private static final Logger DB_LOGGER = LoggerFactory.getLogger("com.lighthouse.mapper");
    
    /**
     * 记录业务信息日志
     */
    public static void info(String message, Object... args) {
        log.info(message, args);
    }
    
    /**
     * 记录业务调试日志
     */
    public static void debug(String message, Object... args) {
        log.debug(message, args);
    }
    
    /**
     * 记录业务警告日志
     */
    public static void warn(String message, Object... args) {
        log.warn(message, args);
    }
    
    /**
     * 记录业务错误日志
     */
    public static void error(String message, Object... args) {
        log.error(message, args);
    }
    
    /**
     * 记录业务错误日志（带异常）
     */
    public static void error(String message, Throwable throwable, Object... args) {
        log.error(message, throwable, args);
    }
    
    /**
     * 记录数据库操作日志
     */
    public static void dbInfo(String operation, String table, Object... args) {
        DB_LOGGER.info("数据库操作 - 操作类型: {}, 表名: {}, 参数: {}", operation, table, args);
    }
    
    /**
     * 记录数据库查询日志
     */
    public static void dbQuery(String sql, Object... params) {
        DB_LOGGER.debug("执行查询 - SQL: {}, 参数: {}", sql, params);
    }
    
    /**
     * 记录数据库更新日志
     */
    public static void dbUpdate(String sql, Object... params) {
        DB_LOGGER.info("执行更新 - SQL: {}, 参数: {}", sql, params);
    }
    
    /**
     * 记录数据库错误日志
     */
    public static void dbError(String message, Throwable throwable) {
        DB_LOGGER.error("数据库异常 - {}", message, throwable);
    }
    
    /**
     * 记录接口调用开始日志
     */
    public static void apiStart(String methodName, Object... params) {
        info("接口调用开始 - 方法: {}, 参数: {}", methodName, params);
    }
    
    /**
     * 记录接口调用结束日志
     */
    public static void apiEnd(String methodName, Object result) {
        info("接口调用结束 - 方法: {}, 结果: {}", methodName, result);
    }
    
    /**
     * 记录接口调用异常日志
     */
    public static void apiError(String methodName, Throwable throwable, Object... params) {
        error("接口调用异常 - 方法: {}, 参数: {}", throwable, methodName, params);
    }
    
    /**
     * 记录业务操作日志
     */
    public static void business(String operation, String detail, Object... args) {
        info("业务操作 - 操作: {}, 详情: {}, 参数: {}", operation, detail, args);
    }
    
    /**
     * 记录用户操作日志
     */
    public static void userAction(String userId, String action, String detail) {
        info("用户操作 - 用户ID: {}, 操作: {}, 详情: {}", userId, action, detail);
    }
    
    /**
     * 记录系统性能日志
     */
    public static void performance(String operation, long duration) {
        if (duration > 1000) {
            warn("性能警告 - 操作: {}, 耗时: {}ms", operation, duration);
        } else {
            debug("性能监控 - 操作: {}, 耗时: {}ms", operation, duration);
        }
    }
    
    /**
     * 记录安全相关日志
     */
    public static void security(String event, String detail) {
        warn("安全事件 - 事件: {}, 详情: {}", event, detail);
    }
    
    /**
     * 获取当前TraceId
     */
    public static String getCurrentTraceId() {
        return TraceContext.getTraceId();
    }
    
    /**
     * 获取当前IP
     */
    public static String getCurrentIp() {
        return TraceContext.getIp();
    }
    
    /**
     * 记录带TraceId的日志
     */
    public static void infoWithTrace(String message, Object... args) {
        String traceId = getCurrentTraceId();
        String ip = getCurrentIp();
        info("[TraceId: {}] [IP: {}] " + message, traceId, ip, args);
    }
    
    /**
     * 记录带TraceId的错误日志
     */
    public static void errorWithTrace(String message, Throwable throwable, Object... args) {
        String traceId = getCurrentTraceId();
        String ip = getCurrentIp();
        error("[TraceId: {}] [IP: {}] " + message, throwable, traceId, ip, args);
    }
} 