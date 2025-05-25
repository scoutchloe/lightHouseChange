<template>
  <view class="page-container">
    <!-- 介绍信息 -->
    <view class="intro-card">
      <view class="intro-header">
        <text class="iconfont icon-home" style="color: #3B82F6; font-size: 20px;"></text>
        <view class="intro-text">
          <text class="intro-title">按空间场景选择</text>
          <text class="intro-desc">针对不同空间的专业改造方案</text>
        </view>
      </view>
      <view class="progress-container">
        <view class="progress-bar">
          <view class="progress-fill" style="width: 33%;"></view>
        </view>
        <view class="progress-info">
          <text class="progress-step">步骤 1/3</text>
          <text class="progress-label">空间选择</text>
        </view>
      </view>
    </view>

    <!-- 空间类型网格 -->
    <view class="space-grid">
      <view 
        class="space-card" 
        v-for="space in spaces" 
        :key="space.id" 
        @click="selectSpace(space)"
      >
        <image :src="space.image" mode="aspectFill" class="space-image" />
        <view class="space-info">
          <view class="space-header">
            <text class="iconfont" :class="'icon-' + space.icon" :style="{color: space.iconColor}"></text>
            <text class="space-name">{{ space.name }}</text>
          </view>
          <text class="space-desc">{{ space.description }}</text>
        </view>
      </view>
    </view>

    <!-- 整屋方案 -->
    <view class="section">
      <text class="section-title">整屋解决方案</text>
      <view class="whole-house-card">
        <image 
          src="https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
          mode="aspectFill" 
          class="whole-house-image" 
        />
        <view class="whole-house-info">
          <text class="whole-house-title">小户型整屋轻改造方案</text>
          <text class="whole-house-desc">适合60㎡以下空间，7天速改，预算控制在5000元内</text>
          <view class="tag-container">
            <text class="tag tag-primary">小户型</text>
            <text class="tag tag-gray">经济实惠</text>
            <text class="tag tag-gray">速改</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 大家都在看 -->
    <view class="section">
      <text class="section-title">大家都在看</text>
      <scroll-view scroll-x class="hot-scroll">
        <view class="hot-scroll-content">
          <view class="hot-item">
            <image 
              src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              mode="aspectFill" 
              class="hot-image" 
            />
            <text class="hot-text">小厨房收纳</text>
          </view>
          <view class="hot-item">
            <image 
              src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              mode="aspectFill" 
              class="hot-image" 
            />
            <text class="hot-text">阳台书房兼改</text>
          </view>
          <view class="hot-item">
            <image 
              src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              mode="aspectFill" 
              class="hot-image" 
            />
            <text class="hot-text">卧室光线提升</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部按钮 -->
    <view class="button-container">
      <button class="btn btn-primary btn-block" @click="goToNextStep">
        下一步：选择改造问题
      </button>
    </view>
  </view>
</template>

<script>
import { api } from '@/api/index.js'
import { useDiagnosisStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'

export default {
  data() {
    return {
      spaces: []
    }
  },
  setup() {
    const diagnosisStore = useDiagnosisStore()
    return {
      diagnosisStore
    }
  },
  onLoad() {
    this.fetchSpaces()
  },
  methods: {
    async fetchSpaces() {
      try {
        this.spaces = await api.getSpaces()
      } catch (error) {
        console.error('获取空间数据失败', error)
        uni.showToast({
          title: '获取空间数据失败',
          icon: 'none'
        })
      }
    },
    selectSpace(space) {
      this.diagnosisStore.setSelectedSpace(space)
      this.goToNextStep()
    },
    goToNextStep() {
      if (!this.diagnosisStore.selectedSpace) {
        uni.showToast({
          title: '请选择一个空间',
          icon: 'none'
        })
        return
      }
      
      uni.navigateTo({
        url: '/pages/problem-diagnosis/index'
      })
    }
  }
}
</script>

<style>
.intro-card {
  background-color: #EBF5FF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.intro-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.intro-text {
  margin-left: 12px;
}

.intro-title {
  font-size: 16px;
  font-weight: 500;
  display: block;
}

.intro-desc {
  font-size: 14px;
  color: #6B7280;
}

.progress-container {
  margin-top: 8px;
}

.progress-bar {
  height: 6px;
  background-color: #E5E7EB;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3B82F6;
  border-radius: 3px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 12px;
  color: #6B7280;
}

.space-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.space-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.space-image {
  width: 100%;
  height: 120px;
}

.space-info {
  padding: 12px;
}

.space-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.space-name {
  font-size: 16px;
  font-weight: 500;
  margin-left: 8px;
}

.space-desc {
  font-size: 12px;
  color: #6B7280;
}

.section {
  margin-bottom: 24px;
}

.whole-house-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.whole-house-image {
  width: 100%;
  height: 160px;
}

.whole-house-info {
  padding: 16px;
}

.whole-house-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.whole-house-desc {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 12px;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
}

.hot-scroll {
  white-space: nowrap;
  width: 100%;
}

.hot-scroll-content {
  display: flex;
  padding: 8px 0;
}

.hot-item {
  width: 144px;
  margin-right: 12px;
  flex-shrink: 0;
}

.hot-image {
  width: 144px;
  height: 96px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.hot-text {
  font-size: 14px;
}

.button-container {
  padding: 16px 0;
}
</style> 