package com.nextera.managelighthouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.nextera.managelighthouse.dto.AdminUserDto;
import com.nextera.managelighthouse.dto.LoginRequest;
import com.nextera.managelighthouse.dto.LoginResponse;
import com.nextera.managelighthouse.entity.Admin;

/**
 * 管理员Service接口
 */
public interface AdminService extends IService<Admin> {
    
    /**
     * 管理员登录
     */
    LoginResponse login(LoginRequest loginRequest, String clientIp);
    
    /**
     * 根据用户名查询管理员
     */
    Admin getByUsername(String username);
    
    /**
     * 更新最后登录信息
     */
    void updateLastLoginInfo(Long adminId, String clientIp);
    
    /**
     * 分页查询管理员用户
     */
    IPage<AdminUserDto> getAdminUserPage(Page<Admin> page, String username, String realName, Integer status, Integer role);
    
    /**
     * 创建管理员用户
     */
    AdminUserDto createAdminUser(AdminUserDto adminUserDto);
    
    /**
     * 更新管理员用户
     */
    AdminUserDto updateAdminUser(AdminUserDto adminUserDto);
    
    /**
     * 删除管理员用户
     */
    boolean deleteAdminUser(Long id);
    
    /**
     * 重置密码
     */
    boolean resetPassword(Long id, String newPassword);
    
    /**
     * 检查用户名是否存在
     */
    boolean existsByUsername(String username);
    
    /**
     * 检查邮箱是否存在
     */
    boolean existsByEmail(String email);
    
    /**
     * 检查手机号是否存在
     */
    boolean existsByPhone(String phone);
} 