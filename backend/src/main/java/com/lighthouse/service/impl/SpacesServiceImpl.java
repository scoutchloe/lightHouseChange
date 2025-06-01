package com.lighthouse.service.impl;

import com.lighthouse.entity.Space;
import com.lighthouse.mapper.SpaceMapper;
import com.lighthouse.service.ISpacesService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 空间类型表 服务实现类
 * </p>
 *
 * @author ScoutChloe
 * @since 2025-06-01
 */
@Service
public class SpacesServiceImpl extends ServiceImpl<SpaceMapper, Space> implements ISpacesService {

}
