package com.nextera.managelighthouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nextera.managelighthouse.entity.Space;
import com.nextera.managelighthouse.mapper.SpaceMapper;
import com.nextera.managelighthouse.service.SpaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 空间管理Service实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SpaceServiceImpl extends ServiceImpl<SpaceMapper, Space> implements SpaceService {
    
    @Override
    public IPage<Space> getSpacePage(Page<Space> page, String name, Integer status) {
        LambdaQueryWrapper<Space> queryWrapper = new LambdaQueryWrapper<>();
        
        // 名称模糊查询
        if (StringUtils.hasText(name)) {
            queryWrapper.like(Space::getName, name);
        }
        
        // 状态筛选
        if (status != null) {
            queryWrapper.eq(Space::getStatus, status);
        }
        
        // 按排序权重和创建时间倒序
        queryWrapper.orderByDesc(Space::getSort, Space::getCreatedAt);
        
        return page(page, queryWrapper);
    }
    
    @Override
    public Space createSpace(Space space) {
        // 设置默认值
        if (space.getStatus() == null) {
            space.setStatus(1);
        }
        if (space.getSort() == null) {
            space.setSort(0);
        }
        
        save(space);
        return space;
    }
    
    @Override
    public Space updateSpace(Space space) {
        updateById(space);
        return space;
    }
    
    @Override
    public boolean deleteSpace(Long id) {
        return removeById(id);
    }
    
    @Override
    public boolean deleteSpaces(List<Long> ids) {
        return removeByIds(ids);
    }
    
    @Override
    public boolean updateSpaceStatus(Long id, Integer status) {
        Space space = new Space();
        space.setId(id);
        space.setStatus(status);
        return updateById(space);
    }
} 