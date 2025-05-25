<template>
  <view class="page-container">
    <!-- 空购物车状态 -->
    <view v-if="cartItems.length === 0" class="empty-cart">
      <image src="/static/images/empty-cart.png" mode="aspectFit" class="empty-image" />
      <text class="empty-title">购物车空空如也</text>
      <text class="empty-desc">快去挑选心仪的改造方案吧</text>
      <button class="go-shopping-btn" @click="goShopping">去逛逛</button>
    </view>

    <!-- 购物车内容 -->
    <view v-else class="cart-content">
      <!-- 全选栏 -->
      <view class="select-all-bar">
        <view class="select-all" @click="toggleSelectAll">
          <text class="checkbox" :class="{ checked: isAllSelected }">✓</text>
          <text class="select-text">全选</text>
        </view>
        <text class="total-count">共{{ cartItems.length }}件商品</text>
      </view>

      <!-- 购物车列表 -->
      <scroll-view class="cart-list" scroll-y @scrolltolower="loadMore">
        <view 
          v-for="item in cartItems" 
          :key="item.id"
          class="cart-item"
          :class="{ selected: item.selected }"
        >
          <!-- 选择框 -->
          <view class="item-checkbox" @click="toggleItemSelect(item)">
            <text class="checkbox" :class="{ checked: item.selected }">✓</text>
          </view>

          <!-- 商品信息 -->
          <view class="item-info" @click="goToDetail(item)">
            <image :src="item.image" mode="aspectFill" class="item-image" />
            <view class="item-details">
              <text class="item-title">{{ item.title }}</text>
              <text class="item-desc">{{ item.description }}</text>
              <view class="item-tags">
                <text 
                  v-for="tag in item.tags" 
                  :key="tag" 
                  class="tag"
                >{{ tag }}</text>
              </view>
              <view class="item-price">
                <text class="current-price">¥{{ item.price }}</text>
                <text v-if="item.originalPrice" class="original-price">¥{{ item.originalPrice }}</text>
              </view>
            </view>
          </view>

          <!-- 数量控制 -->
          <view class="quantity-control">
            <button 
              class="quantity-btn decrease" 
              @click="decreaseQuantity(item)"
              :disabled="item.quantity <= 1"
            >-</button>
            <input 
              type="number" 
              v-model="item.quantity" 
              @blur="updateQuantity(item)"
              class="quantity-input"
            />
            <button 
              class="quantity-btn increase" 
              @click="increaseQuantity(item)"
            >+</button>
          </view>

          <!-- 删除按钮 -->
          <view class="item-actions">
            <button class="delete-btn" @click="removeItem(item)">
              <text class="iconfont icon-delete"></text>
            </button>
          </view>
        </view>
      </scroll-view>

      <!-- 推荐商品 -->
      <view v-if="recommendedItems.length > 0" class="recommended-section">
        <view class="section-header">
          <text class="section-title">为你推荐</text>
        </view>
        <scroll-view class="recommended-list" scroll-x>
          <view 
            v-for="item in recommendedItems" 
            :key="item.id"
            class="recommended-item"
            @click="addRecommendedItem(item)"
          >
            <image :src="item.image" mode="aspectFill" class="recommended-image" />
            <text class="recommended-title">{{ item.title }}</text>
            <text class="recommended-price">¥{{ item.price }}</text>
            <button class="add-to-cart-btn">加入购物车</button>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 底部结算栏 -->
    <view v-if="cartItems.length > 0" class="checkout-bar">
      <view class="price-summary">
        <view class="selected-count">
          <text>已选{{ selectedCount }}件</text>
        </view>
        <view class="total-price">
          <text class="price-label">合计：</text>
          <text class="price-value">¥{{ totalPrice }}</text>
        </view>
        <view v-if="discountAmount > 0" class="discount">
          <text class="discount-text">优惠：-¥{{ discountAmount }}</text>
        </view>
      </view>
      
      <button 
        class="checkout-btn" 
        :class="{ disabled: selectedCount === 0 }"
        @click="checkout"
        :disabled="selectedCount === 0"
      >
        结算({{ selectedCount }})
      </button>
    </view>

    <!-- 优惠券弹窗 -->
    <view v-if="showCouponModal" class="coupon-modal" @click="closeCouponModal">
      <view class="coupon-content" @click.stop>
        <view class="coupon-header">
          <text class="coupon-title">选择优惠券</text>
          <button class="close-btn" @click="closeCouponModal">×</button>
        </view>
        <scroll-view class="coupon-list" scroll-y>
          <view 
            v-for="coupon in availableCoupons" 
            :key="coupon.id"
            class="coupon-item"
            :class="{ selected: selectedCoupon?.id === coupon.id }"
            @click="selectCoupon(coupon)"
          >
            <view class="coupon-info">
              <text class="coupon-amount">¥{{ coupon.amount }}</text>
              <text class="coupon-condition">满{{ coupon.minAmount }}可用</text>
              <text class="coupon-expire">{{ formatCouponExpire(coupon.expireTime) }}</text>
            </view>
            <view class="coupon-status">
              <text v-if="selectedCoupon?.id === coupon.id" class="selected-mark">✓</text>
            </view>
          </view>
        </scroll-view>
        <view class="coupon-actions">
          <button class="coupon-btn secondary" @click="closeCouponModal">取消</button>
          <button class="coupon-btn primary" @click="applyCoupon">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '@/api/index.js'

export default {
  data() {
    return {
      cartItems: [],
      recommendedItems: [],
      showCouponModal: false,
      selectedCoupon: null,
      availableCoupons: [],
      loading: false
    }
  },
  
  computed: {
    // 是否全选
    isAllSelected() {
      return this.cartItems.length > 0 && this.cartItems.every(item => item.selected)
    },
    
    // 已选商品数量
    selectedCount() {
      return this.cartItems.filter(item => item.selected).length
    },
    
    // 总价格
    totalPrice() {
      const total = this.cartItems
        .filter(item => item.selected)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0)
      return (total - this.discountAmount).toFixed(2)
    },
    
    // 优惠金额
    discountAmount() {
      if (!this.selectedCoupon) return 0
      const subtotal = this.cartItems
        .filter(item => item.selected)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      if (subtotal >= this.selectedCoupon.minAmount) {
        return this.selectedCoupon.amount
      }
      return 0
    }
  },
  
  onLoad() {
    this.loadCartItems()
    this.loadRecommendedItems()
    this.loadCoupons()
  },
  
  onShow() {
    // 页面显示时刷新购物车
    this.loadCartItems()
  },
  
  onPullDownRefresh() {
    this.loadCartItems().then(() => {
      uni.stopPullDownRefresh()
    })
  },
  
  methods: {
    // 加载购物车商品
    async loadCartItems() {
      try {
        this.loading = true
        // 从本地存储加载购物车数据
        const cartData = uni.getStorageSync('cart_items') || []
        this.cartItems = cartData.map(item => ({
          ...item,
          selected: item.selected !== false // 默认选中
        }))
      } catch (error) {
        console.error('加载购物车失败', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    // 加载推荐商品
    async loadRecommendedItems() {
      try {
        this.recommendedItems = await api.getRecommendedProducts()
      } catch (error) {
        console.error('加载推荐商品失败', error)
      }
    },
    
    // 加载优惠券
    async loadCoupons() {
      try {
        this.availableCoupons = await api.getAvailableCoupons()
      } catch (error) {
        console.error('加载优惠券失败', error)
      }
    },
    
    // 切换全选状态
    toggleSelectAll() {
      const newSelectState = !this.isAllSelected
      this.cartItems.forEach(item => {
        item.selected = newSelectState
      })
      this.saveCartToStorage()
    },
    
    // 切换单个商品选择状态
    toggleItemSelect(item) {
      item.selected = !item.selected
      this.saveCartToStorage()
    },
    
    // 增加商品数量
    increaseQuantity(item) {
      item.quantity++
      this.saveCartToStorage()
    },
    
    // 减少商品数量
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--
        this.saveCartToStorage()
      }
    },
    
    // 更新商品数量
    updateQuantity(item) {
      if (item.quantity < 1) {
        item.quantity = 1
      }
      this.saveCartToStorage()
    },
    
    // 删除商品
    removeItem(item) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个商品吗？',
        success: (res) => {
          if (res.confirm) {
            const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id)
            if (index > -1) {
              this.cartItems.splice(index, 1)
              this.saveCartToStorage()
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
            }
          }
        }
      })
    },
    
    // 添加推荐商品到购物车
    addRecommendedItem(item) {
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id)
      
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.cartItems.push({
          ...item,
          quantity: 1,
          selected: true
        })
      }
      
      this.saveCartToStorage()
      uni.showToast({
        title: '已加入购物车',
        icon: 'success'
      })
    },
    
    // 保存购物车到本地存储
    saveCartToStorage() {
      try {
        uni.setStorageSync('cart_items', this.cartItems)
      } catch (error) {
        console.error('保存购物车失败', error)
      }
    },
    
    // 跳转到商品详情
    goToDetail(item) {
      uni.navigateTo({
        url: `/pages/solution-detail/index?id=${item.id}`
      })
    },
    
    // 去购物
    goShopping() {
      uni.switchTab({
        url: '/pages/solution-list/index'
      })
    },
    
    // 结算
    checkout() {
      if (this.selectedCount === 0) {
        uni.showToast({
          title: '请选择要结算的商品',
          icon: 'none'
        })
        return
      }
      
      // 准备结算数据
      const checkoutItems = this.cartItems.filter(item => item.selected)
      const checkoutData = {
        items: checkoutItems,
        totalPrice: this.totalPrice,
        discountAmount: this.discountAmount,
        coupon: this.selectedCoupon
      }
      
      // 跳转到结算页面
      uni.navigateTo({
        url: `/pages/checkout/index?data=${encodeURIComponent(JSON.stringify(checkoutData))}`
      })
    },
    
    // 显示优惠券弹窗
    showCoupons() {
      this.showCouponModal = true
    },
    
    // 关闭优惠券弹窗
    closeCouponModal() {
      this.showCouponModal = false
    },
    
    // 选择优惠券
    selectCoupon(coupon) {
      this.selectedCoupon = coupon
    },
    
    // 应用优惠券
    applyCoupon() {
      this.closeCouponModal()
      if (this.selectedCoupon) {
        uni.showToast({
          title: `已使用优惠券，优惠¥${this.discountAmount}`,
          icon: 'success'
        })
      }
    },
    
    // 格式化优惠券过期时间
    formatCouponExpire(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diffDays = Math.ceil((date - now) / (24 * 60 * 60 * 1000))
      
      if (diffDays <= 0) {
        return '已过期'
      } else if (diffDays <= 7) {
        return `${diffDays}天后过期`
      } else {
        return `${date.getMonth() + 1}月${date.getDate()}日过期`
      }
    },
    
    // 加载更多
    loadMore() {
      // 暂时不实现分页加载
    }
  }
}
</script>

<style>
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
}

.empty-image {
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-title {
  font-size: 18px;
  color: #374151;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #9CA3AF;
  margin-bottom: 32px;
}

.go-shopping-btn {
  padding: 12px 32px;
  background-color: #4F46E5;
  color: #FFFFFF;
  border: none;
  border-radius: 24px;
  font-size: 16px;
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.select-all-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
}

.select-all {
  display: flex;
  align-items: center;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #D1D5DB;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 12px;
  color: transparent;
}

.checkbox.checked {
  background-color: #4F46E5;
  border-color: #4F46E5;
  color: #FFFFFF;
}

.select-text {
  font-size: 16px;
  color: #374151;
}

.total-count {
  font-size: 14px;
  color: #6B7280;
}

.cart-list {
  flex: 1;
  background-color: #F9FAFB;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #FFFFFF;
  margin-bottom: 8px;
}

.cart-item.selected {
  background-color: #FEF2F2;
}

.item-checkbox {
  margin-right: 12px;
}

.item-info {
  flex: 1;
  display: flex;
  margin-right: 12px;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 12px;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 4px;
}

.item-desc {
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 8px;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.tag {
  font-size: 10px;
  color: #4F46E5;
  background-color: #EEF2FF;
  padding: 2px 6px;
  border-radius: 4px;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-price {
  font-size: 16px;
  font-weight: 500;
  color: #EF4444;
}

.original-price {
  font-size: 12px;
  color: #9CA3AF;
  text-decoration: line-through;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #D1D5DB;
  background-color: #FFFFFF;
  color: #374151;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn.decrease {
  border-radius: 4px 0 0 4px;
}

.quantity-btn.increase {
  border-radius: 0 4px 4px 0;
}

.quantity-btn:disabled {
  opacity: 0.5;
}

.quantity-input {
  width: 50px;
  height: 32px;
  border: 1px solid #D1D5DB;
  border-left: none;
  border-right: none;
  text-align: center;
  font-size: 14px;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.delete-btn {
  width: 32px;
  height: 32px;
  background-color: #FEF2F2;
  color: #EF4444;
  border: 1px solid #FECACA;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recommended-section {
  background-color: #FFFFFF;
  padding: 16px;
  margin-top: 8px;
}

.section-header {
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #1F2937;
}

.recommended-list {
  white-space: nowrap;
}

.recommended-item {
  display: inline-block;
  width: 120px;
  margin-right: 12px;
  text-align: center;
}

.recommended-image {
  width: 100%;
  height: 80px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.recommended-title {
  font-size: 12px;
  color: #374151;
  display: block;
  margin-bottom: 4px;
}

.recommended-price {
  font-size: 14px;
  font-weight: 500;
  color: #EF4444;
  display: block;
  margin-bottom: 8px;
}

.add-to-cart-btn {
  width: 100%;
  padding: 6px;
  background-color: #4F46E5;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 12px;
}

.checkout-bar {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #FFFFFF;
  border-top: 1px solid #E5E7EB;
}

.price-summary {
  flex: 1;
  margin-right: 16px;
}

.selected-count {
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 4px;
}

.total-price {
  display: flex;
  align-items: center;
}

.price-label {
  font-size: 14px;
  color: #374151;
  margin-right: 4px;
}

.price-value {
  font-size: 18px;
  font-weight: 500;
  color: #EF4444;
}

.discount {
  margin-top: 4px;
}

.discount-text {
  font-size: 12px;
  color: #059669;
}

.checkout-btn {
  padding: 12px 24px;
  background-color: #4F46E5;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.checkout-btn.disabled {
  background-color: #D1D5DB;
  color: #9CA3AF;
}

.coupon-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.coupon-content {
  width: 90%;
  max-width: 400px;
  max-height: 80%;
  background-color: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
}

.coupon-title {
  font-size: 18px;
  font-weight: 500;
  color: #1F2937;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #F3F4F6;
  color: #6B7280;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coupon-list {
  max-height: 300px;
  padding: 16px;
}

.coupon-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 8px;
}

.coupon-item.selected {
  border-color: #4F46E5;
  background-color: #EEF2FF;
}

.coupon-info {
  flex: 1;
}

.coupon-amount {
  font-size: 18px;
  font-weight: 500;
  color: #EF4444;
  display: block;
}

.coupon-condition {
  font-size: 12px;
  color: #6B7280;
  display: block;
  margin-top: 2px;
}

.coupon-expire {
  font-size: 10px;
  color: #9CA3AF;
  display: block;
  margin-top: 2px;
}

.coupon-status {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-mark {
  color: #4F46E5;
  font-size: 16px;
  font-weight: bold;
}

.coupon-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #E5E7EB;
}

.coupon-btn {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  border: none;
}

.coupon-btn.secondary {
  background-color: #F3F4F6;
  color: #374151;
}

.coupon-btn.primary {
  background-color: #4F46E5;
  color: #FFFFFF;
}
</style> 