package com.lighthouse.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lighthouse.entity.Problem;

import java.util.List;

/**
 * 问题类型服务接口
 */
public interface ProblemService extends IService<Problem> {
    
    /**
     * 根据空间ID获取问题列表
     */
    List<Problem> getBySpaceId(Integer spaceId);
} 