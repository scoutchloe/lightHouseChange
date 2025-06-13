package com.nextera.managelighthouse.controller;

import com.nextera.managelighthouse.annotation.OperationLog;
import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.dto.LoginRequest;
import com.nextera.managelighthouse.dto.LoginResponse;
import com.nextera.managelighthouse.service.AdminService;
import com.nextera.managelighthouse.util.IpUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

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
} 