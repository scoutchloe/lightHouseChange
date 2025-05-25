package com.lighthouse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 入舍 - 家居轻改造微信小程序后端API
 * 
 * @author lighthouse
 * @version 1.0.0
 */
@SpringBootApplication
public class HomeRenovationApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(HomeRenovationApiApplication.class, args);
        System.out.println("=================================");
        System.out.println("入舍 - 家居轻改造API服务启动成功！");
        System.out.println("访问地址: http://localhost:8081/api");
        System.out.println("=================================");
    }
} 