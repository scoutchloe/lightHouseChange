package com.lighthouse.controller;

import com.github.xingfudeshi.knife4j.annotations.ApiOperationSupport;
import com.github.xingfudeshi.knife4j.annotations.ApiSupport;
import com.lighthouse.common.ApiResponse;
import com.lighthouse.entity.Space;
import com.lighthouse.service.SpaceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 * 空间类型表 前端控制器
 * </p>
 *
 * @author ScoutChloe
 * @since 2025-06-01
 */
@RestController
@RequestMapping("/spaces")
@Tag(name = "空间类型相关")
@ApiSupport(author = "scoutChloe")
public class SpacesController {

    @Autowired
    private SpaceService spaceService;

    /**
     * 获取所有空间类型
     */
    @GetMapping
    public ApiResponse<List<Space>> getAllSpaces() {
        List<Space> spaces = spaceService.list();
        return ApiResponse.success(spaces);
    }

    /**
     * 根据ID获取空间信息
     */
    @GetMapping("/{id}")
    public ApiResponse<Space> getSpaceById(@PathVariable Integer id) {
        Space space = spaceService.getById(id);
        if (space == null) {
            return ApiResponse.error("空间不存在");
        }
        return ApiResponse.success(space);
    }

    /**
     * 创建空间
     */
    @PostMapping
    public ApiResponse<Space> createSpace(@RequestBody Space space) {
        boolean success = spaceService.save(space);
        if (success) {
            return ApiResponse.success(space);
        }
        return ApiResponse.error("创建空间失败");
    }

    /**
     * 更新空间
     */
    @PutMapping("/{id}")
    public ApiResponse<Space> updateSpace(@PathVariable Integer id, @RequestBody Space space) {
        space.setId(id);
        boolean success = spaceService.updateById(space);
        if (success) {
            return ApiResponse.success(space);
        }
        return ApiResponse.error("更新空间失败");
    }

    /**
     * 删除空间
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSpace(@PathVariable Integer id) {
        boolean success = spaceService.removeById(id);
        if (success) {
            return ApiResponse.success(null);
        }
        return ApiResponse.error("删除空间失败");
    }
}
