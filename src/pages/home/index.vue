<template>
  <view class="page-container">
    <!-- 搜索框 -->
    <view class="search-container">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input 
          type="text" 
          placeholder="搜索空间或改造方案" 
          confirm-type="search"
          v-model="searchText"
          @confirm="handleSearch"
        />
      </view>
    </view>

    <!-- 轮播图 -->
    <common-swiper :items="banners"></common-swiper>
    
    <!-- 入口导航 -->
    <entry-nav></entry-nav>
    
    <!-- 热门方案 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">热门方案</text>
        <text class="section-more" @click="goToSolutions">查看更多 ></text>
      </view>
      <solution-card 
        v-for="solution in hotSolutions" 
        :key="solution.id" 
        :solution="solution"
      ></solution-card>
    </view>
    
    <!-- 今日推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">今日推荐</text>
        <text class="section-more">查看更多 ></text>
      </view>
      <view class="recommendations">
        <view 
          class="recommendation-item" 
          v-for="item in recommendations" 
          :key="item.id"
        >
          <image :src="item.image" mode="aspectFill" class="recommendation-image" />
          <view class="recommendation-info">
            <text class="recommendation-title">{{ item.title }}</text>
            <text class="recommendation-desc">{{ item.description }}</text>
            <view class="recommendation-tags">
              <text 
                v-for="(tag, index) in item.tags" 
                :key="index" 
                class="tag" 
                :class="{'tag-primary': index === 0, 'tag-gray': index !== 0}"
              >{{ tag }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { api } from '@/api/index.js'
import CommonSwiper from '@/components/CommonSwiper.vue'
import EntryNav from '@/components/EntryNav.vue'
import SolutionCard from '@/components/SolutionCard.vue'

// 响应式数据
const searchText = ref('')
const banners = ref([])
const hotSolutions = ref([])
const recommendations = ref([])

// 生命周期
// 移除onMounted，避免重复调用
// onMounted(() => {
//   fetchData()
// })

onLoad(() => {
  fetchData()
})

onPullDownRefresh(() => {
  Promise.all([
    fetchBanners(),
    fetchHotSolutions(),
    fetchRecommendations()
  ]).then(() => {
    uni.stopPullDownRefresh()
  })
})

// 方法
const fetchData = () => {
  fetchBanners()
  fetchHotSolutions()
  fetchRecommendations()
}

const fetchBanners = async () => {
  try {
    banners.value = await api.getBanners()
  } catch (error) {
    console.error('获取轮播图失败', error)
    uni.showToast({
      title: '获取轮播图失败',
      icon: 'none'
    })
  }
}

const fetchHotSolutions = async () => {
  try {
    hotSolutions.value = await api.getHotSolutions(2)
  } catch (error) {
    console.error('获取热门方案失败', error)
    uni.showToast({
      title: '获取热门方案失败',
      icon: 'none'
    })
  }
}

const fetchRecommendations = async () => {
  try {
    recommendations.value = await api.getRecommendations()
  } catch (error) {
    console.error('获取推荐内容失败', error)
    uni.showToast({
      title: '获取推荐内容失败',
      icon: 'none'
    })
  }
}

const handleSearch = () => {
  if (!searchText.value.trim()) return
  
  // 方案列表页是tabBar页面，不能直接传递参数
  // 先跳转到tabBar页面，然后通过事件传递搜索关键词
  uni.switchTab({
    url: '/pages/solution-list/index',
    success: () => {
      // 通过事件传递搜索参数
      uni.$emit('searchKeyword', searchText.value)
    }
  })
}

const goToSolutions = () => {
  uni.switchTab({
    url: '/pages/solution-list/index'
  })
}
</script>

<style>
.search-container {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #F3F4F6;
  border-radius: 20px;
  padding: 8px 16px;
}

.icon-search {
  margin-right: 8px;
  color: #9CA3AF;
}

.search-box input {
  flex: 1;
  font-size: 14px;
  height: 28px;
}

.section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
}

.section-more {
  font-size: 14px;
  color: #4F46E5;
}

.recommendations {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
}

.recommendation-item {
  display: flex;
  margin-bottom: 16px;
}

.recommendation-item:last-child {
  margin-bottom: 0;
}

.recommendation-image {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  margin-right: 12px;
}

.recommendation-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recommendation-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.recommendation-desc {
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 8px;
}

.recommendation-tags {
  display: flex;
  flex-wrap: wrap;
}
</style> 