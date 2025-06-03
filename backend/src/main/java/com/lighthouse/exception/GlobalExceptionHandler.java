package com.lighthouse.exception;

import com.lighthouse.common.ApiResponse;
import com.lighthouse.common.LogUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理静态资源未找到异常（如favicon.ico、css、js、images等）
     */
    @ExceptionHandler(NoResourceFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public void handleNoResourceFoundException(NoResourceFoundException e) {
        // 判断是否为静态资源请求
        String resourcePath = e.getResourcePath();
        if (isStaticResource(resourcePath)) {
            // 静态资源请求不记录任何日志，直接忽略
            return;
        }
        
        // 非静态资源的404才记录警告日志
        LogUtil.warn("资源未找到: {}", resourcePath);
        // 不返回响应体，让Spring Boot处理404
    }
    
    /**
     * 判断是否为静态资源
     */
    private boolean isStaticResource(String resourcePath) {
        if (resourcePath == null) {
            return false;
        }

        LogUtil.info("####请求结束222 - {}, 结果apiV3: {} - ",resourcePath, resourcePath.startsWith("/v3/api-docs"));


        return resourcePath.startsWith("static/") ||
               resourcePath.startsWith("css/") ||
               resourcePath.startsWith("js/") ||
               resourcePath.startsWith("images/") ||
               resourcePath.startsWith("img/") ||
               resourcePath.startsWith("fonts/") ||
               resourcePath.startsWith("assets/") ||
               resourcePath.equals("favicon.ico") ||
               resourcePath.endsWith(".css") ||
               resourcePath.endsWith(".js") ||
               resourcePath.endsWith(".png") ||
               resourcePath.endsWith(".jpg") ||
               resourcePath.endsWith(".jpeg") ||
               resourcePath.endsWith(".gif") ||
               resourcePath.endsWith(".ico") ||
               resourcePath.endsWith(".svg") ||
               resourcePath.endsWith(".woff") ||
               resourcePath.endsWith(".woff2") ||
               resourcePath.endsWith(".ttf") ||
               resourcePath.endsWith(".eot") ||
               resourcePath.endsWith(".html") ||
               resourcePath.endsWith(".htm");
    }

    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Object> handleBusinessException(BusinessException e) {
        LogUtil.warn("业务异常: {}", e.getMessage());
        return ApiResponse.error(e.getMessage());
    }

    /**
     * 处理参数校验异常
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Object> handleIllegalArgumentException(IllegalArgumentException e) {
        LogUtil.warn("参数异常: {}", e.getMessage());
        return ApiResponse.error("参数错误：" + e.getMessage());
    }

    /**
     * 处理空指针异常
     */
    @ExceptionHandler(NullPointerException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Object> handleNullPointerException(NullPointerException e) {
        LogUtil.error("空指针异常", e);
        return ApiResponse.error("系统内部错误");
    }

    /**
     * 处理数据库异常
     */
    @ExceptionHandler({
        org.springframework.dao.DataAccessException.class,
        java.sql.SQLException.class
    })
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Object> handleDatabaseException(Exception e) {
        LogUtil.dbError("数据库异常", e);
        return ApiResponse.error("数据操作失败");
    }

    /**
     * 处理所有其他异常
     */
//    @ExceptionHandler(Exception.class)
//    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
//    public ApiResponse<Object> handleException(Exception e) {
//        LogUtil.error("系统异常: {}", e, e.getMessage());
//        return ApiResponse.error("系统内部错误：" + e.getMessage());
//    }
} 