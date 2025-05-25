package com.lighthouse.service;

import com.lighthouse.entity.Space;
import com.lighthouse.entity.Problem;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

/**
 * 数据服务类 - 提供模拟数据
 */
@Service
public class DataService {
    
    /**
     * 空间数据
     */
    private final List<Space> spaces;
    
    /**
     * 问题数据 - 按空间ID分组
     */
    private final Map<Integer, List<Problem>> problems;
    
    public DataService() {
        this.spaces = initSpaces();
        this.problems = initProblems();
    }
    
    /**
     * 获取所有空间类型
     */
    public List<Space> getAllSpaces() {
        return new ArrayList<>(spaces);
    }
    
    /**
     * 根据空间ID获取问题列表
     */
    public List<Problem> getProblemsBySpaceId(Integer spaceId) {
        return problems.getOrDefault(spaceId, new ArrayList<>());
    }
    
    /**
     * 根据ID获取空间信息
     */
    public Space getSpaceById(Integer id) {
        return spaces.stream()
                .filter(space -> space.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
    
    /**
     * 初始化空间数据
     */
    private List<Space> initSpaces() {
        List<Space> spaceList = new ArrayList<>();
        
        spaceList.add(Space.builder()
                .id(1)
                .name("客厅")
                .icon("tv")
                .iconColor("#22C55E")
                .description("适合社交、休闲的多功能空间")
                .image("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                .build());
                
        spaceList.add(Space.builder()
                .id(2)
                .name("卧室")
                .icon("bed")
                .iconColor("#3B82F6")
                .description("打造舒适私密的睡眠环境")
                .image("https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                .build());
                
        spaceList.add(Space.builder()
                .id(3)
                .name("厨房")
                .icon("cutlery")
                .iconColor("#F59E0B")
                .description("高效实用的烹饪空间")
                .image("https://images.unsplash.com/photo-1604709177225-055f99402ea3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                .build());
                
        spaceList.add(Space.builder()
                .id(4)
                .name("卫生间")
                .icon("bath")
                .iconColor("#8B5CF6")
                .description("干湿分离、收纳有序")
                .image("https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                .build());
                
        spaceList.add(Space.builder()
                .id(5)
                .name("书房")
                .icon("book")
                .iconColor("#EF4444")
                .description("专注高效的工作学习区")
                .image("https://images.unsplash.com/photo-1519974719765-e6559eac2575?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                .build());
                
        spaceList.add(Space.builder()
                .id(6)
                .name("阳台")
                .icon("leaf")
                .iconColor("#22C55E")
                .description("休闲、晾晒多用途空间")
                .image("https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                .build());
                
        return spaceList;
    }
    
    /**
     * 初始化问题数据
     */
    private Map<Integer, List<Problem>> initProblems() {
        Map<Integer, List<Problem>> problemMap = new HashMap<>();
        
        // 客厅问题
        List<Problem> livingRoomProblems = new ArrayList<>();
        livingRoomProblems.add(Problem.builder()
                .id(101)
                .name("收纳不足")
                .icon("inbox")
                .description("东西太多没地方放，空间显得凌乱")
                .spaceId(1)
                .build());
        livingRoomProblems.add(Problem.builder()
                .id(102)
                .name("光线不足")
                .icon("sun-o")
                .description("室内太暗，影响心情和活动")
                .spaceId(1)
                .build());
        livingRoomProblems.add(Problem.builder()
                .id(103)
                .name("空间拥挤")
                .icon("arrows")
                .description("家具太多或太大，行动不便")
                .spaceId(1)
                .build());
        livingRoomProblems.add(Problem.builder()
                .id(104)
                .name("缺乏隐私")
                .icon("user-secret")
                .description("开放式空间，缺少私密区域")
                .spaceId(1)
                .build());
        problemMap.put(1, livingRoomProblems);
        
        // 卧室问题
        List<Problem> bedroomProblems = new ArrayList<>();
        bedroomProblems.add(Problem.builder()
                .id(201)
                .name("睡眠质量差")
                .icon("moon-o")
                .description("噪音、光线或温度影响睡眠")
                .spaceId(2)
                .build());
        bedroomProblems.add(Problem.builder()
                .id(202)
                .name("收纳空间小")
                .icon("archive")
                .description("衣物和个人物品无处安放")
                .spaceId(2)
                .build());
        bedroomProblems.add(Problem.builder()
                .id(203)
                .name("空间狭小")
                .icon("compress")
                .description("活动范围受限，感觉压抑")
                .spaceId(2)
                .build());
        problemMap.put(2, bedroomProblems);
        
        // 厨房问题
        List<Problem> kitchenProblems = new ArrayList<>();
        kitchenProblems.add(Problem.builder()
                .id(301)
                .name("操作台面小")
                .icon("cutlery")
                .description("准备食材空间不足")
                .spaceId(3)
                .build());
        kitchenProblems.add(Problem.builder()
                .id(302)
                .name("收纳不足")
                .icon("archive")
                .description("厨具和食材难以归类存放")
                .spaceId(3)
                .build());
        kitchenProblems.add(Problem.builder()
                .id(303)
                .name("动线不合理")
                .icon("random")
                .description("烹饪过程中走动繁琐")
                .spaceId(3)
                .build());
        problemMap.put(3, kitchenProblems);
        
        return problemMap;
    }
} 