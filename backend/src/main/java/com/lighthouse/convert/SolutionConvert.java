package com.lighthouse.convert;

import com.lighthouse.entity.Solution;
import com.lighthouse.vo.SolutionVO;
import org.springframework.beans.BeanUtils;

/**
 * @author Scout
 * @date 2025-06-12 16:34
 * @since 1.0
 */
public class SolutionConvert {

    /**
     * 将Solution实体转换为SolutionVO
     */
    public static SolutionVO convertToVO(Solution solution) {
        if (solution == null) {
            return null;
        }
        
        SolutionVO vo = new SolutionVO();
        BeanUtils.copyProperties(solution, vo);
        
        // 特殊字段处理
        vo.setSpace(solution.getSpaceId()); // 兼容前端的space字段
        vo.setProblems(solution.getProblemsArray()); // 解析JSON为数组
        vo.setTags(solution.getTagsArray()); // 解析JSON为数组
        
        return vo;
    }

    /**
     * 将SolutionVO转换为Solution实体
     * 
     * @param vo SolutionVO
     * @return Solution实体
     */
    public static Solution convertToEntity(SolutionVO vo) {
        if (vo == null) {
            return null;
        }
        
        Solution solution = new Solution();
        BeanUtils.copyProperties(vo, solution);
        
        // 特殊字段处理
        solution.setSpaceId(vo.getSpace()); // 兼容前端的space字段
        solution.setProblemsArray(vo.getProblems()); // 设置JSON数组
        solution.setTagsArray(vo.getTags()); // 设置JSON数组
        
        return solution;
    }
}