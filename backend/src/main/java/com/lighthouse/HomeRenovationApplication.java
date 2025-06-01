package com.lighthouse;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author Scout
 * @date 2025-06-01 16:11
 * @since 1.0
 */
@SpringBootApplication
@MapperScan(basePackages = "com.lighthouse.mapper")
public class HomeRenovationApplication {
    public static void main(String[] args) {
        SpringApplication.run(HomeRenovationApplication.class, args);
    }
}