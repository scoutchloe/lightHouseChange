package com.test;

/**
 * @author Scout
 * @date 2025-06-03 12:50
 * @since 1.0
 */
public class TestDemo {
    public static void main(String[] args) {
        // GET /api/v3/api-docs, 结果apiV3: false
        String str = "/api/v3/api-docs";
        System.out.println(str.startsWith("/api/v3/"));

    }
}