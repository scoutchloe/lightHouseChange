package com.nextera.managelighthouse.controller;

import com.nextera.managelighthouse.annotation.OperationLog;
import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.dto.LoginRequest;
import com.nextera.managelighthouse.dto.LoginResponse;
import com.nextera.managelighthouse.dto.SysPermissionDTO;
import com.nextera.managelighthouse.entity.Admin;
import com.nextera.managelighthouse.service.AdminService;
import com.nextera.managelighthouse.service.SysPermissionService;
import com.nextera.managelighthouse.util.IpUtil;
import com.nextera.managelighthouse.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 认证控制器
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "认证管理", description = "管理员登录认证相关接口")
public class AuthController {

    private final AdminService adminService;
    private final SysPermissionService permissionService;

    @PostMapping("/login")
    @Operation(summary = "管理员登录", description = "管理员用户名密码登录")
    @OperationLog(module = "认证管理", type = OperationLog.OperationType.LOGIN, 
                  description = "管理员登录", recordResult = false)
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest,
                                       HttpServletRequest request) {

        String clientIp = IpUtil.getClientIp(request);
        LoginResponse response = adminService.login(loginRequest, clientIp);
        return Result.success("登录成功", response);

    }

    @PostMapping("/logout")
    @Operation(summary = "管理员退出登录", description = "管理员退出登录")
    @OperationLog(module = "认证管理", type = OperationLog.OperationType.LOGOUT, 
                  description = "管理员退出登录")
    public Result<String> logout() {
        // JWT是无状态的，客户端删除token即可
        return Result.success("退出登录成功");
    }

    @GetMapping("/userinfo")
    @Operation(summary = "获取当前用户信息", description = "获取当前登录用户的基本信息")
    public Result<Admin> getUserInfo() {
        String username = SecurityUtil.getCurrentUsername();
        if (username == null) {
            return Result.error("用户未登录");
        }
        
        Admin admin = adminService.getByUsername(username);
        if (admin == null) {
            return Result.error("用户不存在");
        }
        
        // 清除敏感信息
        admin.setPassword(null);
        return Result.success(admin);
    }

    @GetMapping("/permissions")
    @Operation(summary = "获取当前用户权限", description = "获取当前登录用户的权限列表")
    public Result<List<SysPermissionDTO>> getUserPermissions() {
        String username = SecurityUtil.getCurrentUsername();
        log.info("获取用户权限，用户名: {}", username);
        
        if (username == null) {
            log.warn("用户未登录，无法获取权限");
            return Result.error("用户未登录");
        }
        
        Admin admin = adminService.getByUsername(username);
        if (admin == null) {
            log.warn("用户不存在: {}", username);
            return Result.error("用户不存在");
        }
        
        log.info("找到用户: {}, ID: {}", admin.getUsername(), admin.getId());
        
        // 获取用户权限
        List<SysPermissionDTO> permissions = adminService.getAdminPermissions(admin.getId());
        log.info("用户 {} 的权限数量: {}", username, permissions != null ? permissions.size() : 0);
        
        return Result.success(permissions);
    }
} 