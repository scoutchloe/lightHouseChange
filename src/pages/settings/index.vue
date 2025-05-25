<template>
  <view class="settings-container">
    <!-- 用户信息区域 -->
    <view class="user-section" v-if="userInfo.isLogin">
      <view class="user-avatar">
        <image :src="userInfo.avatar" mode="aspectFill" />
        <view class="avatar-edit" @click="changeAvatar">
          <text class="edit-icon">📷</text>
        </view>
      </view>
      <view class="user-info">
        <view class="user-name">{{ userInfo.nickname }}</view>
        <view class="user-desc">{{ userInfo.desc }}</view>
      </view>
      <view class="edit-profile" @click="editProfile">
        <text class="edit-text">编辑</text>
      </view>
    </view>
    
    <!-- 设置列表 -->
    <view class="settings-list">
      <!-- 账户设置 -->
      <view class="settings-group">
        <view class="group-title">账户设置</view>
        
        <view class="setting-item" @click="goToHistory">
          <view class="item-left">
            <text class="item-icon">📖</text>
            <text class="item-title">浏览历史</text>
          </view>
          <view class="item-right">
            <text class="item-value">{{ historyCount }}条记录</text>
            <text class="item-arrow">></text>
          </view>
        </view>
        
        <view class="setting-item" @click="goToFavorites">
          <view class="item-left">
            <text class="item-icon">❤️</text>
            <text class="item-title">我的收藏</text>
          </view>
          <view class="item-right">
            <text class="item-value">{{ favoriteCount }}个方案</text>
            <text class="item-arrow">></text>
          </view>
        </view>
        
        <view class="setting-item" @click="manageAddress">
          <view class="item-left">
            <text class="item-icon">📍</text>
            <text class="item-title">收货地址</text>
          </view>
          <view class="item-right">
            <text class="item-arrow">></text>
          </view>
        </view>
      </view>
      
      <!-- 应用设置 -->
      <view class="settings-group">
        <view class="group-title">应用设置</view>
        
        <view class="setting-item">
          <view class="item-left">
            <text class="item-icon">🔔</text>
            <text class="item-title">消息通知</text>
          </view>
          <view class="item-right">
            <switch 
              :checked="settings.notification" 
              @change="toggleNotification"
              color="#FF6B35"
            />
          </view>
        </view>
        
        <view class="setting-item">
          <view class="item-left">
            <text class="item-icon">📱</text>
            <text class="item-title">自动更新</text>
          </view>
          <view class="item-right">
            <switch 
              :checked="settings.autoUpdate" 
              @change="toggleAutoUpdate"
              color="#FF6B35"
            />
          </view>
        </view>
        
        <view class="setting-item" @click="selectLanguage">
          <view class="item-left">
            <text class="item-icon">🌐</text>
            <text class="item-title">语言设置</text>
          </view>
          <view class="item-right">
            <text class="item-value">{{ currentLanguage }}</text>
            <text class="item-arrow">></text>
          </view>
        </view>
        
        <view class="setting-item" @click="clearCache">
          <view class="item-left">
            <text class="item-icon">🗑️</text>
            <text class="item-title">清理缓存</text>
          </view>
          <view class="item-right">
            <text class="item-value">{{ cacheSize }}</text>
            <text class="item-arrow">></text>
          </view>
        </view>
      </view>
      
      <!-- 隐私安全 -->
      <view class="settings-group">
        <view class="group-title">隐私安全</view>
        
        <view class="setting-item">
          <view class="item-left">
            <text class="item-icon">🔒</text>
            <text class="item-title">隐私保护</text>
          </view>
          <view class="item-right">
            <switch 
              :checked="settings.privacy" 
              @change="togglePrivacy"
              color="#FF6B35"
            />
          </view>
        </view>
        
        <view class="setting-item" @click="changePassword">
          <view class="item-left">
            <text class="item-icon">🔑</text>
            <text class="item-title">修改密码</text>
          </view>
          <view class="item-right">
            <text class="item-arrow">></text>
          </view>
        </view>
        
        <view class="setting-item" @click="viewPrivacyPolicy">
          <view class="item-left">
            <text class="item-icon">📄</text>
            <text class="item-title">隐私政策</text>
          </view>
          <view class="item-right">
            <text class="item-arrow">></text>
          </view>
        </view>
      </view>
      
      <!-- 帮助反馈 -->
      <view class="settings-group">
        <view class="group-title">帮助反馈</view>
        
        <view class="setting-item" @click="contactService">
          <view class="item-left">
            <text class="item-icon">💬</text>
            <text class="item-title">联系客服</text>
          </view>
          <view class="item-right">
            <text class="item-arrow">></text>
          </view>
        </view>
        
        <view class="setting-item" @click="feedback">
          <view class="item-left">
            <text class="item-icon">📝</text>
            <text class="item-title">意见反馈</text>
          </view>
          <view class="item-right">
            <text class="item-arrow">></text>
          </view>
        </view>
        
        <view class="setting-item" @click="checkUpdate">
          <view class="item-left">
            <text class="item-icon">⬆️</text>
            <text class="item-title">检查更新</text>
          </view>
          <view class="item-right">
            <text class="item-value">v{{ appVersion }}</text>
            <text class="item-arrow">></text>
          </view>
        </view>
        
        <view class="setting-item" @click="aboutApp">
          <view class="item-left">
            <text class="item-icon">ℹ️</text>
            <text class="item-title">关于入舍</text>
          </view>
          <view class="item-right">
            <text class="item-arrow">></text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 退出登录 -->
    <view class="logout-section" v-if="userInfo.isLogin">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import store from '@/store/index.js'
import navigation from '@/utils/navigation.js'
import { storage } from '@/utils/common.js'

// 响应式数据
const userInfo = computed(() => store.getState('userInfo'))
const userStats = computed(() => store.getState('userStats'))

const settings = ref({
  notification: true,
  autoUpdate: false,
  privacy: true
})

const historyCount = ref(0)
const favoriteCount = computed(() => userStats.value.favoriteCount)
const currentLanguage = ref('简体中文')
const cacheSize = ref('12.5MB')
const appVersion = ref('1.0.0')

// 生命周期
onMounted(() => {
  loadSettings()
  loadHistoryCount()
})

// 方法
const loadSettings = () => {
  const savedSettings = storage.get('app_settings', {})
  settings.value = {
    ...settings.value,
    ...savedSettings
  }
}

const saveSettings = () => {
  storage.set('app_settings', settings.value)
}

const loadHistoryCount = async () => {
  try {
    const history = await api.getBrowseHistory()
    historyCount.value = history.length
  } catch (error) {
    console.error('加载历史记录数量失败', error)
  }
}

const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 这里应该上传头像到服务器
      uni.showToast({
        title: '头像上传功能开发中',
        icon: 'none'
      })
    }
  })
}

const editProfile = () => {
  uni.showToast({
    title: '个人资料编辑功能开发中',
    icon: 'none'
  })
}

const goToHistory = () => {
  uni.navigateTo({
    url: '/pages/history/index'
  })
}

const goToFavorites = () => {
  uni.navigateTo({
    url: '/pages/favorites/index'
  })
}

const manageAddress = () => {
  uni.showToast({
    title: '地址管理功能开发中',
    icon: 'none'
  })
}

const toggleNotification = (e) => {
  settings.value.notification = e.detail.value
  saveSettings()
  
  uni.showToast({
    title: settings.value.notification ? '已开启通知' : '已关闭通知',
    icon: 'success'
  })
}

const toggleAutoUpdate = (e) => {
  settings.value.autoUpdate = e.detail.value
  saveSettings()
  
  uni.showToast({
    title: settings.value.autoUpdate ? '已开启自动更新' : '已关闭自动更新',
    icon: 'success'
  })
}

const togglePrivacy = (e) => {
  settings.value.privacy = e.detail.value
  saveSettings()
  
  uni.showToast({
    title: settings.value.privacy ? '已开启隐私保护' : '已关闭隐私保护',
    icon: 'success'
  })
}

const selectLanguage = () => {
  uni.showActionSheet({
    itemList: ['简体中文', 'English', '繁體中文'],
    success: (res) => {
      const languages = ['简体中文', 'English', '繁體中文']
      currentLanguage.value = languages[res.tapIndex]
      
      uni.showToast({
        title: `已切换到${currentLanguage.value}`,
        icon: 'success'
      })
    }
  })
}

const clearCache = () => {
  uni.showModal({
    title: '清理缓存',
    content: '确定要清理应用缓存吗？这将删除临时文件和图片缓存。',
    success: (res) => {
      if (res.confirm) {
        // 模拟清理缓存
        setTimeout(() => {
          cacheSize.value = '0MB'
          uni.showToast({
            title: '缓存清理完成',
            icon: 'success'
          })
        }, 1000)
        
        uni.showLoading({ title: '清理中...' })
        setTimeout(() => {
          uni.hideLoading()
        }, 1000)
      }
    }
  })
}

const changePassword = () => {
  uni.showToast({
    title: '密码修改功能开发中',
    icon: 'none'
  })
}

const viewPrivacyPolicy = () => {
  uni.showToast({
    title: '隐私政策页面开发中',
    icon: 'none'
  })
}

const contactService = () => {
  uni.showModal({
    title: '联系客服',
    content: '客服电话：400-123-4567\n工作时间：9:00-18:00',
    showCancel: false,
    confirmText: '知道了'
  })
}

const feedback = () => {
  uni.showToast({
    title: '意见反馈功能开发中',
    icon: 'none'
  })
}

const checkUpdate = () => {
  uni.showLoading({ title: '检查中...' })
  
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '已是最新版本',
      icon: 'success'
    })
  }, 2000)
}

const aboutApp = () => {
  uni.showModal({
    title: '关于入舍',
    content: '入舍 v1.0.0\n让家更美好的轻改造助手\n\n© 2024 入舍团队',
    showCancel: false,
    confirmText: '知道了'
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await store.logout()
          uni.showToast({
            title: '已退出登录',
            icon: 'success'
          })
          
          setTimeout(() => {
            navigation.toHome()
          }, 1500)
        } catch (error) {
          console.error('退出登录失败', error)
          uni.showToast({
            title: '退出失败',
            icon: 'none'
          })
        }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.settings-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 30px;
}

.user-section {
  background: white;
  padding: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  
  .user-avatar {
    position: relative;
    width: 60px;
    height: 60px;
    margin-right: 15px;
    
    image {
      width: 100%;
      height: 100%;
      border-radius: 30px;
    }
    
    .avatar-edit {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 20px;
      height: 20px;
      background: #FF6B35;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      
      .edit-icon {
        font-size: 10px;
        color: white;
      }
    }
  }
  
  .user-info {
    flex: 1;
    
    .user-name {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    
    .user-desc {
      font-size: 14px;
      color: #666;
    }
  }
  
  .edit-profile {
    padding: 8px 15px;
    background: #f0f0f0;
    border-radius: 15px;
    
    .edit-text {
      font-size: 14px;
      color: #666;
    }
  }
}

.settings-list {
  .settings-group {
    margin-bottom: 10px;
    
    .group-title {
      font-size: 14px;
      color: #666;
      padding: 15px 20px 10px;
      background: #f8f9fa;
    }
    
    .setting-item {
      background: white;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .item-left {
        display: flex;
        align-items: center;
        
        .item-icon {
          font-size: 18px;
          margin-right: 12px;
        }
        
        .item-title {
          font-size: 16px;
          color: #333;
        }
      }
      
      .item-right {
        display: flex;
        align-items: center;
        
        .item-value {
          font-size: 14px;
          color: #666;
          margin-right: 8px;
        }
        
        .item-arrow {
          font-size: 14px;
          color: #ccc;
        }
      }
    }
  }
}

.logout-section {
  padding: 20px;
  
  .logout-btn {
    width: 100%;
    height: 50px;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style> 