package com.nextera.managelighthouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.nextera.managelighthouse.dto.RolePermissionDTO;
import com.nextera.managelighthouse.dto.SysRoleDTO;
import com.nextera.managelighthouse.entity.SysRole;

import java.util.List;

/**
 * 系统角色Service接口
 */
public interface SysRoleService extends IService<SysRole> {


    IPage<SysRole> getRolePage(Integer current, Integer size, String roleName, String roleCode, Integer status);

    /**
     * 根据管理员ID获取角色列表
     * @param adminId 管理员ID
     * @return 角色列表
     */
    List<SysRole> getRolesByAdminId(Long adminId);

    /**
     * 根据管理员ID获取角色编码列表
     * @param adminId 管理员ID
     * @return 角色编码列表
     */
    List<String> getRoleCodesByAdminId(Long adminId);

    /**
     * 添加角色
     * @param roleDTO 角色DTO
     * @return 是否成功
     */
    boolean addRole(SysRoleDTO roleDTO);

    /**
     * 更新角色
     * @param roleDTO 角色DTO
     * @return 是否成功
     */
    boolean updateRole(SysRoleDTO roleDTO);

    /**
     * 删除角色
     * @param id 角色ID
     * @return 是否成功
     */
    boolean deleteRole(Long id);

    /**
     * 分配角色权限
     * @param rolePermissionDTO 角色权限DTO
     * @return 是否成功
     */
    boolean assignRolePermissions(RolePermissionDTO rolePermissionDTO);

    /**
     * 根据角色编码检查角色是否存在
     * @param roleCode 角色编码
     * @return 是否存在
     */
    boolean existsByRoleCode(String roleCode);

    /**
     * 获取角色详情（包含权限信息）
     * @param id 角色ID
     * @return 角色详情
     */
    SysRole getRoleWithPermissions(Long id);
} 