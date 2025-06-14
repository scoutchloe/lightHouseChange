package com.nextera.managelighthouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nextera.managelighthouse.dto.SysPermissionDTO;
import com.nextera.managelighthouse.entity.SysPermission;
import com.nextera.managelighthouse.mapper.SysPermissionMapper;
import com.nextera.managelighthouse.service.SysPermissionService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 系统权限Service实现类
 */
@Service
public class SysPermissionServiceImpl extends ServiceImpl<SysPermissionMapper, SysPermission> implements SysPermissionService {

    @Override
    public List<SysPermissionDTO> getPermissionTree() {
        // 查询所有权限
        List<SysPermission> allPermissions = list(new LambdaQueryWrapper<SysPermission>()
                .eq(SysPermission::getStatus, 1)
                .orderByAsc(SysPermission::getSortOrder));

        // 转换为DTO
        List<SysPermissionDTO> permissionDTOs = allPermissions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        // 构建树形结构
        return buildPermissionTree(permissionDTOs, 0L);
    }

    @Override
    public List<SysPermission> getPermissionsByUserId(Long userId) {
        return baseMapper.selectPermissionsByUserId(userId);
    }

    @Override
    public List<SysPermission> getPermissionsByRoleId(Long roleId) {
        return baseMapper.selectPermissionsByRoleId(roleId);
    }

    @Override
    public List<String> getPermissionCodesByUserId(Long userId) {
        return baseMapper.selectPermissionCodesByUserId(userId);
    }

    @Override
    @Transactional
    public boolean addPermission(SysPermissionDTO permissionDTO) {
        // 检查权限编码是否已存在
        if (existsByPermissionCode(permissionDTO.getPermissionCode())) {
            throw new RuntimeException("权限编码已存在");
        }

        SysPermission permission = convertToEntity(permissionDTO);
        return save(permission);
    }

    @Override
    @Transactional
    public boolean updatePermission(SysPermissionDTO permissionDTO) {
        // 检查权限是否存在
        SysPermission existingPermission = getById(permissionDTO.getId());
        if (existingPermission == null) {
            throw new RuntimeException("权限不存在");
        }

        // 如果权限编码发生变化，检查新编码是否已存在
        if (!existingPermission.getPermissionCode().equals(permissionDTO.getPermissionCode()) &&
                existsByPermissionCode(permissionDTO.getPermissionCode())) {
            throw new RuntimeException("权限编码已存在");
        }

        SysPermission permission = convertToEntity(permissionDTO);
        return updateById(permission);
    }

    @Override
    @Transactional
    public boolean deletePermission(Long id) {
        // 检查是否有子权限
        long childCount = count(new LambdaQueryWrapper<SysPermission>()
                .eq(SysPermission::getParentId, id));
        if (childCount > 0) {
            throw new RuntimeException("存在子权限，无法删除");
        }

        return removeById(id);
    }

    @Override
    public boolean existsByPermissionCode(String permissionCode) {
        return count(new LambdaQueryWrapper<SysPermission>()
                .eq(SysPermission::getPermissionCode, permissionCode)) > 0;
    }

    /**
     * 构建权限树
     */
    private List<SysPermissionDTO> buildPermissionTree(List<SysPermissionDTO> permissions, Long parentId) {
        List<SysPermissionDTO> tree = new ArrayList<>();
        
        for (SysPermissionDTO permission : permissions) {
            if (parentId.equals(permission.getParentId())) {
                List<SysPermissionDTO> children = buildPermissionTree(permissions, permission.getId());
                permission.setChildren(children);
                tree.add(permission);
            }
        }
        
        return tree;
    }

    /**
     * 实体转DTO
     */
    private SysPermissionDTO convertToDTO(SysPermission permission) {
        SysPermissionDTO dto = new SysPermissionDTO();
        BeanUtils.copyProperties(permission, dto);
        return dto;
    }

    /**
     * DTO转实体
     */
    private SysPermission convertToEntity(SysPermissionDTO dto) {
        SysPermission permission = new SysPermission();
        BeanUtils.copyProperties(dto, permission);
        return permission;
    }
} 