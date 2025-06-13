package com.nextera.managelighthouse.util;

import lombok.extern.slf4j.Slf4j;

/**
 * 用户代理工具类
 */
@Slf4j
public class UserAgentUtil {
    
    /**
     * 解析浏览器信息
     */
    public static String getBrowser(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return "未知浏览器";
        }
        
        userAgent = userAgent.toLowerCase();
        
        if (userAgent.contains("edg")) {
            return "Microsoft Edge";
        } else if (userAgent.contains("chrome")) {
            return "Google Chrome";
        } else if (userAgent.contains("firefox")) {
            return "Mozilla Firefox";
        } else if (userAgent.contains("safari") && !userAgent.contains("chrome")) {
            return "Safari";
        } else if (userAgent.contains("opera") || userAgent.contains("opr")) {
            return "Opera";
        } else if (userAgent.contains("msie") || userAgent.contains("trident")) {
            return "Internet Explorer";
        } else {
            return "其他浏览器";
        }
    }
    
    /**
     * 解析操作系统信息
     */
    public static String getOperatingSystem(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return "未知系统";
        }
        
        userAgent = userAgent.toLowerCase();
        
        if (userAgent.contains("windows nt 10.0")) {
            return "Windows 10";
        } else if (userAgent.contains("windows nt 6.3")) {
            return "Windows 8.1";
        } else if (userAgent.contains("windows nt 6.2")) {
            return "Windows 8";
        } else if (userAgent.contains("windows nt 6.1")) {
            return "Windows 7";
        } else if (userAgent.contains("windows nt 6.0")) {
            return "Windows Vista";
        } else if (userAgent.contains("windows nt 5.1")) {
            return "Windows XP";
        } else if (userAgent.contains("windows")) {
            return "Windows";
        } else if (userAgent.contains("mac os x")) {
            return "Mac OS X";
        } else if (userAgent.contains("mac")) {
            return "Mac OS";
        } else if (userAgent.contains("linux")) {
            return "Linux";
        } else if (userAgent.contains("ubuntu")) {
            return "Ubuntu";
        } else if (userAgent.contains("android")) {
            return "Android";
        } else if (userAgent.contains("iphone") || userAgent.contains("ipad")) {
            return "iOS";
        } else {
            return "其他系统";
        }
    }
    
    /**
     * 获取浏览器和操作系统信息
     */
    public static String getBrowserAndOS(String userAgent) {
        String browser = getBrowser(userAgent);
        String os = getOperatingSystem(userAgent);
        return browser + " / " + os;
    }
} 