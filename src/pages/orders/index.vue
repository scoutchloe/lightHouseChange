<template>
  <view class="orders-container">
    <!-- 状态筛选 -->
    <view class="status-tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentStatus === item.value }"
        v-for="item in statusTabs" 
        :key="item.value"
        @click="switchStatus(item.value)"
      >
        <text class="tab-label">{{ item.label }}</text>
        <text v-if="item.count > 0" class="tab-badge">{{ item.count }}</text>
      </view>
    </view>
    
    <!-- 订单列表 -->
    <view class="orders-list" v-if="filteredOrders.length > 0">
      <view 
        class="order-item" 
        v-for="order in filteredOrders" 
        :key="order.id"
        @click="viewOrderDetail(order)"
      >
        <!-- 订单头部 -->
        <view class="order-header">
          <view class="order-info">
            <text class="order-number">订单号：{{ order.orderNumber }}</text>
            <text class="order-time">{{ formatTime(order.createTime) }}</text>
          </view>
          <view class="order-status" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </view>
        </view>
        
        <!-- 商品列表 -->
        <view class="order-products">
          <view 
            class="product-item" 
            v-for="product in order.products" 
            :key="product.id"
          >
            <image :src="product.image" mode="aspectFill" class="product-image" />
            <view class="product-info">
              <text class="product-name">{{ product.name }}</text>
              <text class="product-spec">{{ product.spec }}</text>
              <view class="product-price-qty">
                <text class="product-price">¥{{ product.price }}</text>
                <text class="product-qty">x{{ product.quantity }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 订单金额 -->
        <view class="order-amount">
          <text class="amount-label">实付款：</text>
          <text class="amount-value">¥{{ order.totalAmount }}</text>
        </view>
        
        <!-- 操作按钮 -->
        <view class="order-actions">
          <button 
            v-if="order.status === 'pending'" 
            class="action-btn secondary"
            @click.stop="cancelOrder(order)"
          >
            取消订单
          </button>
          <button 
            v-if="order.status === 'pending'" 
            class="action-btn primary"
            @click.stop="payOrder(order)"
          >
            立即付款
          </button>
          <button 
            v-if="order.status === 'processing'" 
            class="action-btn secondary"
            @click.stop="trackOrder(order)"
          >
            查看物流
          </button>
          <button 
            v-if="order.status === 'completed'" 
            class="action-btn secondary"
            @click.stop="reviewOrder(order)"
          >
            评价
          </button>
          <button 
            v-if="order.status === 'completed'" 
            class="action-btn primary"
            @click.stop="buyAgain(order)"
          >
            再次购买
          </button>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view v-else class="empty-state">
      <image src="/static/images/empty-orders.png" mode="aspectFit" class="empty-image" />
      <text class="empty-text">暂无{{ getStatusText(currentStatus) }}订单</text>
      <button class="empty-btn" @click="goShopping">去逛逛</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { api } from '@/api/index.js'
import { formatTime } from '@/utils/common.js'
import navigation from '@/utils/navigation.js'

// 响应式数据
const orders = ref([])
const loading = ref(false)
const currentStatus = ref('all')

const statusTabs = ref([
  { label: '全部', value: 'all', count: 0 },
  { label: '待付款', value: 'pending', count: 0 },
  { label: '进行中', value: 'processing', count: 0 },
  { label: '已完成', value: 'completed', count: 0 },
  { label: '退款/售后', value: 'refund', count: 0 }
])

// 计算属性
const filteredOrders = computed(() => {
  if (currentStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === currentStatus.value)
})

// 生命周期
onMounted(() => {
  loadOrders()
})

onLoad((options) => {
  if (options.status) {
    currentStatus.value = options.status
  }
  loadOrders()
})

onShow(() => {
  loadOrders()
})

onPullDownRefresh(() => {
  loadOrders().finally(() => {
    uni.stopPullDownRefresh()
  })
})

// 方法
const loadOrders = async () => {
  try {
    loading.value = true
    const result = await api.getOrders()
    orders.value = result.orders || []
    
    // 更新状态计数
    updateStatusCounts()
  } catch (error) {
    console.error('加载订单失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const updateStatusCounts = () => {
  const counts = {
    all: orders.value.length,
    pending: 0,
    processing: 0,
    completed: 0,
    refund: 0
  }
  
  orders.value.forEach(order => {
    if (counts[order.status] !== undefined) {
      counts[order.status]++
    }
  })
  
  statusTabs.value.forEach(tab => {
    tab.count = counts[tab.value] || 0
  })
}

const switchStatus = (status) => {
  currentStatus.value = status
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待付款',
    processing: '进行中',
    completed: '已完成',
    refund: '退款/售后'
  }
  return statusMap[status] || '全部'
}

const getStatusClass = (status) => {
  return `status-${status}`
}

const viewOrderDetail = (order) => {
  uni.navigateTo({
    url: `/pages/order-detail/index?id=${order.id}`
  })
}

const cancelOrder = (order) => {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消这个订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await api.cancelOrder(order.id)
          uni.showToast({
            title: '订单已取消',
            icon: 'success'
          })
          loadOrders()
        } catch (error) {
          uni.showToast({
            title: '取消失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

const payOrder = (order) => {
  uni.navigateTo({
    url: `/pages/payment/index?orderId=${order.id}`
  })
}

const trackOrder = (order) => {
  uni.navigateTo({
    url: `/pages/logistics/index?orderId=${order.id}`
  })
}

const reviewOrder = (order) => {
  uni.navigateTo({
    url: `/pages/review/index?orderId=${order.id}`  })
}

const buyAgain = (order) => {
  // 将商品添加到购物车
  uni.showLoading({ title: '添加中...' })
  
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '已添加到购物车',
      icon: 'success'
    })
    
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/cart/index'
      })
    }, 1000)
  }, 1000)
}

const goShopping = () => {
  uni.switchTab({
    url: '/pages/home/index'
  })
}
</script>

<style>
.orders-container {
  background-color: #F6F8FA;
  min-height: 100vh;
}

.status-tabs {
  display: flex;
  background-color: #FFFFFF;
  padding: 0 16px;
  border-bottom: 1px solid #E5E7EB;
}

.tab-item {
  flex: 1;
  padding: 16px 0;
  text-align: center;
  position: relative;
  border-bottom: 2px solid transparent;
}

.tab-item.active {
  border-bottom-color: #4F46E5;
}

.tab-label {
  font-size: 14px;
  color: #6B7280;
}

.tab-item.active .tab-label {
  color: #4F46E5;
  font-weight: 500;
}

.tab-badge {
  position: absolute;
  top: 8px;
  right: 20px;
  background-color: #EF4444;
  color: #FFFFFF;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.orders-list {
  padding: 12px 16px;
}

.order-item {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F3F4F6;
}

.order-info {
  flex: 1;
}

.order-number {
  font-size: 14px;
  color: #374151;
  display: block;
  margin-bottom: 4px;
}

.order-time {
  font-size: 12px;
  color: #9CA3AF;
}

.order-status {
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
}

.status-pending {
  color: #F59E0B;
  background-color: #FEF3C7;
}

.status-processing {
  color: #3B82F6;
  background-color: #DBEAFE;
}

.status-completed {
  color: #10B981;
  background-color: #D1FAE5;
}

.status-refund {
  color: #EF4444;
  background-color: #FEE2E2;
}

.order-products {
  margin-bottom: 12px;
}

.product-item {
  display: flex;
  margin-bottom: 12px;
}

.product-item:last-child {
  margin-bottom: 0;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  margin-right: 12px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 14px;
  color: #374151;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-spec {
  font-size: 12px;
  color: #9CA3AF;
  margin-bottom: 8px;
}

.product-price-qty {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 14px;
  color: #EF4444;
  font-weight: 500;
}

.product-qty {
  font-size: 12px;
  color: #9CA3AF;
}

.order-amount {
  text-align: right;
  margin-bottom: 12px;
  padding-top: 12px;
  border-top: 1px solid #F3F4F6;
}

.amount-label {
  font-size: 14px;
  color: #6B7280;
}

.amount-value {
  font-size: 16px;
  color: #EF4444;
  font-weight: 500;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid;
}

.action-btn.primary {
  background-color: #4F46E5;
  color: #FFFFFF;
  border-color: #4F46E5;
}

.action-btn.secondary {
  background-color: #FFFFFF;
  color: #6B7280;
  border-color: #D1D5DB;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
}

.empty-image {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 14px;
  color: #9CA3AF;
  margin-bottom: 24px;
}

.empty-btn {
  padding: 12px 24px;
  background-color: #4F46E5;
  color: #FFFFFF;
  border: none;
  border-radius: 20px;
  font-size: 14px;
}
</style> 
