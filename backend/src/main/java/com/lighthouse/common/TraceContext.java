package com.lighthouse.common;

import org.slf4j.MDC;

import java.util.UUID;

/**
 * 链路追踪上下文管理
 */
public class TraceContext {
    
    private static final String TRACE_ID_KEY = "traceId";
    private static final String IP_KEY = "ip";
    private static final String USER_ID_KEY = "userId";
    
    /**
     * 生成并设置TraceId
     */
    public static String generateTraceId() {
        String traceId = UUID.randomUUID().toString().replace("-", "");
        setTraceId(traceId);
        return traceId;
    }
    
    /**
     * 设置TraceId
     */
    public static void setTraceId(String traceId) {
        MDC.put(TRACE_ID_KEY, traceId);
    }
    
    /**
     * 获取TraceId
     */
    public static String getTraceId() {
        return MDC.get(TRACE_ID_KEY);
    }
    
    /**
     * 设置IP地址
     */
    public static void setIp(String ip) {
        MDC.put(IP_KEY, ip);
    }
    
    /**
     * 获取IP地址
     */
    public static String getIp() {
        return MDC.get(IP_KEY);
    }
    
    /**
     * 设置用户ID
     */
    public static void setUserId(String userId) {
        MDC.put(USER_ID_KEY, userId);
    }
    
    /**
     * 获取用户ID
     */
    public static String getUserId() {
        return MDC.get(USER_ID_KEY);
    }
    
    /**
     * 清除所有上下文信息
     */
    public static void clear() {
        MDC.clear();
    }
    
    /**
     * 清除TraceId
     */
    public static void clearTraceId() {
        MDC.remove(TRACE_ID_KEY);
    }
    
    /**
     * 清除IP
     */
    public static void clearIp() {
        MDC.remove(IP_KEY);
    }
    
    /**
     * 清除用户ID
     */
    public static void clearUserId() {
        MDC.remove(USER_ID_KEY);
    }
} 