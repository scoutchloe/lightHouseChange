package com.test;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

/**
 * 简单测试启动类 - 不依赖数据库
 */
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    com.baomidou.mybatisplus.autoconfigure.MybatisPlusAutoConfiguration.class
})
@ComponentScan(basePackages = "com.lighthouse", 
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX, 
        pattern = "com\\.lighthouse\\.mapper\\..*"
    ))
@RestController
@CrossOrigin(origins = "*")
public class SimpleTestApplication {

    @GetMapping("/test")
    public String test() {
        return "Hello, Spring Boot is working!";
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "UP");
        result.put("timestamp", System.currentTimeMillis());
        result.put("message", "服务运行正常");
        return result;
    }

    @GetMapping("/spaces")
    public Map<String, Object> getSpaces() {
        List<Map<String, Object>> spaces = new ArrayList<>();
        
        Map<String, Object> space1 = new HashMap<>();
        space1.put("id", 1);
        space1.put("name", "客厅");
        space1.put("icon", "living-room");
        space1.put("iconColor", "#FF6B6B");
        space1.put("description", "家庭聚会和休闲的主要场所");
        space1.put("image", "/images/spaces/living-room.jpg");
        spaces.add(space1);

        Map<String, Object> space2 = new HashMap<>();
        space2.put("id", 2);
        space2.put("name", "卧室");
        space2.put("icon", "bedroom");
        space2.put("iconColor", "#4ECDC4");
        space2.put("description", "休息和睡眠的私人空间");
        space2.put("image", "/images/spaces/bedroom.jpg");
        spaces.add(space2);

        Map<String, Object> space3 = new HashMap<>();
        space3.put("id", 3);
        space3.put("name", "厨房");
        space3.put("icon", "kitchen");
        space3.put("iconColor", "#45B7D1");
        space3.put("description", "烹饪和用餐准备的功能区域");
        space3.put("image", "/images/spaces/kitchen.jpg");
        spaces.add(space3);

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", spaces);
        return result;
    }

    @GetMapping("/problems")
    public Map<String, Object> getProblems(@RequestParam(required = false) Integer spaceId) {
        List<Map<String, Object>> problems = new ArrayList<>();
        
        if (spaceId == null || spaceId == 1) {
            // 客厅问题
            Map<String, Object> problem1 = new HashMap<>();
            problem1.put("id", 1);
            problem1.put("name", "收纳不足");
            problem1.put("icon", "storage");
            problem1.put("description", "客厅物品较多，缺乏足够的收纳空间");
            problem1.put("spaceId", 1);
            problems.add(problem1);

            Map<String, Object> problem2 = new HashMap<>();
            problem2.put("id", 2);
            problem2.put("name", "光线不足");
            problem2.put("icon", "light");
            problem2.put("description", "客厅采光不好，需要改善照明");
            problem2.put("spaceId", 1);
            problems.add(problem2);
        }
        
        if (spaceId == null || spaceId == 2) {
            // 卧室问题
            Map<String, Object> problem3 = new HashMap<>();
            problem3.put("id", 5);
            problem3.put("name", "睡眠质量差");
            problem3.put("icon", "sleep");
            problem3.put("description", "卧室环境影响睡眠质量");
            problem3.put("spaceId", 2);
            problems.add(problem3);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", problems);
        return result;
    }

    @GetMapping("/spaces/{id}")
    public Map<String, Object> getSpaceById(@PathVariable Integer id) {
        Map<String, Object> space = new HashMap<>();
        
        switch (id) {
            case 1:
                space.put("id", 1);
                space.put("name", "客厅");
                space.put("icon", "living-room");
                space.put("iconColor", "#FF6B6B");
                space.put("description", "家庭聚会和休闲的主要场所");
                space.put("image", "/images/spaces/living-room.jpg");
                break;
            case 2:
                space.put("id", 2);
                space.put("name", "卧室");
                space.put("icon", "bedroom");
                space.put("iconColor", "#4ECDC4");
                space.put("description", "休息和睡眠的私人空间");
                space.put("image", "/images/spaces/bedroom.jpg");
                break;
            case 3:
                space.put("id", 3);
                space.put("name", "厨房");
                space.put("icon", "kitchen");
                space.put("iconColor", "#45B7D1");
                space.put("description", "烹饪和用餐准备的功能区域");
                space.put("image", "/images/spaces/kitchen.jpg");
                break;
            default:
                Map<String, Object> result = new HashMap<>();
                result.put("code", 404);
                result.put("message", "空间不存在");
                result.put("data", null);
                return result;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", space);
        return result;
    }

    public static void main(String[] args) {

        System.out.println("=================================");
        System.out.println("简单测试应用启动成功！");
        System.out.println("访问地址: http://localhost:8081/api");
        System.out.println("测试接口:");
        System.out.println("  GET /api/test");
        System.out.println("  GET /api/health");
        System.out.println("  GET /api/spaces");
        System.out.println("  GET /api/spaces/1");
        System.out.println("  GET /api/problems?spaceId=1");
        System.out.println("=================================");
    }
} 