package com.lighthouse.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lighthouse.entity.Space;
import com.lighthouse.mapper.SpaceMapper;
import com.lighthouse.service.SpaceService;
import org.springframework.stereotype.Service;

/**
 * 空间类型服务实现类
 */
@Service
public class SpaceServiceImpl extends ServiceImpl<SpaceMapper, Space> implements SpaceService {
} 