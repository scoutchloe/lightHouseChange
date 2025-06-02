package com.lighthouse.response;

/**
 * 问题结果输出
 *
 * @author Scout
 * @date 2025-06-02 7:08
 * @since 1.0
 */
public class ProblemResp {

    /**
     *  使用record 模式
     * @param id
     * @param name
     * @param icon
     * @param description
     * @param spaceId
     */
    public record Problem(Integer id, String name, String icon,
                   String description, int spaceId){}
}