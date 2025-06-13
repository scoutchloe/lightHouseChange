package com.nextera.managelighthouse.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nextera.managelighthouse.annotation.OperationLog;
import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.dto.AdminUserDto;
import com.nextera.managelighthouse.entity.Admin;
import com.nextera.managelighthouse.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 管理员用户管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/admin-user")
@RequiredArgsConstructor
@Tag(name = "管理员用户管理", description = "管理员用户CRUD操作相关接口")
public class AdminUserController {

    private final AdminService adminService;

    @GetMapping("/page")
    @Operation(summary = "分页查询管理员用户", description = "分页查询管理员用户列表")
    @OperationLog(module = "", type = OperationLog.OperationType.QUERY, description = "查询管理员用户")
    public Result<IPage<AdminUserDto>> getAdminUserPage(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer current,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "用户名") @RequestParam(required = false) String username,
            @Parameter(description = "真实姓名") @RequestParam(required = false) String realName,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status,
            @Parameter(description = "角色") @RequestParam(required = false) Integer role) {

        Page<Admin> page = new Page<>(current, size);
        IPage<AdminUserDto> result = adminService.getAdminUserPage(page, username, realName, status, role);

        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询管理员用户详情", description = "根据ID查询管理员用户详情")
    @OperationLog(module = "用户管理", type = OperationLog.OperationType.QUERY, description = "查看管理员用户详情")
    public Result<AdminUserDto> getAdminUserById(
            @Parameter(description = "用户ID") @PathVariable Long id) {

        Admin admin = adminService.getById(id);
        if (admin == null) {
            return Result.error("管理员用户不存在");
        }

        AdminUserDto dto = new AdminUserDto();
        org.springframework.beans.BeanUtils.copyProperties(admin, dto);

        return Result.success(dto);
    }

    @PostMapping
    @Operation(summary = "创建管理员用户", description = "创建新的管理员用户")
    @OperationLog(module = "用户管理", type = OperationLog.OperationType.CREATE, description = "创建管理员用户")
    public Result<AdminUserDto> createAdminUser(@Valid @RequestBody AdminUserDto adminUserDto) {


        AdminUserDto result = adminService.createAdminUser(adminUserDto);
        return Result.success("创建管理员用户成功", result);

    }

    @PutMapping("/{id}")
    @Operation(summary = "更新管理员用户", description = "更新管理员用户信息")
    @OperationLog(module = "用户管理", type = OperationLog.OperationType.UPDATE, description = "更新管理员用户")
    public Result<AdminUserDto> updateAdminUser(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @Valid @RequestBody AdminUserDto adminUserDto) {

        adminUserDto.setId(id);

        AdminUserDto result = adminService.updateAdminUser(adminUserDto);
        return Result.success("更新管理员用户成功", result);

    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除管理员用户", description = "删除管理员用户")
    @OperationLog(module = "用户管理", type = OperationLog.OperationType.DELETE, description = "删除管理员用户")
    public Result<String> deleteAdminUser(
            @Parameter(description = "用户ID") @PathVariable Long id) {

        boolean success = adminService.deleteAdminUser(id);
        if (success) {
            return Result.success("删除管理员用户成功");
        } else {
            return Result.error("删除管理员用户失败");
        }

    }

    @PutMapping("/{id}/reset-password")
    @Operation(summary = "重置密码", description = "重置管理员用户密码")
    @OperationLog(module = "用户管理", type = OperationLog.OperationType.UPDATE, description = "重置管理员用户密码")
    public Result<String> resetPassword(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @Parameter(description = "新密码") @RequestParam String newPassword) {

        boolean success = adminService.resetPassword(id, newPassword);
        if (success) {
            return Result.success("重置密码成功");
        } else {
            return Result.error("重置密码失败");
        }
    }

    @GetMapping("/check-username")
    @Operation(summary = "检查用户名", description = "检查用户名是否已存在")
    public Result<Boolean> checkUsername(@RequestParam String username) {
        boolean exists = adminService.existsByUsername(username);
        return Result.success(!exists); // 返回true表示用户名可用
    }

    @GetMapping("/check-email")
    @Operation(summary = "检查邮箱", description = "检查邮箱是否已存在")
    public Result<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = adminService.existsByEmail(email);
        return Result.success(!exists); // 返回true表示邮箱可用
    }

    @GetMapping("/check-phone")
    @Operation(summary = "检查手机号", description = "检查手机号是否已存在")
    public Result<Boolean> checkPhone(@RequestParam String phone) {
        boolean exists = adminService.existsByPhone(phone);
        return Result.success(!exists); // 返回true表示手机号可用
    }
} 