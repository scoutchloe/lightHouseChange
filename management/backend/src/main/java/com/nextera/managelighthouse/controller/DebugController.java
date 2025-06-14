package com.nextera.managelighthouse.controller;

import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.entity.Admin;
import com.nextera.managelighthouse.entity.AdminRole;
import com.nextera.managelighthouse.entity.SysRole;
import com.nextera.managelighthouse.entity.SysPermission;
import com.nextera.managelighthouse.entity.SysRolePermission;
import com.nextera.managelighthouse.service.AdminService;
import com.nextera.managelighthouse.service.AdminRoleService;
import com.nextera.managelighthouse.service.SysRoleService;
import com.nextera.managelighthouse.service.SysPermissionService;
import com.nextera.managelighthouse.service.SysRolePermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 调试控制器 - 用于检查和修复权限数据
 */
@Slf4j
@RestController
@RequestMapping("/debug")
@RequiredArgsConstructor
public class DebugController {

    private final AdminService adminService;
    private final AdminRoleService adminRoleService;
    private final SysRoleService roleService;
    private final SysPermissionService permissionService;
    private final SysRolePermissionService rolePermissionService;

    /**
     * 检查数据库数据
     */
    @GetMapping("/check-data")
    public Result<Map<String, Object>> checkData() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 1. 查看所有管理员
            List<Admin> admins = adminService.list();
            result.put("admins", admins);
            log.info("管理员数量: {}", admins.size());
            
            // 2. 查看所有角色
            List<SysRole> roles = roleService.list();
            result.put("roles", roles);
            log.info("角色数量: {}", roles.size());
            
            // 3. 查看管理员角色关联
            List<AdminRole> adminRoles = adminRoleService.list();
            result.put("adminRoles", adminRoles);
            log.info("管理员角色关联数量: {}", adminRoles.size());
            
            // 4. 查看所有权限
            List<SysPermission> permissions = permissionService.list();
            result.put("permissions", permissions);
            log.info("权限数量: {}", permissions.size());
            
            // 5. 查看角色权限关联
            List<SysRolePermission> rolePermissions = rolePermissionService.list();
            result.put("rolePermissions", rolePermissions);
            log.info("角色权限关联数量: {}", rolePermissions.size());
            
            // 6. 特别检查contentAdmin用户
            Admin contentAdmin = adminService.getByUsername("contentAdmin");
            if (contentAdmin != null) {
                result.put("contentAdmin", contentAdmin);
                
                // 查看contentAdmin的角色
                List<SysRole> contentAdminRoles = roleService.getRolesByAdminId(contentAdmin.getId());
                result.put("contentAdminRoles", contentAdminRoles);
                log.info("contentAdmin的角色数量: {}", contentAdminRoles.size());
                
                // 查看contentAdmin的权限
                var permissions1 = adminService.getAdminPermissions(contentAdmin.getId());
                result.put("contentAdminPermissions", permissions1);
                log.info("contentAdmin的权限数量: {}", permissions1.size());
            } else {
                result.put("contentAdmin", "用户不存在");
            }
            
            return Result.success(result);
        } catch (Exception e) {
            log.error("检查数据失败", e);
            return Result.error("检查数据失败: " + e.getMessage());
        }
    }

    /**
     * 修复contentAdmin用户的权限数据 - 无需认证版本
     */
    @PostMapping("/fix-content-admin-public")
    public Result<String> fixContentAdminPublic() {
        return fixContentAdmin();
    }

    /**
     * 移除contentAdmin用户的删除权限 - 用于测试按钮权限控制
     */
    @PostMapping("/remove-delete-permissions")
    public Result<String> removeDeletePermissions() {
        try {
            // 1. 查找contentAdmin用户
            Admin contentAdmin = adminService.getByUsername("contentAdmin");
            if (contentAdmin == null) {
                return Result.error("contentAdmin用户不存在");
            }
            
            // 2. 查找内容管理员角色
            SysRole contentRole = roleService.list().stream()
                    .filter(role -> "CONTENT_ADMIN".equals(role.getRoleCode()))
                    .findFirst()
                    .orElse(null);
            
            if (contentRole == null) {
                return Result.error("内容管理员角色不存在");
            }
            
            // 3. 查找所有删除权限
            List<String> deletePermissions = Arrays.asList(
                "content:space:delete",
                "content:problem:delete", 
                "content:solution:delete"
            );
            
            // 4. 移除角色的删除权限
            for (String permCode : deletePermissions) {
                SysPermission permission = permissionService.list().stream()
                        .filter(p -> permCode.equals(p.getPermissionCode()))
                        .findFirst()
                        .orElse(null);
                
                if (permission != null) {
                    // 删除角色权限关联
                    rolePermissionService.list().stream()
                            .filter(rp -> rp.getRoleId().equals(contentRole.getId()) && rp.getPermissionId().equals(permission.getId()))
                            .forEach(rp -> {
                                rolePermissionService.removeById(rp.getId());
                                log.info("移除角色 {} 的权限 {}", contentRole.getRoleName(), permission.getPermissionCode());
                            });
                }
            }
            
            return Result.success("已移除contentAdmin用户的删除权限，菜单应该仍然显示，但删除按钮会消失");
        } catch (Exception e) {
            log.error("移除删除权限失败", e);
            return Result.error("移除失败: " + e.getMessage());
        }
    }

    /**
     * 修复contentAdmin用户的权限数据
     */
    @PostMapping("/fix-content-admin")
    public Result<String> fixContentAdmin() {
        try {
            // 1. 查找contentAdmin用户
            Admin contentAdmin = adminService.getByUsername("contentAdmin");
            if (contentAdmin == null) {
                return Result.error("contentAdmin用户不存在");
            }
            log.info("找到contentAdmin用户: {}", contentAdmin.getId());
            
            // 2. 查找或创建内容管理员角色
            SysRole contentRole = roleService.list().stream()
                    .filter(role -> "CONTENT_ADMIN".equals(role.getRoleCode()))
                    .findFirst()
                    .orElse(null);
            
            if (contentRole == null) {
                // 创建内容管理员角色
                contentRole = new SysRole();
                contentRole.setRoleCode("CONTENT_ADMIN");
                contentRole.setRoleName("内容管理员");
                contentRole.setStatus(1);
                contentRole.setDescription("负责内容管理的角色");
                contentRole.setCreatedAt(LocalDateTime.now());
                contentRole.setUpdatedAt(LocalDateTime.now());
                roleService.save(contentRole);
                log.info("创建内容管理员角色: {}", contentRole.getId());
            } else {
                log.info("找到内容管理员角色: {}", contentRole.getId());
            }
            
            // 3. 建立管理员和角色的关联
            SysRole finalContentRole = contentRole;
            AdminRole existingAdminRole = adminRoleService.list().stream()
                    .filter(ar -> ar.getAdminId().equals(contentAdmin.getId()) &&
                            ar.getRoleId().equals(finalContentRole.getId()))
                    .findFirst()
                    .orElse(null);
            
            if (existingAdminRole == null) {
                AdminRole adminRole = new AdminRole();
                adminRole.setAdminId(contentAdmin.getId());
                adminRole.setRoleId(contentRole.getId());
                adminRole.setCreatedAt(LocalDateTime.now());
                adminRoleService.save(adminRole);
                log.info("创建管理员角色关联");
            } else {
                log.info("管理员角色关联已存在");
            }
            
            // 4. 确保权限数据存在
            List<String> requiredPermissions = Arrays.asList(
                "dashboard:view",
                "content:view", 
                "content:space:view",
                "content:space:create", 
                "content:space:update",
                "content:problem:view",
                "content:problem:create",
                "content:problem:update",
                "content:solution:view",
                "content:solution:create",
                "content:solution:update",
                "content:banner:view",
                "content:recommendation:view"
            );
            
            // 创建权限数据结构
            Map<String, SysPermission> permissionMap = new HashMap<>();
            
            // 根权限
            SysPermission dashboardPerm = createOrGetPermission("dashboard:view", "仪表盘查看", 0L, permissionMap);
            SysPermission contentPerm = createOrGetPermission("content:view", "内容管理", 0L, permissionMap);
            
            // 内容管理子权限
            createOrGetPermission("content:space:view", "空间查看", contentPerm.getId(), permissionMap);
            createOrGetPermission("content:space:create", "空间创建", contentPerm.getId(), permissionMap);
            createOrGetPermission("content:space:update", "空间更新", contentPerm.getId(), permissionMap);
            createOrGetPermission("content:problem:view", "问题查看", contentPerm.getId(), permissionMap);
            createOrGetPermission("content:problem:create", "问题创建", contentPerm.getId(), permissionMap);
            createOrGetPermission("content:problem:update", "问题更新", contentPerm.getId(), permissionMap);
            createOrGetPermission("content:solution:view", "方案查看", contentPerm.getId(), permissionMap);
            createOrGetPermission("content:solution:create", "方案创建", contentPerm.getId(), permissionMap);
            createOrGetPermission("content:solution:update", "方案更新", contentPerm.getId(), permissionMap);
            createOrGetPermission("content:banner:view", "轮播图查看", contentPerm.getId(), permissionMap);
            createOrGetPermission("content:recommendation:view", "推荐内容查看", contentPerm.getId(), permissionMap);
            
            // 5. 为内容管理员角色分配权限
            for (String permCode : requiredPermissions) {
                SysPermission permission = permissionMap.get(permCode);
                if (permission != null) {
                    // 检查角色权限关联是否存在
                    SysRole finalContentRole1 = contentRole;
                    boolean exists = rolePermissionService.list().stream()
                            .anyMatch(rp -> rp.getRoleId().equals(finalContentRole1.getId()) && rp.getPermissionId().equals(permission.getId()));
                    
                    if (!exists) {
                        SysRolePermission rolePermission = new SysRolePermission();
                        rolePermission.setRoleId(contentRole.getId());
                        rolePermission.setPermissionId(permission.getId());
                        rolePermission.setCreatedAt(LocalDateTime.now());
                        rolePermissionService.save(rolePermission);
                        log.info("为角色 {} 添加权限 {}", contentRole.getRoleName(), permission.getPermissionCode());
                    }
                }
            }
            
            return Result.success("contentAdmin用户权限修复完成");
        } catch (Exception e) {
            log.error("修复contentAdmin权限失败", e);
            return Result.error("修复失败: " + e.getMessage());
        }
    }
    
    private SysPermission createOrGetPermission(String permissionCode, String permissionName, Long parentId, Map<String, SysPermission> permissionMap) {
        // 先从数据库查找
        SysPermission existing = permissionService.list().stream()
                .filter(p -> permissionCode.equals(p.getPermissionCode()))
                .findFirst()
                .orElse(null);
        
        if (existing != null) {
            permissionMap.put(permissionCode, existing);
            return existing;
        }
        
        // 创建新权限
        SysPermission permission = new SysPermission();
        permission.setPermissionCode(permissionCode);
        permission.setPermissionName(permissionName);
        permission.setParentId(parentId);
        permission.setStatus(1);
        permission.setCreatedAt(LocalDateTime.now());
        permission.setUpdatedAt(LocalDateTime.now());
        permissionService.save(permission);
        
        permissionMap.put(permissionCode, permission);
        log.info("创建权限: {} - {}", permissionCode, permissionName);
        return permission;
    }
} 