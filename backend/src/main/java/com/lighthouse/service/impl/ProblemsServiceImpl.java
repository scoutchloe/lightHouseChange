package com.lighthouse.service.impl;

import com.lighthouse.entity.Problem;
import com.lighthouse.mapper.ProblemMapper;
import com.lighthouse.service.IProblemsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 问题类型表 服务实现类
 * </p>
 *
 * @author ScoutChloe
 * @since 2025-06-01
 */
@Service
public class ProblemsServiceImpl extends ServiceImpl<ProblemMapper, Problem> implements IProblemsService {

}
