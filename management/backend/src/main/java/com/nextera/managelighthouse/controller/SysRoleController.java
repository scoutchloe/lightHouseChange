package com.nextera.managelighthouse.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.dto.RolePermissionDTO;
import com.nextera.managelighthouse.dto.SysRoleDTO;
import com.nextera.managelighthouse.entity.SysRole;
import com.nextera.managelighthouse.service.SysRoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 系统角色管理Controller
 */
@Tag(name = "角色管理", description = "系统角色管理相关接口")
@RestController
@RequestMapping("/system/role")
@Slf4j
public class SysRoleController {

    @Autowired
    private SysRoleService roleService;

    @Operation(summary = "分页查询角色", description = "分页查询角色列表")
    @GetMapping("/page")
    @PreAuthorize("hasAuthority('system:role:list')")
    public Result<IPage<SysRole>> getRolePage(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String roleName,
            @RequestParam(required = false) String roleCode,
            @RequestParam(required = false) Integer status) {

        IPage<SysRole> result = roleService.getRolePage(current, size, roleName, roleCode, status);

        return Result.success(result);
    }

    @Operation(summary = "获取所有角色", description = "获取所有启用状态的角色")
    @GetMapping("/list")
    @PreAuthorize("hasAuthority('system:role:list')")
    public Result<List<SysRole>> getAllRoles() {

        List<SysRole> roles = roleService.list(new LambdaQueryWrapper<SysRole>()
                .eq(SysRole::getStatus, 1)
                .orderByDesc(SysRole::getCreatedAt));


        return Result.success(roles);

    }

    @Operation(summary = "根据ID获取角色详情", description = "根据角色ID获取角色详细信息，包含权限信息")
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('system:role:list')")
    public ResponseEntity<Map<String, Object>> getRoleById(
            @Parameter(description = "角色ID") @PathVariable Long id) {

        SysRole role = roleService.getRoleWithPermissions(id);
        Map<String, Object> result = new HashMap<>();
        if (role != null) {
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", role);
        } else {
            result.put("code", 404);
            result.put("message", "角色不存在");
        }
        return ResponseEntity.ok(result);

    }

    @Operation(summary = "添加角色", description = "添加新的角色")
    @PostMapping
    @PreAuthorize("hasAuthority('system:role:add')")
    public ResponseEntity<Map<String, Object>> addRole(
            @Validated @RequestBody SysRoleDTO roleDTO) {

        boolean success = roleService.addRole(roleDTO);
        Map<String, Object> result = new HashMap<>();
        if (success) {
            result.put("code", 200);
            result.put("message", "添加成功");
        } else {
            result.put("code", 500);
            result.put("message", "添加失败");
        }
        return ResponseEntity.ok(result);

    }

    @Operation(summary = "更新角色", description = "更新角色信息")
    @PutMapping
    @PreAuthorize("hasAuthority('system:role:edit')")
    public ResponseEntity<Map<String, Object>> updateRole(
            @Validated @RequestBody SysRoleDTO roleDTO) {

        boolean success = roleService.updateRole(roleDTO);
        Map<String, Object> result = new HashMap<>();
        if (success) {
            result.put("code", 200);
            result.put("message", "更新成功");
        } else {
            result.put("code", 500);
            result.put("message", "更新失败");
        }
        return ResponseEntity.ok(result);

    }

    @Operation(summary = "删除角色", description = "根据ID删除角色")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('system:role:delete')")
    public ResponseEntity<Map<String, Object>> deleteRole(
            @Parameter(description = "角色ID") @PathVariable Long id) {

        boolean success = roleService.deleteRole(id);
        Map<String, Object> result = new HashMap<>();
        if (success) {
            result.put("code", 200);
            result.put("message", "删除成功");
        } else {
            result.put("code", 500);
            result.put("message", "删除失败");
        }
        return ResponseEntity.ok(result);

    }

    @Operation(summary = "分配角色权限", description = "为角色分配权限")
    @PostMapping("/assign-permissions")
    @PreAuthorize("hasAuthority('system:role:auth')")
    public Result<Boolean> assignRolePermissions(
            @Validated @RequestBody RolePermissionDTO rolePermissionDTO) {

        boolean success = roleService.assignRolePermissions(rolePermissionDTO);

        return Result.success(success);
    }
} 