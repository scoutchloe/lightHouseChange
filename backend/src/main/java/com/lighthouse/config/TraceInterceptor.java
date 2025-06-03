package com.lighthouse.config;

import com.lighthouse.common.TraceContext;
import com.lighthouse.common.LogUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.UUID;

/**
 * 请求拦截器 - 生成TraceId和获取IP
 */
@Component
public class TraceInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 生成TraceId
        String traceId = UUID.randomUUID().toString().replace("-", "");
        TraceContext.setTraceId(traceId);
        
        // 获取客户端IP
        String ip = getClientIp(request);
        TraceContext.setIp(ip);
        
        // 只对非静态资源记录请求日志
        if (!isStaticResource(request)) {
            LogUtil.info("请求开始 - {} {}", request.getMethod(), request.getRequestURI());
        }
        
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        try {
            // 只对非静态资源记录响应日志
            if (!isStaticResource(request)) {
                LogUtil.info("请求结束 - {} {} - 状态码: {}", 
                    request.getMethod(), request.getRequestURI(), response.getStatus());
            }
        } finally {
            // 清理ThreadLocal
            TraceContext.clear();
        }
    }
    
    /**
     * 判断是否为静态资源请求
     */
    private boolean isStaticResource(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String contextPath = request.getContextPath();


                // 移除context path
        if (contextPath != null && !contextPath.isEmpty()) {
            uri = uri.substring(contextPath.length());
        }
        LogUtil.info("####请求结束 - {} {}, {}, 结果apiV3: {} - ",request.getMethod(), request.getRequestURI(), uri, uri.startsWith("/v3/api-docs"));

        // 静态资源路径模式
        return uri.startsWith("/static/") || uri.startsWith("/v3/api-docs") ||
               uri.startsWith("/css/") ||
               uri.startsWith("/js/") ||
               uri.startsWith("/images/") ||
               uri.startsWith("/img/") ||
               uri.startsWith("/fonts/") ||
               uri.startsWith("/assets/") ||
               uri.equals("/favicon.ico") ||
               uri.endsWith(".css") ||
               uri.endsWith(".js") ||
               uri.endsWith(".png") ||
               uri.endsWith(".jpg") ||
               uri.endsWith(".jpeg") ||
               uri.endsWith(".gif") ||
               uri.endsWith(".ico") ||
               uri.endsWith(".svg") ||
               uri.endsWith(".woff") ||
               uri.endsWith(".woff2") ||
               uri.endsWith(".ttf") ||
               uri.endsWith(".eot") ||
               uri.endsWith(".html") ||
               uri.endsWith(".htm");
    }
    
    /**
     * 获取客户端真实IP地址
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // 处理多个IP的情况，取第一个
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        return ip;
    }
} 