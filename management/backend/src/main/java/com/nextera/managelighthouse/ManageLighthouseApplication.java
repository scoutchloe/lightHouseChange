package com.nextera.managelighthouse;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.nextera.managelighthouse.mapper")
public class ManageLighthouseApplication {

    public static void main(String[] args) {
        SpringApplication.run(ManageLighthouseApplication.class, args);
    }

}
