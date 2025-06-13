package com.nextera.managelighthouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.nextera.managelighthouse.entity.Problem;

import java.util.List;

/**
 * 问题管理Service接口
 */
public interface ProblemService extends IService<Problem> {
    
    /**
     * 分页查询问题列表
     */
    IPage<Problem> getProblemPage(Page<Problem> page, String name, Long spaceId, Integer status);
    
    /**
     * 创建问题
     */
    Problem createProblem(Problem problem);
    
    /**
     * 更新问题
     */
    Problem updateProblem(Problem problem);
    
    /**
     * 删除问题
     */
    boolean deleteProblem(Long id);
    
    /**
     * 批量删除问题
     */
    boolean deleteProblems(List<Long> ids);
    
    /**
     * 更新问题状态
     */
    boolean updateProblemStatus(Long id, Integer status);
    
    /**
     * 根据空间ID获取问题列表
     */
    List<Problem> getProblemsBySpaceId(Long spaceId);
} 