package com.nextera.managelighthouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.nextera.managelighthouse.entity.Space;

/**
 * 空间管理Service接口
 */
public interface SpaceService extends IService<Space> {
    
    /**
     * 分页查询空间列表
     */
    IPage<Space> getSpacePage(Page<Space> page, String name, Integer status);
    
    /**
     * 创建空间
     */
    Space createSpace(Space space);
    
    /**
     * 更新空间
     */
    Space updateSpace(Space space);
    
    /**
     * 删除空间
     */
    boolean deleteSpace(Long id);
    
    /**
     * 批量删除空间
     */
    boolean deleteSpaces(java.util.List<Long> ids);
    
    /**
     * 更新空间状态
     */
    boolean updateSpaceStatus(Long id, Integer status);
} 