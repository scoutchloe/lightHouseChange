<template>
  <view class="history-container">
    <!-- 顶部操作栏 -->
    <view class="header-actions">
      <view class="search-box">
        <input 
          class="search-input"
          type="text"
          placeholder="搜索浏览记录"
          v-model="searchKeyword"
          @input="onSearchInput"
        />
        <text class="search-icon">🔍</text>
      </view>
      
      <view class="action-buttons">
        <button class="action-btn" @click="toggleSelectMode">
          {{ isSelectMode ? '取消' : '管理' }}
        </button>
        <button class="action-btn danger" @click="clearAllHistory" v-if="!isSelectMode">
          清空
        </button>
      </view>
    </view>
    
    <!-- 历史记录列表 -->
    <view class="history-list" v-if="filteredHistory.length > 0">
      <view class="date-group" v-for="group in groupedHistory" :key="group.date">
        <view class="date-header">{{ group.date }}</view>
        
        <view 
          v-for="item in group.items" 
          :key="item.id"
          class="history-item"
          :class="{ selected: selectedItems.includes(item.id) }"
          @click="handleItemClick(item)"
        >
          <checkbox 
            v-if="isSelectMode"
            class="item-checkbox"
            :checked="selectedItems.includes(item.id)"
            @click.stop="toggleSelect(item.id)"
          />
          
          <view class="item-image">
            <image :src="item.image" mode="aspectFill" />
          </view>
          
          <view class="item-content">
            <view class="item-title">{{ item.title }}</view>
            <view class="item-desc">{{ item.description }}</view>
            
            <view class="item-meta">
              <text class="item-price">¥{{ item.price }}</text>
              <text class="item-time">{{ formatTime(item.viewTime) }}</text>
            </view>
          </view>
          
          <view class="item-actions" v-if="!isSelectMode">
            <view class="action-btn-small" @click.stop="toggleFavorite(item)">
              <text class="action-icon" :class="{ favorited: item.isFavorited }">♥</text>
            </view>
            <view class="action-btn-small" @click.stop="removeFromHistory(item)">
              <text class="action-icon">×</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else-if="!loading">
      <image class="empty-image" src="/static/images/empty-history.png" mode="aspectFit" />
      <text class="empty-text">暂无浏览记录</text>
      <text class="empty-desc">去发现更多精彩内容吧</text>
      <button class="empty-btn" @click="goExplore">去逛逛</button>
    </view>
    
    <!-- 加载状态 -->
    <view class="loading-state" v-if="loading">
      <uni-load-more status="loading" />
    </view>
    
    <!-- 批量操作栏 -->
    <view class="batch-actions" v-if="isSelectMode && selectedItems.length > 0">
      <view class="batch-info">
        已选择 {{ selectedItems.length }} 项
      </view>
      <view class="batch-buttons">
        <button class="batch-btn" @click="batchAddToFavorites">收藏</button>
        <button class="batch-btn danger" @click="batchDelete">删除</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import store from '@/store/index.js'
import navigation from '@/utils/navigation.js'
import { getRelativeTime, debounce } from '@/utils/common.js'
import { api } from '@/api/index.js'

// 响应式数据
const history = ref([])
const loading = ref(true)
const searchKeyword = ref('')
const isSelectMode = ref(false)
const selectedItems = ref([])

// 计算属性
const filteredHistory = computed(() => {
  if (!searchKeyword.value) return history.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return history.value.filter(item => 
    item.title.toLowerCase().includes(keyword) ||
    item.description.toLowerCase().includes(keyword)
  )
})

const groupedHistory = computed(() => {
  const groups = {}
  
  filteredHistory.value.forEach(item => {
    const date = formatDate(item.viewTime)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
  })
  
  return Object.keys(groups).map(date => ({
    date,
    items: groups[date]
  })).sort((a, b) => new Date(b.date) - new Date(a.date))
})

// 生命周期
onMounted(() => {
  loadHistory()
})

onShow(() => {
  loadHistory()
})

// 方法
const loadHistory = async () => {
  try {
    loading.value = true
    const historyData = await api.getBrowseHistory()
    
    // 检查收藏状态
    for (const item of historyData) {
      item.isFavorited = await store.checkFavoriteStatus(item.id, 'solution')
    }
    
    history.value = historyData
  } catch (error) {
    console.error('加载浏览历史失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const onSearchInput = debounce(() => {
  // 搜索逻辑已在计算属性中处理
}, 300)

const toggleSelectMode = () => {
  isSelectMode.value = !isSelectMode.value
  if (!isSelectMode.value) {
    selectedItems.value = []
  }
}

const handleItemClick = (item) => {
  if (isSelectMode.value) {
    toggleSelect(item.id)
  } else {
    navigation.toSolutionDetail(item.id, 'history')
  }
}

const toggleSelect = (itemId) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
}

const toggleFavorite = async (item) => {
  try {
    const result = await store.toggleFavorite(item.id, 'solution')
    
    if (result.success) {
      item.isFavorited = result.action === 'added'
      uni.showToast({
        title: result.action === 'added' ? '已收藏' : '已取消收藏',
        icon: 'success'
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

const removeFromHistory = (item) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要从浏览记录中删除这个项目吗？',
    success: (res) => {
      if (res.confirm) {
        const index = history.value.findIndex(h => h.id === item.id)
        if (index > -1) {
          history.value.splice(index, 1)
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    }
  })
}

const clearAllHistory = () => {
  uni.showModal({
    title: '确认清空',
    content: '确定要清空所有浏览记录吗？此操作不可恢复。',
    success: async (res) => {
      if (res.confirm) {
        try {
          await api.clearBrowseHistory()
          history.value = []
          uni.showToast({
            title: '清空成功',
            icon: 'success'
          })
        } catch (error) {
          console.error('清空历史失败', error)
          uni.showToast({
            title: '清空失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

const batchAddToFavorites = async () => {
  try {
    for (const itemId of selectedItems.value) {
      const item = history.value.find(h => h.id === itemId)
      if (item && !item.isFavorited) {
        await store.toggleFavorite(itemId, 'solution')
        item.isFavorited = true
      }
    }
    
    uni.showToast({
      title: '批量收藏成功',
      icon: 'success'
    })
    
    selectedItems.value = []
    isSelectMode.value = false
  } catch (error) {
    console.error('批量收藏失败', error)
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

const batchDelete = () => {
  if (selectedItems.value.length === 0) return
  
  uni.showModal({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedItems.value.length} 个记录吗？`,
    success: (res) => {
      if (res.confirm) {
        selectedItems.value.forEach(itemId => {
          const index = history.value.findIndex(h => h.id === itemId)
          if (index > -1) {
            history.value.splice(index, 1)
          }
        })
        
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
        
        selectedItems.value = []
        isSelectMode.value = false
      }
    }
  })
}

const goExplore = () => {
  navigation.toSolutionList()
}

const formatTime = (time) => {
  return getRelativeTime(time)
}

const formatDate = (time) => {
  const date = new Date(time)
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  
  if (date.toDateString() === today.toDateString()) {
    return '今天'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  } else {
    return date.toLocaleDateString('zh-CN', { 
      month: 'long', 
      day: 'numeric' 
    })
  }
}
</script>

<style lang="scss" scoped>
.history-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 100px;
}

.header-actions {
  background: white;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  
  .search-box {
    position: relative;
    margin-bottom: 15px;
    
    .search-input {
      width: 100%;
      height: 40px;
      background: #f8f9fa;
      border: none;
      border-radius: 20px;
      padding: 0 45px 0 15px;
      font-size: 14px;
      
      &::placeholder {
        color: #999;
      }
    }
    
    .search-icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      color: #999;
    }
  }
  
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    
    .action-btn {
      background: #f0f0f0;
      color: #666;
      border: none;
      border-radius: 15px;
      padding: 6px 15px;
      font-size: 12px;
      
      &.danger {
        background: #ff4757;
        color: white;
      }
    }
  }
}

.history-list {
  padding: 15px;
  
  .date-group {
    margin-bottom: 20px;
    
    .date-header {
      font-size: 14px;
      font-weight: bold;
      color: #666;
      margin-bottom: 10px;
      padding-left: 5px;
    }
    
    .history-item {
      background: white;
      border-radius: 12px;
      margin-bottom: 10px;
      padding: 15px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      
      &.selected {
        background: #f0f8ff;
        border: 2px solid #FF6B35;
      }
      
      .item-checkbox {
        margin-right: 15px;
      }
      
      .item-image {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        margin-right: 15px;
        flex-shrink: 0;
        
        image {
          width: 100%;
          height: 100%;
        }
      }
      
      .item-content {
        flex: 1;
        
        .item-title {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
          line-height: 1.4;
        }
        
        .item-desc {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .item-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .item-price {
            font-size: 12px;
            font-weight: bold;
            color: #FF6B35;
          }
          
          .item-time {
            font-size: 11px;
            color: #999;
          }
        }
      }
      
      .item-actions {
        display: flex;
        flex-direction: column;
        gap: 5px;
        
        .action-btn-small {
          width: 28px;
          height: 28px;
          background: #f8f9fa;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .action-icon {
            font-size: 14px;
            color: #666;
            
            &.favorited {
              color: #FF6B35;
            }
          }
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
    gap: 10px;
    
    .batch-btn {
      border: none;
      border-radius: 15px;
      padding: 8px 20px;
      font-size: 14px;
      background: #FF6B35;
      color: white;
      
      &.danger {
        background: #ff4757;
      }
    }
  }
}
</style> 