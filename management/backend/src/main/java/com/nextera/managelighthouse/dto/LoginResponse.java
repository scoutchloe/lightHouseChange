package com.nextera.managelighthouse.dto;

import lombok.Data;

/**
 * 登录响应DTO
 */
@Data
public class LoginResponse {
    
    /**
     * JWT令牌
     */
    private String token;
    
    /**
     * 用户信息
     */
    private AdminInfo adminInfo;
    
    @Data
    public static class AdminInfo {
        private Long id;
        private String username;
        private String realName;
        private String email;
        private String phone;
        private String avatar;
        private Integer role;
        private Integer status;
    }
} 