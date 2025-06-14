package com.nextera.managelighthouse.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.nextera.managelighthouse.dto.SysPermissionDTO;
import com.nextera.managelighthouse.entity.SysPermission;

import java.util.List;

/**
 * 系统权限Service接口
 */
public interface SysPermissionService extends IService<SysPermission> {

    /**
     * 获取权限树
     * @return 权限树列表
     */
    List<SysPermissionDTO> getPermissionTree();

    /**
     * 根据用户ID获取权限列表
     * @param userId 用户ID
     * @return 权限列表
     */
    List<SysPermission> getPermissionsByUserId(Long userId);

    /**
     * 根据角色ID获取权限列表
     * @param roleId 角色ID
     * @return 权限列表
     */
    List<SysPermission> getPermissionsByRoleId(Long roleId);

    /**
     * 根据用户ID获取权限编码列表
     * @param userId 用户ID
     * @return 权限编码列表
     */
    List<String> getPermissionCodesByUserId(Long userId);

    /**
     * 添加权限
     * @param permissionDTO 权限DTO
     * @return 是否成功
     */
    boolean addPermission(SysPermissionDTO permissionDTO);

    /**
     * 更新权限
     * @param permissionDTO 权限DTO
     * @return 是否成功
     */
    boolean updatePermission(SysPermissionDTO permissionDTO);

    /**
     * 删除权限
     * @param id 权限ID
     * @return 是否成功
     */
    boolean deletePermission(Long id);

    /**
     * 根据权限编码检查权限是否存在
     * @param permissionCode 权限编码
     * @return 是否存在
     */
    boolean existsByPermissionCode(String permissionCode);
} 