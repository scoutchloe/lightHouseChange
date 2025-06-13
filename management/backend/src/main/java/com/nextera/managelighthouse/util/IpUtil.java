package com.nextera.managelighthouse.util;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

/**
 * IP工具类
 */
@Slf4j
public class IpUtil {
    
    private static final String UNKNOWN = "unknown";
    private static final String LOCALHOST_IPV4 = "127.0.0.1";
    private static final String LOCALHOST_IPV6 = "0:0:0:0:0:0:0:1";
    
    /**
     * 获取客户端IP地址
     */
    public static String getClientIp(HttpServletRequest request) {
        if (request == null) {
            return UNKNOWN;
        }
        
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // 处理多个IP的情况，取第一个IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        // 处理本地IP
        if (LOCALHOST_IPV4.equals(ip) || LOCALHOST_IPV6.equals(ip)) {
            ip = "本地IP";
        }
        
        return ip;
    }
    
    /**
     * 根据IP获取地理位置
     * 这里简化处理，实际项目中可以集成第三方IP地址库
     */
    public static String getLocationByIp(String ip) {
        if (ip == null || ip.isEmpty() || UNKNOWN.equals(ip) || "本地IP".equals(ip)) {
            return "本地";
        }
        
        // 内网IP
        if (isInternalIp(ip)) {
            return "内网IP";
        }
        
        // 这里可以集成第三方服务获取真实地理位置
        // 例如：高德地图API、百度地图API等
        return "未知位置";
    }
    
    /**
     * 判断是否为内网IP
     */
    private static boolean isInternalIp(String ip) {
        if (ip == null || ip.isEmpty()) {
            return false;
        }
        
        try {
            String[] parts = ip.split("\\.");
            if (parts.length != 4) {
                return false;
            }
            
            int first = Integer.parseInt(parts[0]);
            int second = Integer.parseInt(parts[1]);
            
            // 10.0.0.0 - 10.255.255.255
            if (first == 10) {
                return true;
            }
            
            // 172.16.0.0 - 172.31.255.255
            if (first == 172 && second >= 16 && second <= 31) {
                return true;
            }
            
            // 192.168.0.0 - 192.168.255.255
            if (first == 192 && second == 168) {
                return true;
            }
            
            return false;
        } catch (Exception e) {
            log.warn("判断内网IP失败: {}", ip, e);
            return false;
        }
    }
}