package com.nextera.managelighthouse.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.dto.SysPermissionDTO;
import com.nextera.managelighthouse.entity.SysPermission;
import com.nextera.managelighthouse.service.SysPermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 系统权限管理Controller
 */
@Tag(name = "权限管理", description = "系统权限管理相关接口")
@RestController
@RequestMapping("/system/permission")
@Slf4j
public class SysPermissionController {

    @Autowired
    private SysPermissionService permissionService;

    @Operation(summary = "获取权限树", description = "获取树形结构的权限列表")
    @GetMapping("/tree")
    @PreAuthorize("hasAuthority('system:permission:list')")
    public Result<List<SysPermissionDTO>> getPermissionTree() {

        List<SysPermissionDTO> tree = permissionService.getPermissionTree();
        return Result.success(tree);

    }

    @Operation(summary = "分页查询权限", description = "分页查询权限列表")
    @GetMapping("/page")
    @PreAuthorize("hasAuthority('system:permission:list')")
    public Result<IPage<SysPermission>> getPermissionPage(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String permissionName,
            @RequestParam(required = false) Integer permissionType,
            @RequestParam(required = false) Integer status) {

        Page<SysPermission> page = new Page<>(current, size);
        LambdaQueryWrapper<SysPermission> queryWrapper = new LambdaQueryWrapper<>();

        if (permissionName != null && !permissionName.trim().isEmpty()) {
            queryWrapper.like(SysPermission::getPermissionName, permissionName);
        }
        if (permissionType != null) {
            queryWrapper.eq(SysPermission::getPermissionType, permissionType);
        }
        if (status != null) {
            queryWrapper.eq(SysPermission::getStatus, status);
        }

        queryWrapper.orderByAsc(SysPermission::getSortOrder);

        IPage<SysPermission> result = permissionService.page(page, queryWrapper);

        return Result.success(result);

    }

    @Operation(summary = "根据ID获取权限详情", description = "根据权限ID获取权限详细信息")
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('system:permission:list')")
    public ResponseEntity<Map<String, Object>> getPermissionById(
            @Parameter(description = "权限ID") @PathVariable Long id) {

        SysPermission permission = permissionService.getById(id);
        Map<String, Object> result = new HashMap<>();
        if (permission != null) {
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", permission);
        } else {
            result.put("code", 404);
            result.put("message", "权限不存在");
        }
        return ResponseEntity.ok(result);

    }

    @Operation(summary = "添加权限", description = "添加新的权限")
    @PostMapping
    @PreAuthorize("hasAuthority('system:permission:add')")
    public ResponseEntity<Map<String, Object>> addPermission(
            @Validated @RequestBody SysPermissionDTO permissionDTO) {

        boolean success = permissionService.addPermission(permissionDTO);
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

    @Operation(summary = "更新权限", description = "更新权限信息")
    @PutMapping
    @PreAuthorize("hasAuthority('system:permission:edit')")
    public ResponseEntity<Map<String, Object>> updatePermission(
            @Validated @RequestBody SysPermissionDTO permissionDTO) {

        boolean success = permissionService.updatePermission(permissionDTO);
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

    @Operation(summary = "删除权限", description = "根据ID删除权限")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('system:permission:delete')")
    public ResponseEntity<Map<String, Object>> deletePermission(
            @Parameter(description = "权限ID") @PathVariable Long id) {

        boolean success = permissionService.deletePermission(id);
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
} 