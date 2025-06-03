package com.lighthouse.aspect;

import com.lighthouse.common.LogUtil;
import com.lighthouse.common.TraceContext;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * 日志切面
 */
@Slf4j
@Aspect
@Component
public class LogAspect {
    
    /**
     * Controller层切点
     */
    @Pointcut("execution(* com.lighthouse.controller..*(..))")
    public void controllerPointcut() {}
    
    /**
     * Service层切点
     */
    @Pointcut("execution(* com.lighthouse.service..*(..))")
    public void servicePointcut() {}
    
    /**
     * Mapper层切点
     */
    @Pointcut("execution(* com.lighthouse.mapper..*(..))")
    public void mapperPointcut() {}
    
    /**
     * Controller层日志记录
     */
    @Around("controllerPointcut()")
    public Object controllerLog(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        
        long startTime = System.currentTimeMillis();
        
        try {
            LogUtil.info("Controller调用开始 - 类: {}, 方法: {}, 参数: {}", 
                    className, methodName, Arrays.toString(args));
            
            Object result = joinPoint.proceed();
            
            long duration = System.currentTimeMillis() - startTime;
            LogUtil.info("Controller调用结束 - 类: {}, 方法: {}, 耗时: {}ms", 
                    className, methodName, duration);
            
            LogUtil.performance(className + "." + methodName, duration);
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            LogUtil.error("Controller调用异常 - 类: {}, 方法: {}, 耗时: {}ms", 
                    e, className, methodName, duration);
            throw e;
        }
    }
    
    /**
     * Service层日志记录
     */
    @Around("servicePointcut()")
    public Object serviceLog(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        
        long startTime = System.currentTimeMillis();
        
        try {
            LogUtil.debug("Service调用开始 - 类: {}, 方法: {}, 参数: {}", 
                    className, methodName, Arrays.toString(args));
            
            Object result = joinPoint.proceed();
            
            long duration = System.currentTimeMillis() - startTime;
            LogUtil.debug("Service调用结束 - 类: {}, 方法: {}, 耗时: {}ms", 
                    className, methodName, duration);
            
            LogUtil.performance(className + "." + methodName, duration);
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            LogUtil.error("Service调用异常 - 类: {}, 方法: {}, 耗时: {}ms", 
                    e, className, methodName, duration);
            throw e;
        }
    }
    
    /**
     * Mapper层日志记录
     */
    @Around("mapperPointcut()")
    public Object mapperLog(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        
        long startTime = System.currentTimeMillis();
        
        try {
            LogUtil.dbInfo("查询", className, args);
            
            Object result = joinPoint.proceed();
            
            long duration = System.currentTimeMillis() - startTime;
            LogUtil.dbInfo("查询完成", className + "." + methodName + " 耗时: " + duration + "ms");
            
            if (duration > 500) {
                LogUtil.warn("数据库查询耗时过长 - 类: {}, 方法: {}, 耗时: {}ms", 
                        className, methodName, duration);
            }
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            LogUtil.dbError("数据库操作异常 - 类: " + className + ", 方法: " + methodName + 
                    ", 耗时: " + duration + "ms", e);
            throw e;
        }
    }
} 