package com.nextera.managelighthouse.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

/**
 * 管理员用户DTO
 */
@Data
public class AdminUserDto {
    
    private Long id;
    
    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空")
    @Pattern(regexp = "^[a-zA-Z0-9_]{3,20}$", message = "用户名只能包含字母、数字、下划线，长度3-20位")
    private String username;
    
    /**
     * 密码（新增时必填，更新时选填）
     */
    private String password;
    
    /**
     * 真实姓名
     */
    @NotBlank(message = "真实姓名不能为空")
    private String realName;
    
    /**
     * 邮箱
     */
    @Email(message = "邮箱格式不正确")
    private String email;
    
    /**
     * 手机号
     */
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
    
    /**
     * 头像URL
     */
    private String avatar;
    
    /**
     * 状态：0-禁用，1-启用
     */
    @NotNull(message = "状态不能为空")
    private Integer status;
    
    /**
     * 角色：1-超级管理员，2-普通管理员
     */
    @NotNull(message = "角色不能为空")
    private Integer role;
    
    /**
     * 最后登录时间
     */
    private LocalDateTime lastLoginTime;
    
    /**
     * 最后登录IP
     */
    private String lastLoginIp;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
} 