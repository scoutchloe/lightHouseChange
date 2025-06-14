package com.nextera.managelighthouse.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * 系统权限DTO
 */
@Data
public class SysPermissionDTO {

    /**
     * 权限ID
     */
    private Long id;

    /**
     * 权限编码
     */
    @NotBlank(message = "权限编码不能为空")
    private String permissionCode;

    /**
     * 权限名称
     */
    @NotBlank(message = "权限名称不能为空")
    private String permissionName;

    /**
     * 权限类型：1-菜单权限，2-按钮权限
     */
    @NotNull(message = "权限类型不能为空")
    private String permissionType;

    /**
     * 父级权限ID，0表示顶级权限
     */
    private Long parentId;

    /**
     * 菜单路径
     */
    private String menuPath;

    /**
     * 组件路径
     */
    private String componentPath;

    /**
     * 图标
     */
    private String icon;

    /**
     * 排序
     */
    private Integer sortOrder;

    /**
     * 状态：0-禁用，1-启用
     */
    private Integer status;

    /**
     * 权限描述
     */
    private String description;

    /**
     * 子权限列表（用于构建权限树）
     */
    private List<SysPermissionDTO> children;
}
 