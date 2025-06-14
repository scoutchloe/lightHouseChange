package com.nextera.managelighthouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nextera.managelighthouse.dto.RolePermissionDTO;
import com.nextera.managelighthouse.dto.SysRoleDTO;
import com.nextera.managelighthouse.entity.SysRole;
import com.nextera.managelighthouse.entity.SysRolePermission;
import com.nextera.managelighthouse.entity.AdminRole;
import com.nextera.managelighthouse.mapper.SysRoleMapper;
import com.nextera.managelighthouse.service.AdminRoleService;
import com.nextera.managelighthouse.service.SysPermissionService;
import com.nextera.managelighthouse.service.SysRolePermissionService;
import com.nextera.managelighthouse.service.SysRoleService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 系统角色Service实现类
 */
@Service
public class SysRoleServiceImpl extends ServiceImpl<SysRoleMapper, SysRole> implements SysRoleService {

    @Autowired
    private SysPermissionService permissionService;

    @Autowired
    private SysRolePermissionService rolePermissionService;

    @Autowired
    private AdminRoleService adminRoleService;

    @Override
    public IPage<SysRole> getRolePage(Integer current, Integer size, String roleName, String roleCode, Integer status) {
        Page<SysRole> page = new Page<>(current, size);
        LambdaQueryWrapper<SysRole> queryWrapper = new LambdaQueryWrapper<>();

        if (roleName != null && !roleName.trim().isEmpty()) {
            queryWrapper.like(SysRole::getRoleName, roleName);
        }
        if (roleCode != null && !roleCode.trim().isEmpty()) {
            queryWrapper.like(SysRole::getRoleCode, roleCode);
        }
        if (status != null) {
            queryWrapper.eq(SysRole::getStatus, status);
        }

        queryWrapper.orderByDesc(SysRole::getCreatedAt);

        IPage<SysRole> result = this.page(page, queryWrapper);

        // 为每个角色添加权限信息
        result.getRecords().forEach(role -> {
            SysRole roleWithPermissions = this.getRoleWithPermissions(role.getId());
            if (roleWithPermissions != null) {
                role.setPermissions(roleWithPermissions.getPermissions());
                role.setPermissionIds(roleWithPermissions.getPermissionIds());
            }
        });
        return result;
    }

    @Override
    public List<SysRole> getRolesByAdminId(Long adminId) {
        return baseMapper.selectRolesByAdminId(adminId);
    }

    @Override
    public List<String> getRoleCodesByAdminId(Long adminId) {
        return baseMapper.selectRoleCodesByAdminId(adminId);
    }

    @Override
    @Transactional
    public boolean addRole(SysRoleDTO roleDTO) {
        // 检查角色编码是否已存在
        if (existsByRoleCode(roleDTO.getRoleCode())) {
            throw new RuntimeException("角色编码已存在");
        }

        SysRole role = convertToEntity(roleDTO);
        return save(role);
    }

    @Override
    @Transactional
    public boolean updateRole(SysRoleDTO roleDTO) {
        // 检查角色是否存在
        SysRole existingRole = getById(roleDTO.getId());
        if (existingRole == null) {
            throw new RuntimeException("角色不存在");
        }

        // 如果角色编码发生变化，检查新编码是否已存在
        if (!existingRole.getRoleCode().equals(roleDTO.getRoleCode()) &&
                existsByRoleCode(roleDTO.getRoleCode())) {
            throw new RuntimeException("角色编码已存在");
        }

        SysRole role = convertToEntity(roleDTO);
        return updateById(role);
    }

    @Override
    @Transactional
    public boolean deleteRole(Long id) {
        // 检查是否有管理员关联此角色
        long adminCount = adminRoleService.count(new LambdaQueryWrapper<AdminRole>()
                .eq(AdminRole::getRoleId, id));
        if (adminCount > 0) {
            throw new RuntimeException("存在管理员关联此角色，无法删除");
        }

        // 删除角色权限关联
        rolePermissionService.remove(new LambdaQueryWrapper<SysRolePermission>()
                .eq(SysRolePermission::getRoleId, id));

        // 删除角色
        return removeById(id);
    }

    @Override
    @Transactional
    public boolean assignRolePermissions(RolePermissionDTO rolePermissionDTO) {
        Long roleId = rolePermissionDTO.getRoleId();
        List<Long> permissionIds = rolePermissionDTO.getPermissionIds();

        // 删除原有的角色权限关联
        rolePermissionService.remove(new LambdaQueryWrapper<SysRolePermission>()
                .eq(SysRolePermission::getRoleId, roleId));

        // 添加新的角色权限关联
        if (permissionIds != null && !permissionIds.isEmpty()) {
            List<SysRolePermission> rolePermissions = permissionIds.stream()
                    .map(permissionId -> {
                        SysRolePermission rolePermission = new SysRolePermission();
                        rolePermission.setRoleId(roleId);
                        rolePermission.setPermissionId(permissionId);
                        return rolePermission;
                    })
                    .collect(Collectors.toList());
            
            return rolePermissionService.saveBatch(rolePermissions);
        }

        return true;
    }

    @Override
    public boolean existsByRoleCode(String roleCode) {
        return count(new LambdaQueryWrapper<SysRole>()
                .eq(SysRole::getRoleCode, roleCode)) > 0;
    }

    @Override
    public SysRole getRoleWithPermissions(Long id) {
        SysRole role = getById(id);
        if (role != null) {
            // 获取角色的权限列表
            role.setPermissions(permissionService.getPermissionsByRoleId(id));
            
            // 获取权限ID列表
            List<Long> permissionIds = role.getPermissions().stream()
                    .map(permission -> permission.getId())
                    .collect(Collectors.toList());
            role.setPermissionIds(permissionIds);
        }
        return role;
    }

    /**
     * DTO转实体
     */
    private SysRole convertToEntity(SysRoleDTO dto) {
        SysRole role = new SysRole();
        BeanUtils.copyProperties(dto, role);
        return role;
    }
} 