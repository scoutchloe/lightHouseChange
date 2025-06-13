package com.nextera.managelighthouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nextera.managelighthouse.entity.Problem;
import com.nextera.managelighthouse.mapper.ProblemMapper;
import com.nextera.managelighthouse.service.ProblemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 问题管理Service实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemServiceImpl extends ServiceImpl<ProblemMapper, Problem> implements ProblemService {
    
    @Override
    public IPage<Problem> getProblemPage(Page<Problem> page, String name, Long spaceId, Integer status) {
        LambdaQueryWrapper<Problem> queryWrapper = new LambdaQueryWrapper<>();
        
        // 名称模糊查询
        if (StringUtils.hasText(name)) {
            queryWrapper.like(Problem::getName, name);
        }
        
        // 空间ID筛选
        if (spaceId != null) {
            queryWrapper.eq(Problem::getSpaceId, spaceId);
        }
        
        // 状态筛选
        if (status != null) {
            queryWrapper.eq(Problem::getStatus, status);
        }
        
        // 按排序权重和创建时间倒序
        queryWrapper.orderByDesc(Problem::getSort, Problem::getCreatedAt);
        
        return page(page, queryWrapper);
    }
    
    @Override
    public Problem createProblem(Problem problem) {
        // 设置默认值
        if (problem.getStatus() == null) {
            problem.setStatus(1);
        }
        if (problem.getSort() == null) {
            problem.setSort(0);
        }
        
        save(problem);
        return problem;
    }
    
    @Override
    public Problem updateProblem(Problem problem) {
        updateById(problem);
        return problem;
    }
    
    @Override
    public boolean deleteProblem(Long id) {
        return removeById(id);
    }
    
    @Override
    public boolean deleteProblems(List<Long> ids) {
        return removeByIds(ids);
    }
    
    @Override
    public boolean updateProblemStatus(Long id, Integer status) {
        Problem problem = new Problem();
        problem.setId(id);
        problem.setStatus(status);
        return updateById(problem);
    }
    
    @Override
    public List<Problem> getProblemsBySpaceId(Long spaceId) {
        return lambdaQuery()
                .eq(Problem::getSpaceId, spaceId)
                .eq(Problem::getStatus, 1)
                .orderByDesc(Problem::getSort, Problem::getCreatedAt)
                .list();
    }
} 