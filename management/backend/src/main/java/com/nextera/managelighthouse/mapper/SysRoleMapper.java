package com.nextera.managelighthouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nextera.managelighthouse.entity.SysRole;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 系统角色Mapper接口
 */
@Mapper
public interface SysRoleMapper extends BaseMapper<SysRole> {

    /**
     * 根据管理员ID查询角色列表
     * @param adminId 管理员ID
     * @return 角色列表
     */
    List<SysRole> selectRolesByAdminId(@Param("adminId") Long adminId);

    /**
     * 根据管理员ID查询角色编码列表
     * @param adminId 管理员ID
     * @return 角色编码列表
     */
    List<String> selectRoleCodesByAdminId(@Param("adminId") Long adminId);
} 