package com.lighthouse.mapper;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lighthouse.entity.OrderItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 订单项Mapper接口
 */
@Mapper
@DS("postgresql")
public interface OrderItemMapper extends BaseMapper<OrderItem> {
    
    /**
     * 根据订单ID查询订单项列表
     */
    @Select("SELECT * FROM order_item WHERE order_id = #{orderId} ORDER BY created_at ASC")
    List<OrderItem> selectByOrderId(@Param("orderId") Long orderId);
    
    /**
     * 根据订单ID列表批量查询订单项
     */
    @Select("<script>" +
            "SELECT * FROM order_item WHERE order_id IN " +
            "<foreach collection='orderIds' item='orderId' open='(' separator=',' close=')'>" +
            "#{orderId}" +
            "</foreach>" +
            " ORDER BY order_id, created_at ASC" +
            "</script>")
    List<OrderItem> selectByOrderIds(@Param("orderIds") List<Long> orderIds);
    
    /**
     * 根据商品类型和商品ID查询订单项
     */
    @Select("SELECT * FROM order_item WHERE item_type = #{itemType} AND item_id = #{itemId}")
    List<OrderItem> selectByItemTypeAndId(@Param("itemType") String itemType, @Param("itemId") Long itemId);
} 