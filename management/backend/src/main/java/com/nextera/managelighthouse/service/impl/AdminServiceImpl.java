package com.nextera.managelighthouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nextera.managelighthouse.dto.AdminUserDto;
import com.nextera.managelighthouse.dto.LoginRequest;
import com.nextera.managelighthouse.dto.LoginResponse;
import com.nextera.managelighthouse.entity.Admin;
import com.nextera.managelighthouse.mapper.AdminMapper;
import com.nextera.managelighthouse.service.AdminService;
import com.nextera.managelighthouse.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

/**
 * 管理员Service实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl extends ServiceImpl<AdminMapper, Admin> implements AdminService {
    
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Override
    public LoginResponse login(LoginRequest loginRequest, String clientIp) {
        // 根据用户名查询管理员
        Admin admin = getByUsername(loginRequest.getUsername());
        if (admin == null) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        // 检查账户状态
        if (admin.getStatus() == 0) {
            throw new RuntimeException("账户已被禁用");
        }

        log.info("<UNK>" + loginRequest.getUsername() + "<UNK>" + loginRequest.getPassword() + "<UNK>" + admin.getPassword());
        // 验证密码
        if (!passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        // 更新最后登录信息
        updateLastLoginInfo(admin.getId(), clientIp);
        
        // 生成JWT令牌
        String token = jwtUtil.generateToken(admin.getUsername(), admin.getId());
        
        // 构建响应
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        
        LoginResponse.AdminInfo adminInfo = new LoginResponse.AdminInfo();
        BeanUtils.copyProperties(admin, adminInfo);
        response.setAdminInfo(adminInfo);
        
        log.info("管理员登录成功: {}, IP: {}", admin.getUsername(), clientIp);
        return response;
    }
    
    @Override
    public Admin getByUsername(String username) {
        LambdaQueryWrapper<Admin> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Admin::getUsername, username);
        return getOne(queryWrapper);
    }
    
    @Override
    public void updateLastLoginInfo(Long adminId, String clientIp) {
        Admin admin = new Admin();
        admin.setId(adminId);
        admin.setLastLoginTime(LocalDateTime.now());
        admin.setLastLoginIp(clientIp);
        updateById(admin);
    }
    
    @Override
    public IPage<AdminUserDto> getAdminUserPage(Page<Admin> page, String username, String realName, Integer status, Integer role) {
        LambdaQueryWrapper<Admin> queryWrapper = new LambdaQueryWrapper<>();
        
        // 用户名模糊查询
        if (StringUtils.hasText(username)) {
            queryWrapper.like(Admin::getUsername, username);
        }
        
        // 真实姓名模糊查询
        if (StringUtils.hasText(realName)) {
            queryWrapper.like(Admin::getRealName, realName);
        }
        
        // 状态筛选
        if (status != null) {
            queryWrapper.eq(Admin::getStatus, status);
        }
        
        // 角色筛选
        if (role != null) {
            queryWrapper.eq(Admin::getRole, role);
        }
        
        // 按创建时间倒序
        queryWrapper.orderByDesc(Admin::getCreatedAt);
        
        IPage<Admin> adminPage = page(page, queryWrapper);
        
        // 转换为DTO
        IPage<AdminUserDto> dtoPage = adminPage.convert(admin -> {
            AdminUserDto dto = new AdminUserDto();
            BeanUtils.copyProperties(admin, dto);
            return dto;
        });
        
        return dtoPage;
    }
    
    @Override
    public AdminUserDto createAdminUser(AdminUserDto adminUserDto) {
        // 检查用户名是否已存在
        if (existsByUsername(adminUserDto.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }
        
        // 检查邮箱是否已存在
        if (StringUtils.hasText(adminUserDto.getEmail()) && existsByEmail(adminUserDto.getEmail())) {
            throw new RuntimeException("邮箱已存在");
        }
        
        // 检查手机号是否已存在
        if (StringUtils.hasText(adminUserDto.getPhone()) && existsByPhone(adminUserDto.getPhone())) {
            throw new RuntimeException("手机号已存在");
        }
        
        // 检查密码是否为空
        if (!StringUtils.hasText(adminUserDto.getPassword())) {
            throw new RuntimeException("密码不能为空");
        }
        
        Admin admin = new Admin();
        BeanUtils.copyProperties(adminUserDto, admin);
        
        // 加密密码
        admin.setPassword(passwordEncoder.encode(adminUserDto.getPassword()));
        
        // 保存
        save(admin);
        
        // 返回DTO
        AdminUserDto result = new AdminUserDto();
        BeanUtils.copyProperties(admin, result);
        return result;
    }
    
    @Override
    public AdminUserDto updateAdminUser(AdminUserDto adminUserDto) {
        Admin existingAdmin = getById(adminUserDto.getId());
        if (existingAdmin == null) {
            throw new RuntimeException("管理员用户不存在");
        }
        
        // 检查用户名是否已存在（排除自己）
        if (!existingAdmin.getUsername().equals(adminUserDto.getUsername()) && 
            existsByUsername(adminUserDto.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }
        
        // 检查邮箱是否已存在（排除自己）
        if (StringUtils.hasText(adminUserDto.getEmail()) && 
            !adminUserDto.getEmail().equals(existingAdmin.getEmail()) &&
            existsByEmail(adminUserDto.getEmail())) {
            throw new RuntimeException("邮箱已存在");
        }
        
        // 检查手机号是否已存在（排除自己）
        if (StringUtils.hasText(adminUserDto.getPhone()) && 
            !adminUserDto.getPhone().equals(existingAdmin.getPhone()) &&
            existsByPhone(adminUserDto.getPhone())) {
            throw new RuntimeException("手机号已存在");
        }
        
        // 更新基本信息
        existingAdmin.setUsername(adminUserDto.getUsername());
        existingAdmin.setRealName(adminUserDto.getRealName());
        existingAdmin.setEmail(adminUserDto.getEmail());
        existingAdmin.setPhone(adminUserDto.getPhone());
        existingAdmin.setAvatar(adminUserDto.getAvatar());
        existingAdmin.setStatus(adminUserDto.getStatus());
        existingAdmin.setRole(adminUserDto.getRole());
        
        // 如果提供了新密码，则更新密码
        if (StringUtils.hasText(adminUserDto.getPassword())) {
            existingAdmin.setPassword(passwordEncoder.encode(adminUserDto.getPassword()));
        }
        
        updateById(existingAdmin);
        
        // 返回DTO
        AdminUserDto result = new AdminUserDto();
        BeanUtils.copyProperties(existingAdmin, result);
        return result;
    }
    
    @Override
    public boolean deleteAdminUser(Long id) {
        Admin admin = getById(id);
        if (admin == null) {
            throw new RuntimeException("管理员用户不存在");
        }
        
        // 检查是否为admin用户，不允许删除
        if ("admin".equals(admin.getUsername())) {
            throw new RuntimeException("不能删除admin用户");
        }
        
        return removeById(id);
    }
    
    @Override
    public boolean resetPassword(Long id, String newPassword) {
        Admin admin = getById(id);
        if (admin == null) {
            throw new RuntimeException("管理员用户不存在");
        }
        
        admin.setPassword(passwordEncoder.encode(newPassword));
        return updateById(admin);
    }
    
    @Override
    public boolean existsByUsername(String username) {
        LambdaQueryWrapper<Admin> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Admin::getUsername, username);
        return count(queryWrapper) > 0;
    }
    
    @Override
    public boolean existsByEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return false;
        }
        LambdaQueryWrapper<Admin> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Admin::getEmail, email);
        return count(queryWrapper) > 0;
    }
    
    @Override
    public boolean existsByPhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            return false;
        }
        LambdaQueryWrapper<Admin> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Admin::getPhone, phone);
        return count(queryWrapper) > 0;
    }
} 