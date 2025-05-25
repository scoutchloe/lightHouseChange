<template>
  <view class="page-container">
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
    <block v-else-if="solution">
      <!-- 顶部图片和信息 -->
      <swiper 
        class="solution-swiper"
        :indicator-dots="true"
        indicator-active-color="#ffffff"
        indicator-color="rgba(255, 255, 255, 0.5)"
      >
        <swiper-item>
          <image :src="solution.image" mode="aspectFill" class="solution-image" />
        </swiper-item>
        <swiper-item v-for="(item, index) in solution.beforeAfter" :key="index">
          <view class="before-after-container">
            <image :src="item.before" mode="aspectFill" class="before-image" />
            <image :src="item.after" mode="aspectFill" class="after-image" />
            <view class="compare-divider"></view>
            <text class="before-label">改造前</text>
            <text class="after-label">改造后</text>
          </view>
        </swiper-item>
      </swiper>

      <!-- 基本信息 -->
      <view class="solution-info-card">
        <text class="solution-title">{{ solution.title }}</text>
        <view class="solution-price-row">
          <text class="solution-price">¥{{ solution.price }}</text>
          <view class="rating">
            <text>{{ solution.rating }}</text>
            <text class="rating-star">★</text>
          </view>
        </view>
        <view class="tag-container">
          <text 
            v-for="(tag, index) in solution.tags" 
            :key="index" 
            class="tag" 
            :class="{'tag-primary': index === 0, 'tag-gray': index !== 0}"
          >{{ tag }}</text>
        </view>
        <view class="benefit-row">
          <text class="benefit-text">{{ solution.benefits }}</text>
        </view>
      </view>

      <!-- 详细描述 -->
      <view class="detail-card">
        <text class="section-title">方案描述</text>
        <text class="description-text">{{ solution.description }}</text>
      </view>

      <!-- 材料清单 -->
      <view class="detail-card">
        <text class="section-title">材料清单</text>
        <view class="material-list">
          <view class="material-item" v-for="(item, index) in solution.materials" :key="index">
            <view class="material-info">
              <text class="material-name">{{ item.name }}</text>
              <text class="material-quantity">x{{ item.quantity }}</text>
            </view>
            <text class="material-price">¥{{ item.price }}</text>
          </view>
        </view>
        <view class="material-total">
          <text>材料总价</text>
          <text class="total-price">¥{{ calculateMaterialTotal() }}</text>
        </view>
      </view>

      <!-- 改造步骤 -->
      <view class="detail-card">
        <text class="section-title">改造步骤</text>
        <view class="step-list">
          <view class="step-item" v-for="(step, index) in solution.steps" :key="index">
            <view class="step-number">{{ index + 1 }}</view>
            <text class="step-text">{{ step }}</text>
          </view>
        </view>
      </view>

      <!-- 底部操作按钮 -->
      <view class="action-bar">
        <view class="save-btn" @click="toggleFavorite">
          <text class="iconfont" :class="isFavorite ? 'icon-heart-fill' : 'icon-heart'" :style="{color: isFavorite ? '#EF4444' : '#6B7280'}"></text>
          <text class="btn-text">收藏</text>
        </view>
        <view class="share-btn" @click="shareSolution">
          <text class="iconfont icon-share"></text>
          <text class="btn-text">分享</text>
        </view>
        <button class="add-to-cart-btn" @click="addToCart">
          加入购物车
        </button>
      </view>
    </block>
    <view v-else class="error-state">
      <text class="error-icon iconfont icon-warning"></text>
      <text class="error-text">获取方案详情失败</text>
      <button class="btn btn-primary btn-sm" style="margin-top: 16px;" @click="goBack">
        返回列表
      </button>
    </view>
  </view>
</template>

<script>
import { api } from '@/api/index.js'
import { useCartStore } from '@/store/index.js'

export default {
  data() {
    return {
      loading: true,
      solution: null,
      isFavorite: false
    }
  },
  setup() {
    const cartStore = useCartStore()
    return {
      cartStore
    }
  },
  onLoad(options) {
    if (options.id) {
      this.fetchSolutionDetail(options.id)
    } else {
      this.loading = false
    }
  },
  methods: {
    async fetchSolutionDetail(id) {
      this.loading = true
      try {
        this.solution = await api.getSolutionDetail(id)
      } catch (error) {
        console.error('获取方案详情失败', error)
        uni.showToast({
          title: '获取方案详情失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    calculateMaterialTotal() {
      if (!this.solution || !this.solution.materials) return 0
      
      return this.solution.materials.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      
      uni.showToast({
        title: this.isFavorite ? '已收藏' : '已取消收藏',
        icon: 'none'
      })
    },
    shareSolution() {
      uni.showShareMenu({
        withShareTicket: true,
        success() {
          console.log('打开分享菜单成功')
        },
        fail() {
          uni.showToast({
            title: '分享失败',
            icon: 'none'
          })
        }
      })
    },
    addToCart() {
      if (!this.solution) return
      
      try {
        this.cartStore.addToCart({
          id: this.solution.id,
          title: this.solution.title,
          price: this.solution.price,
          image: this.solution.image
        })
        
        uni.showToast({
          title: '已加入购物车',
          icon: 'success'
        })
      } catch (error) {
        console.error('加入购物车失败', error)
        uni.showToast({
          title: '加入购物车失败',
          icon: 'none'
        })
      }
    },
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style>
.loading, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
}

.error-icon {
  font-size: 48px;
  color: #EF4444;
  margin-bottom: 16px;
}

.error-text {
  font-size: 16px;
  font-weight: 500;
}

.solution-swiper {
  width: 100%;
  height: 250px;
  margin-bottom: 16px;
}

.solution-image {
  width: 100%;
  height: 100%;
}

.before-after-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.before-image, .after-image {
  position: absolute;
  width: 50%;
  height: 100%;
  top: 0;
}

.before-image {
  left: 0;
}

.after-image {
  right: 0;
}

.compare-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background-color: #FFFFFF;
  z-index: 1;
}

.before-label, .after-label {
  position: absolute;
  bottom: 16px;
  color: #FFFFFF;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1;
}

.before-label {
  left: 16px;
}

.after-label {
  right: 16px;
}

.solution-info-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.solution-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.solution-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.solution-price {
  font-size: 24px;
  font-weight: 600;
  color: #EF4444;
}

.rating {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.rating-star {
  color: #F59E0B;
  margin-left: 4px;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.benefit-row {
  display: flex;
  align-items: center;
}

.benefit-text {
  font-size: 14px;
  color: #6B7280;
}

.detail-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.description-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4B5563;
}

.material-list {
  margin-top: 12px;
  margin-bottom: 16px;
}

.material-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #E5E7EB;
}

.material-item:last-child {
  border-bottom: none;
}

.material-info {
  display: flex;
  flex-direction: column;
}

.material-name {
  font-size: 14px;
  margin-bottom: 4px;
}

.material-quantity {
  font-size: 12px;
  color: #6B7280;
}

.material-price {
  font-size: 14px;
  font-weight: 500;
}

.material-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #E5E7EB;
  font-size: 16px;
  font-weight: 500;
}

.total-price {
  color: #EF4444;
}

.step-list {
  margin-top: 12px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #4F46E5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  font-size: 14px;
}

.step-text {
  font-size: 14px;
  line-height: 1.6;
  flex: 1;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  padding: 12px 16px;
  border-top: 1px solid #E5E7EB;
}

.save-btn, .share-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
  width: 48px;
}

.save-btn .iconfont, .share-btn .iconfont {
  font-size: 20px;
  color: #6B7280;
  margin-bottom: 4px;
}

.btn-text {
  font-size: 12px;
  color: #6B7280;
}

.add-to-cart-btn {
  flex: 1;
  height: 40px;
  line-height: 40px;
  background-color: #4F46E5;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}
</style> 