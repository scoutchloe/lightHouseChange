<template>
  <view class="favorites-container">
    <!-- 顶部筛选 -->
    <view class="filter-section">
      <view class="filter-tabs">
        <view 
          v-for="tab in filterTabs" 
          :key="tab.value"
          class="filter-tab"
          :class="{ active: currentFilter === tab.value }"
          @click="switchFilter(tab.value)"
        >
          {{ tab.label }}
        </view>
      </view>
      
      <view class="sort-section">
        <text class="sort-label">排序：</text>
        <picker 
          :value="sortIndex" 
          :range="sortOptions" 
          range-key="label"
          @change="onSortChange"
        >
          <view class="sort-picker">
            {{ sortOptions[sortIndex].label }}
            <text class="sort-arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>
    
    <!-- 收藏列表 -->
    <view class="favorites-list" v-if="filteredFavorites.length > 0">
      <view 
        v-for="item in filteredFavorites" 
        :key="item.id"
        class="favorite-item"
        @click="viewDetail(item)"
      >
        <view class="item-image">
          <image :src="item.image" mode="aspectFill" />
          <view class="item-badge" v-if="item.isHot">热门</view>
        </view>
        
        <view class="item-content">
          <view class="item-title">{{ item.title }}</view>
          <view class="item-desc">{{ item.description }}</view>
          
          <view class="item-tags">
            <text 
              v-for="tag in item.tags" 
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </text>
          </view>
          
          <view class="item-footer">
            <view class="item-price">
              <text class="price-label">预算：</text>
              <text class="price-value">¥{{ item.budget }}</text>
            </view>
            
            <view class="item-time">
              {{ formatTime(item.favoriteTime) }}
            </view>
          </view>
        </view>
        
        <view class="item-actions">
          <view class="action-btn" @click.stop="toggleFavorite(item)">
            <text class="action-icon">♥</text>
          </view>
          <view class="action-btn" @click.stop="shareItem(item)">
            <text class="action-icon">⤴</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else-if="!loading">
      <image class="empty-image" src="/static/images/empty-favorites.png" mode="aspectFit" />
      <text class="empty-text">还没有收藏任何方案</text>
      <text class="empty-desc">去发现更多精彩的改造方案吧</text>
      <button class="empty-btn" @click="goExplore">去逛逛</button>
    </view>
    
    <!-- 加载状态 -->
    <view class="loading-state" v-if="loading">
      <uni-load-more status="loading" />
    </view>
    
    <!-- 批量操作栏 -->
    <view class="batch-actions" v-if="selectedItems.length > 0">
      <view class="batch-info">
        已选择 {{ selectedItems.length }} 项
      </view>
      <view class="batch-buttons">
        <button class="batch-btn cancel" @click="cancelBatch">取消</button>
        <button class="batch-btn delete" @click="batchDelete">删除</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import store from '@/store/index.js'
import navigation from '@/utils/navigation.js'
import { getRelativeTime } from '@/utils/common.js'
import { api } from '@/api/index.js'

const favorites = ref([])
const loading = ref(true)
const currentFilter = ref('all')
const sortIndex = ref(0)
const selectedItems = ref([])
const batchMode = ref(false)

const filterTabs = [
  { label: '全部', value: 'all' },
  { label: '客厅', value: '客厅' },
  { label: '卧室', value: '卧室' },
  { label: '厨房', value: '厨房' },
  { label: '卫生间', value: '卫生间' }
]

const sortOptions = [
  { label: '收藏时间', value: 'favoriteTime' },
  { label: '价格从低到高', value: 'budget_asc' },
  { label: '价格从高到低', value: 'budget_desc' },
  { label: '热度', value: 'popularity' }
]

const filteredFavorites = computed(() => {
  let filtered = [...favorites.value]
  
  // 按类型筛选
  if (currentFilter.value !== 'all') {
    filtered = filtered.filter(item => 
      item.tags && item.tags.includes(currentFilter.value)
    )
  }
  
  // 排序
  const sortOption = sortOptions.value[sortIndex.value]
  switch (sortOption.value) {
    case 'favoriteTime':
      filtered.sort((a, b) => b.favoriteTime - a.favoriteTime)
      break
    case 'budget_asc':
      filtered.sort((a, b) => a.budget - b.budget)
      break
    case 'budget_desc':
      filtered.sort((a, b) => b.budget - a.budget)
      break
    case 'popularity':
      filtered.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0))
      break
  }
  
  return filtered
})

onMounted(() => {
  loadFavorites()
})

onShow(() => {
  // 页面显示时刷新收藏状态
  loadFavorites()
})

async function loadFavorites() {
  try {
    loading.value = true
    const favoritesData = await api.getFavorites()
    favorites.value = favoritesData
  } catch (error) {
    console.error('加载收藏列表失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function switchFilter(filter) {
  currentFilter.value = filter
}

function onSortChange(e) {
  sortIndex.value = e.detail.value
}

function viewDetail(item) {
  if (batchMode.value) {
    toggleSelect(item)
  } else {
    navigation.toSolutionDetail(item.id, 'favorites')
  }
}

async function toggleFavorite(item) {
  try {
    const result = await store.toggleFavorite(item.id, 'solution')
    
    if (result.success) {
      if (result.action === 'removed') {
        // 从列表中移除
        const index = favorites.value.findIndex(fav => fav.id === item.id)
        if (index > -1) {
          favorites.value.splice(index, 1)
        }
        
        uni.showToast({
          title: '已取消收藏',
          icon: 'success'
        })
      }
    } else {
      uni.showToast({
        title: result.error || '操作失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('切换收藏状态失败', error)
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

function shareItem(item) {
  uni.showActionSheet({
    itemList: ['分享给朋友', '分享到朋友圈', '复制链接'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          shareToFriend(item)
          break
        case 1:
          shareToMoments(item)
          break
        case 2:
          copyLink(item)
          break
      }
    }
  })
}

function shareToFriend(item) {
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  })
}

function shareToMoments(item) {
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  })
}

function copyLink(item) {
  const link = `https://example.com/solution/${item.id}`
  uni.setClipboardData({
    data: link,
    success: () => {
      uni.showToast({
        title: '链接已复制',
        icon: 'success'
      })
    }
  })
}

function toggleSelect(item) {
  const index = selectedItems.value.findIndex(selected => selected.id === item.id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(item)
  }
}

function cancelBatch() {
  batchMode.value = false
  selectedItems.value = []
}

async function batchDelete() {
  if (selectedItems.value.length === 0) return
  
  uni.showModal({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedItems.value.length} 个收藏吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          // 批量取消收藏
          for (const item of selectedItems.value) {
            await store.toggleFavorite(item.id, 'solution')
          }
          
          // 从列表中移除
          selectedItems.value.forEach(selectedItem => {
            const index = favorites.value.findIndex(fav => fav.id === selectedItem.id)
            if (index > -1) {
              favorites.value.splice(index, 1)
            }
          })
          
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
          
          cancelBatch()
        } catch (error) {
          console.error('批量删除失败', error)
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

function goExplore() {
  navigation.toSolutionList()
}

function formatTime(time) {
  return getRelativeTime(time)
}
</script>

<style lang="scss" scoped>
.favorites-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 100px;
}

.filter-section {
  background: white;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  
  .filter-tabs {
    display: flex;
    margin-bottom: 15px;
    
    .filter-tab {
      flex: 1;
      text-align: center;
      padding: 8px 12px;
      background: #f8f9fa;
      color: #666;
      border-radius: 20px;
      margin-right: 10px;
      font-size: 14px;
      transition: all 0.3s;
      
      &:last-child {
        margin-right: 0;
      }
      
      &.active {
        background: #FF6B35;
        color: white;
      }
    }
  }
  
  .sort-section {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    
    .sort-label {
      font-size: 14px;
      color: #666;
      margin-right: 10px;
    }
    
    .sort-picker {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #333;
      
      .sort-arrow {
        margin-left: 5px;
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.favorites-list {
  padding: 15px;
  
  .favorite-item {
    background: white;
    border-radius: 12px;
    margin-bottom: 15px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    
    .item-image {
      width: 120px;
      height: 120px;
      position: relative;
      flex-shrink: 0;
      
      image {
        width: 100%;
        height: 100%;
      }
      
      .item-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        background: #FF6B35;
        color: white;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 8px;
      }
    }
    
    .item-content {
      flex: 1;
      padding: 15px;
      display: flex;
      flex-direction: column;
      
      .item-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 8px;
        line-height: 1.4;
      }
      
      .item-desc {
        font-size: 12px;
        color: #666;
        margin-bottom: 10px;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      
      .item-tags {
        margin-bottom: 10px;
        
        .tag {
          display: inline-block;
          background: #f0f0f0;
          color: #666;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 8px;
          margin-right: 5px;
        }
      }
      
      .item-footer {
        margin-top: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .item-price {
          .price-label {
            font-size: 12px;
            color: #666;
          }
          
          .price-value {
            font-size: 14px;
            font-weight: bold;
            color: #FF6B35;
          }
        }
        
        .item-time {
          font-size: 12px;
          color: #999;
        }
      }
    }
    
    .item-actions {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 15px 10px;
      
      .action-btn {
        width: 36px;
        height: 36px;
        background: #f8f9fa;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .action-icon {
          font-size: 16px;
          color: #666;
        }
        
        &:first-child .action-icon {
          color: #FF6B35;
        }
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 80px 30px;
  
  .empty-image {
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
    opacity: 0.6;
  }
  
  .empty-text {
    display: block;
    font-size: 16px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .empty-desc {
    display: block;
    font-size: 14px;
    color: #999;
    margin-bottom: 30px;
  }
  
  .empty-btn {
    background: #FF6B35;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 12px 30px;
    font-size: 14px;
  }
}

.loading-state {
  padding: 40px 0;
  text-align: center;
}

.batch-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 15px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .batch-info {
    font-size: 14px;
    color: #666;
  }
  
  .batch-buttons {
    display: flex;
    
    .batch-btn {
      border: none;
      border-radius: 20px;
      padding: 8px 20px;
      font-size: 14px;
      margin-left: 10px;
      
      &.cancel {
        background: #f0f0f0;
        color: #666;
      }
      
      &.delete {
        background: #ff4757;
        color: white;
      }
    }
  }
}
</style> 