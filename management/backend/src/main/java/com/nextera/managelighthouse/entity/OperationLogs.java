package com.nextera.managelighthouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 操作日志实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("operation_log")
public class OperationLogs {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 操作人ID
     */
    @TableField("admin_id")
    private Long adminId;
    
    /**
     * 操作人用户名
     */
    @TableField("admin_username")
    private String adminUsername;
    
    /**
     * 操作模块
     */
    @TableField("module")
    private String module;
    
    /**
     * 操作类型：CREATE-新增，UPDATE-修改，DELETE-删除，QUERY-查询，LOGIN-登录，LOGOUT-退出
     */
    @TableField("operation_type")
    private String operationType;
    
    /**
     * 操作描述
     */
    @TableField("operation_desc")
    private String operationDesc;
    
    /**
     * 请求方法
     */
    @TableField("request_method")
    private String requestMethod;
    
    /**
     * 请求URL
     */
    @TableField("request_url")
    private String requestUrl;
    
    /**
     * 请求参数
     */
    @TableField("request_params")
    private String requestParams;
    
    /**
     * 响应结果
     */
    @TableField("response_result")
    private String responseResult;
    
    /**
     * 操作状态：0-失败，1-成功
     */
    @TableField("status")
    private Integer status;
    
    /**
     * 错误信息
     */
    @TableField("error_msg")
    private String errorMsg;
    
    /**
     * 操作IP
     */
    @TableField("operation_ip")
    private String operationIp;
    
    /**
     * 操作地点
     */
    @TableField("operation_location")
    private String operationLocation;
    
    /**
     * 浏览器信息
     */
    @TableField("browser")
    private String browser;
    
    /**
     * 操作系统
     */
    @TableField("os")
    private String os;
    
    /**
     * 执行时间(毫秒)
     */
    @TableField("execution_time")
    private Long executionTime;
    
    /**
     * 操作时间
     */
    @TableField(value = "operation_time", fill = FieldFill.INSERT)
    private LocalDateTime operationTime;
    
    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
} 