package com.lighthouse.mapper;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lighthouse.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 订单Mapper接口
 */
@Mapper
@DS("postgresql")
public interface OrderMapper extends BaseMapper<Order> {
    
    /**
     * 根据用户ID分页查询订单列表
     */
    IPage<Order> selectOrdersByUserId(Page<Order> page, @Param("userId") Long userId);
    
    /**
     * 根据用户ID和订单状态分页查询订单列表
     */
    IPage<Order> selectOrdersByUserIdAndStatus(Page<Order> page, @Param("userId") Long userId, @Param("orderStatus") String orderStatus);
    
    /**
     * 根据订单号查询订单
     */
    @Select("SELECT * FROM \"orders\" WHERE order_no = #{orderNo}")
    Order selectByOrderNo(@Param("orderNo") String orderNo);
    
    /**
     * 统计用户各状态订单数量
     */
    @Select("SELECT order_status, COUNT(*) as count FROM \"orders\" WHERE user_id = #{userId} GROUP BY order_status")
    List<OrderStatusCount> countOrdersByUserIdAndStatus(@Param("userId") Long userId);
    
    /**
     * 订单状态统计结果类
     */
    class OrderStatusCount {
        private String orderStatus;
        private Long count;
        
        public String getOrderStatus() {
            return orderStatus;
        }
        
        public void setOrderStatus(String orderStatus) {
            this.orderStatus = orderStatus;
        }
        
        public Long getCount() {
            return count;
        }
        
        public void setCount(Long count) {
            this.count = count;
        }
    }
} 