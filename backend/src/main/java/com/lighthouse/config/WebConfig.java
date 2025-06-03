package com.lighthouse.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web配置类
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Autowired
    private TraceInterceptor traceInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(traceInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                    "/api/doc.html",
                     "/api/v3/api-docs",
                    "/api/v3/**",
                    "/webjars/**",
                    "/health", 
                    "/actuator/**", 
                    "/favicon.ico", 
                    "/static/**",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/img/**",
                    "/fonts/**",
                    "/assets/**",
                    "/**/*.css",
                    "/**/*.js",
                    "/**/*.png",
                    "/**/*.jpg",
                    "/**/*.jpeg",
                    "/**/*.gif",
                    "/**/*.ico",
                    "/**/*.svg",
                    "/**/*.woff",
                    "/**/*.woff2",
                    "/**/*.ttf",
                    "/**/*.eot",
                    "/**/*.html",
                    "/**/*.htm"
                );
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 静态资源处理
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
        
        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/");
                
        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/js/");
                
        registry.addResourceHandler("/images/**", "/img/**")
                .addResourceLocations("classpath:/static/images/");
                
        registry.addResourceHandler("/fonts/**")
                .addResourceLocations("classpath:/static/fonts/");
                
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/");
        
        // 处理favicon.ico请求，避免404错误
        registry.addResourceHandler("/favicon.ico")
                .addResourceLocations("classpath:/static/favicon.ico");
    }
} 