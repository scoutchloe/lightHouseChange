package com.lighthouse.controller;

import com.lighthouse.common.ApiResponse;
import com.lighthouse.entity.Space;
import com.lighthouse.service.DataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 空间相关接口控制器
 */
@Slf4j
@RestController
@RequestMapping("/spaces")
@RequiredArgsConstructor
public class SpaceController {
    
    private final DataService dataService;
    
    /**
     * 获取所有空间类型
     * 
     * @return 空间类型列表
     */
    @GetMapping
    public ApiResponse<List<Space>> getAllSpaces() {
        log.info("获取所有空间类型");
        try {
            List<Space> spaces = dataService.getAllSpaces();
            log.info("成功获取{}个空间类型", spaces.size());
            return ApiResponse.success("获取空间类型成功", spaces);
        } catch (Exception e) {
            log.error("获取空间类型失败", e);
            return ApiResponse.error("获取空间类型失败");
        }
    }
    
    /**
     * 根据ID获取空间信息
     * 
     * @param id 空间ID
     * @return 空间信息
     */
    @GetMapping("/{id}")
    public ApiResponse<Space> getSpaceById(@PathVariable Integer id) {
        log.info("获取空间信息，ID: {}", id);
        try {
            Space space = dataService.getSpaceById(id);
            if (space != null) {
                log.info("成功获取空间信息: {}", space.getName());
                return ApiResponse.success("获取空间信息成功", space);
            } else {
                log.warn("空间不存在，ID: {}", id);
                return ApiResponse.error(404, "空间不存在");
            }
        } catch (Exception e) {
            log.error("获取空间信息失败，ID: {}", id, e);
            return ApiResponse.error("获取空间信息失败");
        }
    }
} 