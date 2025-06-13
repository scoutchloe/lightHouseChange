package com.nextera.managelighthouse.annotation;

import java.lang.annotation.*;

/**
 * 操作日志注解
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface OperationLog {
    
    /**
     * 操作模块
     */
    String module() default "";
    
    /**
     * 操作类型
     */
    OperationType type() default OperationType.OTHER;
    
    /**
     * 操作描述
     */
    String description() default "";
    
    /**
     * 是否记录请求参数
     */
    boolean recordParams() default true;
    
    /**
     * 是否记录响应结果
     */
    boolean recordResult() default true;
    
    /**
     * 操作类型枚举
     */
    enum OperationType {
        CREATE("CREATE", "新增"),
        UPDATE("UPDATE", "修改"),
        DELETE("DELETE", "删除"),
        QUERY("QUERY", "查询"),
        LOGIN("LOGIN", "登录"),
        LOGOUT("LOGOUT", "退出"),
        EXPORT("EXPORT", "导出"),
        IMPORT("IMPORT", "导入"),
        OTHER("OTHER", "其他");
        
        private final String code;
        private final String description;
        
        OperationType(String code, String description) {
            this.code = code;
            this.description = description;
        }
        
        public String getCode() {
            return code;
        }
        
        public String getDescription() {
            return description;
        }
    }
} 