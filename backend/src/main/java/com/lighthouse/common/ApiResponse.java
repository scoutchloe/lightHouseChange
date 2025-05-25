package com.lighthouse.common;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 统一API响应格式
 * 
 * @param <T> 响应数据类型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    
    /**
     * 响应状态码
     */
    private Integer code;
    
    /**
     * 响应消息
     */
    private String message;
    
    /**
     * 响应数据
     */
    private T data;
    
    /**
     * 请求时间戳
     */
    private Long timestamp;
    
    /**
     * 成功响应
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "success", data, System.currentTimeMillis());
    }
    
    /**
     * 成功响应（无数据）
     */
    public static <T> ApiResponse<T> success() {
        return new ApiResponse<>(200, "success", null, System.currentTimeMillis());
    }
    
    /**
     * 成功响应（自定义消息）
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data, System.currentTimeMillis());
    }
    
    /**
     * 失败响应
     */
    public static <T> ApiResponse<T> error(Integer code, String message) {
        return new ApiResponse<>(code, message, null, System.currentTimeMillis());
    }
    
    /**
     * 失败响应（默认500错误）
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(500, message, null, System.currentTimeMillis());
    }
} 