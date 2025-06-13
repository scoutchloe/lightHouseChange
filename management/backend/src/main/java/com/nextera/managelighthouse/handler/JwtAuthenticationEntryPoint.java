package com.nextera.managelighthouse.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nextera.managelighthouse.common.Result;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * JWT认证入口点
 * 处理未认证的请求
 */
@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public void commence(HttpServletRequest request, 
                        HttpServletResponse response, 
                        AuthenticationException authException) throws IOException, ServletException {
        
        log.warn("未认证访问: {} {}, 错误: {}", request.getMethod(), request.getRequestURI(), authException.getMessage());
        
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        
        Result<String> result = Result.error(401, "未认证，请先登录");
        String jsonResult = objectMapper.writeValueAsString(result);
        
        response.getWriter().write(jsonResult);
    }
} 