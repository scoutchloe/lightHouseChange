package com.lighthouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lighthouse.entity.Problem;
import com.lighthouse.mapper.ProblemMapper;
import com.lighthouse.service.ProblemService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 问题类型服务实现类
 */
@Service
public class ProblemServiceImpl extends ServiceImpl<ProblemMapper, Problem> implements ProblemService {
    
    @Override
    public List<Problem> getBySpaceId(Integer spaceId) {
        QueryWrapper<Problem> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("space_id", spaceId);
        return list(queryWrapper);
    }
} 