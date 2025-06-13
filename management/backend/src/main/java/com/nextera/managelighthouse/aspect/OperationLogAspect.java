package com.nextera.managelighthouse.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nextera.managelighthouse.annotation.OperationLog;
import com.nextera.managelighthouse.entity.OperationLogs;
import com.nextera.managelighthouse.service.OperationLogService;
import com.nextera.managelighthouse.util.IpUtil;
import com.nextera.managelighthouse.util.UserAgentUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.Arrays;

/**
 * 操作日志AOP切面
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class OperationLogAspect {
    
    private final OperationLogService operationLogService;
    private final ObjectMapper objectMapper;
    
    @Pointcut("@annotation(com.nextera.managelighthouse.annotation.OperationLog)")
    public void operationLogPointcut() {}
    
    @Around("operationLogPointcut()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        // 获取注解信息
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        OperationLog operationLogAnnotation = method.getAnnotation(OperationLog.class);
        
        // 获取请求信息
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes != null ? attributes.getRequest() : null;
        
        // 构建操作日志对象
        OperationLogs operationLog = new OperationLogs();
        
        try {
            // 执行目标方法
            Object result = joinPoint.proceed();
            
            // 记录成功日志
            recordOperationLog(joinPoint, operationLogAnnotation, request, operationLog, 
                             result, null, startTime);
            
            return result;
        } catch (Exception e) {
            // 记录失败日志
            recordOperationLog(joinPoint, operationLogAnnotation, request, operationLog, 
                             null, e, startTime);
            throw e;
        }
    }
    
    private void recordOperationLog(JoinPoint joinPoint, OperationLog annotation, 
                                   HttpServletRequest request, 
                                   OperationLogs operationLog,
                                   Object result, Exception exception, long startTime) {
        try {
            // 基本信息
            operationLog.setModule(annotation.module());
            operationLog.setOperationType(annotation.type().getCode());
            operationLog.setOperationDesc(annotation.description());
            operationLog.setOperationTime(LocalDateTime.now());
            operationLog.setExecutionTime(System.currentTimeMillis() - startTime);
            
            if (request != null) {
                // 请求信息
                operationLog.setRequestMethod(request.getMethod());
                operationLog.setRequestUrl(request.getRequestURI());
                
                // IP和地理位置
                String clientIp = IpUtil.getClientIp(request);
                operationLog.setOperationIp(clientIp);
                operationLog.setOperationLocation(IpUtil.getLocationByIp(clientIp));
                
                // 浏览器和操作系统
                String userAgent = request.getHeader("User-Agent");
                operationLog.setBrowser(UserAgentUtil.getBrowser(userAgent));
                operationLog.setOs(UserAgentUtil.getOperatingSystem(userAgent));
                
                // 记录请求参数
                if (annotation.recordParams()) {
                    Object[] args = joinPoint.getArgs();
                    if (args != null && args.length > 0) {
                        // 过滤敏感参数
                        String params = filterSensitiveParams(args);
                        operationLog.setRequestParams(params);
                    }
                }
            }
            
            // 操作状态和结果
            if (exception != null) {
                operationLog.setStatus(0);
                operationLog.setErrorMsg(exception.getMessage());
            } else {
                operationLog.setStatus(1);
                
                // 记录响应结果
                if (annotation.recordResult() && result != null) {
                    try {
                        String resultStr = objectMapper.writeValueAsString(result);
                        // 限制结果长度
                        if (resultStr.length() > 2000) {
                            resultStr = resultStr.substring(0, 2000) + "...";
                        }
                        operationLog.setResponseResult(resultStr);
                    } catch (Exception e) {
                        log.warn("序列化响应结果失败", e);
                    }
                }
            }
            
            // 从请求属性中获取当前用户信息（由JWT过滤器设置）
            Long currentUserId = (Long) request.getAttribute("currentUserId");
            String currentUsername = (String) request.getAttribute("currentUsername");
            
            if (currentUserId != null && currentUsername != null) {
                operationLog.setAdminId(currentUserId);
                operationLog.setAdminUsername(currentUsername);
            } else {
                // 如果没有认证信息，设置为默认值（可能是公开接口）
                operationLog.setAdminId(0L);
                operationLog.setAdminUsername("anonymous");
            }
            
            // 异步记录日志
            operationLogService.recordLog(operationLog);
            
        } catch (Exception e) {
            log.error("记录操作日志失败", e);
        }
    }
    
    /**
     * 过滤敏感参数
     */
    private String filterSensitiveParams(Object[] args) {
        try {
            // 过滤密码等敏感信息
            String params = Arrays.toString(args);
            params = params.replaceAll("\"password\"\\s*:\\s*\"[^\"]*\"", "\"password\":\"***\"");
            params = params.replaceAll("password=[^,\\]\\}]*", "password=***");
            
            // 限制参数长度
            if (params.length() > 2000) {
                params = params.substring(0, 2000) + "...";
            }
            
            return params;
        } catch (Exception e) {
            log.warn("过滤敏感参数失败", e);
            return "参数记录失败";
        }
    }
} 