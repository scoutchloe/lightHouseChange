package com.lighthouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lighthouse.entity.Problem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 问题类型Mapper接口
 */
@Mapper
public interface ProblemMapper extends BaseMapper<Problem> {
    
    /**
     * 根据空间ID查找问题列表，按ID排序
     */
    List<Problem> findBySpaceIdOrderById(@Param("spaceId") Integer spaceId);
    
    /**
     * 根据名称模糊查询
     */
    List<Problem> findByNameContaining(String name);
    
    /**
     * 根据空间ID和名称模糊查询
     */
    List<Problem> findBySpaceIdAndNameContaining(@Param("spaceId") Integer spaceId, @Param("name") String name);
    
    /**
     * 统计某个空间的问题数量
     */
    long countBySpaceId(@Param("spaceId") Integer spaceId);
    
    /**
     * 查询所有问题，按ID排序
     */
    List<Problem> findAllOrderById();
} 