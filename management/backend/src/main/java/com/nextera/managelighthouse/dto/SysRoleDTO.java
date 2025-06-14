package com.nextera.managelighthouse.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * 系统角色DTO
 */
@Data
public class SysRoleDTO {

    /**
     * 角色ID
     */
    private Long id;

    /**
     * 角色编码
     */
    @NotBlank(message = "角色编码不能为空")
    private String roleCode;

    /**
     * 角色名称
     */
    @NotBlank(message = "角色名称不能为空")
    private String roleName;

    /**
     * 状态：0-禁用，1-启用
     */
    private Integer status;

    /**
     * 角色描述
     */
    private String description;

    /**
     * 角色权限ID列表（用于权限分配）
     */
    private List<Long> permissionIds;
} 