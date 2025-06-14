package com.nextera.managelighthouse.controller;

import com.nextera.managelighthouse.common.Result;
import com.nextera.managelighthouse.entity.*;
import com.nextera.managelighthouse.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/debug")
@RequiredArgsConstructor
public class RolePermissionDebugController {

    private final AdminService adminService;
    private final AdminRoleService adminRoleService;
    private final SysRoleService roleService;
    private final SysPermissionService permissionService;
    private final SysRolePermissionService rolePermissionService;

    /**
     * 添加角色管理权限
     */
    @PostMapping("/add-role-permissions")
    public Result<String> addRolePermissions() {
        try {
            // 1. 确保系统管理权限存在
            SysPermission systemPerm = createOrGetPermission("system:view", "系统管理", 0L, new HashMap<>());
            
            // 2. 创建角色管理权限
            Map<String, SysPermission> permissionMap = new HashMap<>();
            SysPermission roleViewPerm = createOrGetPermission("system:role:view", "角色管理", systemPerm.getId(), permissionMap);
            createOrGetPermission("system:role:add", "新增角色", roleViewPerm.getId(), permissionMap);
            createOrGetPermission("system:role:edit", "编辑角色", roleViewPerm.getId(), permissionMap);
            createOrGetPermission("system:role:delete", "删除角色", roleViewPerm.getId(), permissionMap);
            createOrGetPermission("system:role:auth", "角色权限分配", roleViewPerm.getId(), permissionMap);
            
            // 3. 为超级管理员角色分配这些权限
            SysRole superAdminRole = roleService.list().stream()
                .filter(role -> "SUPER_ADMIN".equals(role.getRoleCode()))
                .findFirst()
                .orElse(null);
            
            if (superAdminRole == null) {
                // 创建超级管理员角色
                superAdminRole = new SysRole();
                superAdminRole.setRoleCode("SUPER_ADMIN");
                superAdminRole.setRoleName("超级管理员");
                superAdminRole.setStatus(1);
                superAdminRole.setDescription("拥有所有权限的超级管理员");
                superAdminRole.setCreatedAt(LocalDateTime.now());
                superAdminRole.setUpdatedAt(LocalDateTime.now());
                roleService.save(superAdminRole);
                log.info("创建超级管理员角色: {}", superAdminRole.getId());
            }
            
            // 4. 为超级管理员分配所有权限
            List<SysPermission> allPermissions = permissionService.list();
            for (SysPermission permission : allPermissions) {
                // 检查是否已存在角色权限关联
                SysRole finalSuperAdminRole = superAdminRole;
                boolean exists = rolePermissionService.list().stream()
                        .anyMatch(rp -> rp.getRoleId().equals(finalSuperAdminRole.getId()) && rp.getPermissionId().equals(permission.getId()));
                
                if (!exists) {
                    SysRolePermission rolePermission = new SysRolePermission();
                    rolePermission.setRoleId(superAdminRole.getId());
                    rolePermission.setPermissionId(permission.getId());
                    rolePermission.setCreatedAt(LocalDateTime.now());
                    rolePermissionService.save(rolePermission);
                }
            }
            
            // 5. 确保admin用户与超级管理员角色关联
            Admin adminUser = adminService.getByUsername("admin");
            if (adminUser != null) {
                SysRole finalSuperAdminRole1 = superAdminRole;
                AdminRole existingAdminRole = adminRoleService.list().stream()
                        .filter(ar -> ar.getAdminId().equals(adminUser.getId()) &&
                                ar.getRoleId().equals(finalSuperAdminRole1.getId()))
                        .findFirst()
                        .orElse(null);
                
                if (existingAdminRole == null) {
                    AdminRole adminRole = new AdminRole();
                    adminRole.setAdminId(adminUser.getId());
                    adminRole.setRoleId(superAdminRole.getId());
                    adminRole.setCreatedAt(LocalDateTime.now());
                    adminRoleService.save(adminRole);
                    log.info("为admin用户分配超级管理员角色");
                }
            }
            
            return Result.success("角色管理权限添加成功，admin用户现在可以访问角色管理页面");
        } catch (Exception e) {
            log.error("添加角色管理权限失败", e);
            return Result.error("添加角色管理权限失败: " + e.getMessage());
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