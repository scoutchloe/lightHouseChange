package com.nextera.managelighthouse.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Scout
 * @date 2025-06-13 7:35
 * @since 1.0
 */
@RestController
public class Demo {

    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }
}