package com.lighthouse.service;

import com.lighthouse.entity.Space;
import com.lighthouse.entity.Problem;
import com.lighthouse.entity.Banner;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

/**
 * 数据服务类 - Mock数据版本（已注释，保留以备后用）
 */
@Service
public class DataService {
    
    /*
     * 注释说明：以下方法已被数据库版本替代，但保留代码以备后用
     * 如需使用mock数据，可以取消注释
     */
    
    /**
     * 获取所有空间类型 - Mock版本（已注释）
     */
    /*
    public List<Space> getAllSpaces() {
        List<Space> spaces = new ArrayList<>();
        
        Space space1 = new Space();
        space1.setId(1);
        space1.setName("客厅");
        space1.setIcon("living-room");
        space1.setIconColor("#FF6B6B");
        space1.setDescription("家庭聚会和休闲的主要场所");
        space1.setImage("/images/spaces/living-room.jpg");
        spaces.add(space1);

        Space space2 = new Space();
        space2.setId(2);
        space2.setName("卧室");
        space2.setIcon("bedroom");
        space2.setIconColor("#4ECDC4");
        space2.setDescription("休息和睡眠的私人空间");
        space2.setImage("/images/spaces/bedroom.jpg");
        spaces.add(space2);

        Space space3 = new Space();
        space3.setId(3);
        space3.setName("厨房");
        space3.setIcon("kitchen");
        space3.setIconColor("#45B7D1");
        space3.setDescription("烹饪和用餐准备的功能区域");
        space3.setImage("/images/spaces/kitchen.jpg");
        spaces.add(space3);

        Space space4 = new Space();
        space4.setId(4);
        space4.setName("卫生间");
        space4.setIcon("bathroom");
        space4.setIconColor("#96CEB4");
        space4.setDescription("洗漱和个人卫生的私密空间");
        space4.setImage("/images/spaces/bathroom.jpg");
        spaces.add(space4);

        Space space5 = new Space();
        space5.setId(5);
        space5.setName("书房");
        space5.setIcon("study");
        space5.setIconColor("#FFEAA7");
        space5.setDescription("学习和工作的安静环境");
        space5.setImage("/images/spaces/study.jpg");
        spaces.add(space5);

        Space space6 = new Space();
        space6.setId(6);
        space6.setName("阳台");
        space6.setIcon("balcony");
        space6.setIconColor("#DDA0DD");
        space6.setDescription("户外休闲和晾晒的开放空间");
        space6.setImage("/images/spaces/balcony.jpg");
        spaces.add(space6);
        
        return spaces;
    }
    */
    
    /**
     * 根据空间ID获取问题列表 - Mock版本（已注释）
     */
    /*
    public List<Problem> getProblemsBySpaceId(Integer spaceId) {
        List<Problem> problems = new ArrayList<>();
        
        if (spaceId == null || spaceId == 1) {
            // 客厅问题
            Problem problem1 = new Problem();
            problem1.setId(1);
            problem1.setName("收纳不足");
            problem1.setIcon("storage");
            problem1.setDescription("客厅物品较多，缺乏足够的收纳空间");
            problem1.setSpaceId(1);
            problems.add(problem1);

            Problem problem2 = new Problem();
            problem2.setId(2);
            problem2.setName("光线不足");
            problem2.setIcon("light");
            problem2.setDescription("客厅采光不好，需要改善照明");
            problem2.setSpaceId(1);
            problems.add(problem2);

            Problem problem3 = new Problem();
            problem3.setId(3);
            problem3.setName("空间拥挤");
            problem3.setIcon("space");
            problem3.setDescription("客厅家具摆放不合理，空间感觉拥挤");
            problem3.setSpaceId(1);
            problems.add(problem3);

            Problem problem4 = new Problem();
            problem4.setId(4);
            problem4.setName("缺乏隐私");
            problem4.setIcon("privacy");
            problem4.setDescription("客厅与其他区域缺乏有效分隔");
            problem4.setSpaceId(1);
            problems.add(problem4);
        }
        
        if (spaceId == null || spaceId == 2) {
            // 卧室问题
            Problem problem5 = new Problem();
            problem5.setId(5);
            problem5.setName("睡眠质量差");
            problem5.setIcon("sleep");
            problem5.setDescription("卧室环境影响睡眠质量");
            problem5.setSpaceId(2);
            problems.add(problem5);

            Problem problem6 = new Problem();
            problem6.setId(6);
            problem6.setName("收纳空间小");
            problem6.setIcon("closet");
            problem6.setDescription("卧室衣物收纳空间不足");
            problem6.setSpaceId(2);
            problems.add(problem6);

            Problem problem7 = new Problem();
            problem7.setId(7);
            problem7.setName("空间狭小");
            problem7.setIcon("small-space");
            problem7.setDescription("卧室面积小，活动空间受限");
            problem7.setSpaceId(2);
            problems.add(problem7);
        }
        
        if (spaceId == null || spaceId == 3) {
            // 厨房问题
            Problem problem8 = new Problem();
            problem8.setId(8);
            problem8.setName("操作台面小");
            problem8.setIcon("counter");
            problem8.setDescription("厨房操作台面不够用");
            problem8.setSpaceId(3);
            problems.add(problem8);

            Problem problem9 = new Problem();
            problem9.setId(9);
            problem9.setName("收纳不足");
            problem9.setIcon("kitchen-storage");
            problem9.setDescription("厨房用品收纳空间不够");
            problem9.setSpaceId(3);
            problems.add(problem9);

            Problem problem10 = new Problem();
            problem10.setId(10);
            problem10.setName("动线不合理");
            problem10.setIcon("workflow");
            problem10.setDescription("厨房操作动线设计不合理");
            problem10.setSpaceId(3);
            problems.add(problem10);
        }
        
        // 如果指定了特定的spaceId，过滤结果
        if (spaceId != null) {
            problems.removeIf(problem -> !problem.getSpaceId().equals(spaceId));
        }
        
        return problems;
    }
    */
    
    /**
     * 其他Mock方法（已注释，保留以备后用）
     */
    /*
    public Space getSpaceById(Integer id) {
        List<Space> spaces = getAllSpaces();
        return spaces.stream()
                .filter(space -> space.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
    
    public Space getSpaceByName(String name) {
        List<Space> spaces = getAllSpaces();
        return spaces.stream()
                .filter(space -> space.getName().equals(name))
                .findFirst()
                .orElse(null);
    }
    
    public List<Space> searchSpacesByName(String name) {
        List<Space> spaces = getAllSpaces();
        return spaces.stream()
                .filter(space -> space.getName().contains(name))
                .collect(java.util.stream.Collectors.toList());
    }
    
    public Problem getProblemById(Integer id) {
        List<Problem> problems = getAllProblems();
        return problems.stream()
                .filter(problem -> problem.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
    
    public List<Problem> getAllProblems() {
        return getProblemsBySpaceId(null);
    }
    
    public List<Problem> searchProblemsByName(String name) {
        List<Problem> problems = getAllProblems();
        return problems.stream()
                .filter(problem -> problem.getName().contains(name))
                .collect(java.util.stream.Collectors.toList());
    }
    
    public List<Problem> searchProblemsBySpaceIdAndName(Integer spaceId, String name) {
        List<Problem> problems = getProblemsBySpaceId(spaceId);
        return problems.stream()
                .filter(problem -> problem.getName().contains(name))
                .collect(java.util.stream.Collectors.toList());
    }
    
    public long countProblemsBySpaceId(Integer spaceId) {
        return getProblemsBySpaceId(spaceId).size();
    }
    
    public Space saveSpace(Space space) {
        // Mock保存操作
        System.out.println("Mock保存空间: " + space.getName());
        return space;
    }
    
    public Problem saveProblem(Problem problem) {
        // Mock保存操作
        System.out.println("Mock保存问题: " + problem.getName());
        return problem;
    }
    
    public void deleteSpace(Integer id) {
        // Mock删除操作
        System.out.println("Mock删除空间ID: " + id);
    }
    
    public void deleteProblem(Integer id) {
        // Mock删除操作
        System.out.println("Mock删除问题ID: " + id);
    }
    */
} 