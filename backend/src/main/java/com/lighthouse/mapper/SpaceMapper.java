package com.lighthouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lighthouse.entity.Space;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 空间类型Mapper接口
 */
@Mapper
public interface SpaceMapper extends BaseMapper<Space> {
    
    /**
     * 查找所有空间，按ID排序
     */
    List<Space> findAllOrderById();
    
    /**
     * 根据名称模糊查询
     */
    List<Space> findByNameContaining(String name);
    
    /**
     * 根据名称精确查询
     */
    Space findByName(String name);
} 