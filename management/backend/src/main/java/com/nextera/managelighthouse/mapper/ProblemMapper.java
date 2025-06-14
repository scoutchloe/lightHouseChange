package com.nextera.managelighthouse.mapper;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nextera.managelighthouse.entity.Problem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 问题管理Mapper接口
 */
@Mapper
@DS("slave")
public interface ProblemMapper extends BaseMapper<Problem> {
    
    /**
     * 分页查询问题列表（关联空间信息）
     * @param page 分页参数
     * @param name 问题名称
     * @param spaceId 空间ID
     * @param status 状态
     * @return 分页结果
     */
    IPage<Problem> selectProblemPage(Page<Problem> page, 
                                   @Param("name") String name, 
                                   @Param("spaceId") Long spaceId, 
                                   @Param("status") Integer status);
} 