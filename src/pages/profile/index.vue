<template>
  <view class="page-container">
    <!-- 用户信息区域 -->
    <view class="user-section">
      <view class="user-info">
        <image :src="userInfo.avatar" mode="aspectFill" class="user-avatar" @click="changeAvatar" />
        <view class="user-details">
          <text class="user-name">{{ userInfo.nickname || '点击登录' }}</text>
          <text class="user-desc">{{ userInfo.desc || '让家更美好' }}</text>
        </view>
        <view class="user-actions">
          <button v-if="!userInfo.isLogin" class="login-btn" @click="login">登录</button>
          <text v-else class="iconfont icon-arrow-right"></text>
        </view>
      </view>
      
      <!-- 用户统计 -->
      <view v-if="userInfo.isLogin" class="user-stats">
        <view class="stat-item" @click="goToOrders">
          <text class="stat-number">{{ userStats.orderCount }}</text>
          <text class="stat-label">订单</text>
        </view>
        <view class="stat-item" @click="goToFavorites">
          <text class="stat-number">{{ userStats.favoriteCount }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item" @click="goToDesigns">
          <text class="stat-number">{{ userStats.designCount }}</text>
          <text class="stat-label">设计</text>
        </view>
        <view class="stat-item" @click="goToCoupons">
          <text class="stat-number">{{ userStats.couponCount }}</text>
          <text class="stat-label">优惠券</text>
        </view>
      </view>
    </view>

    <!-- 订单管理 -->
    <view v-if="userInfo.isLogin" class="section">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <text class="section-more" @click="goToOrders">查看全部</text>
      </view>
      <view class="order-types">
        <view class="order-type" @click="goToOrders('pending')">
          <text class="iconfont icon-clock"></text>
          <text class="type-label">待付款</text>
          <text v-if="orderCounts.pending > 0" class="type-badge">{{ orderCounts.pending }}</text>
        </view>
        <view class="order-type" @click="goToOrders('processing')">
          <text class="iconfont icon-truck"></text>
          <text class="type-label">进行中</text>
          <text v-if="orderCounts.processing > 0" class="type-badge">{{ orderCounts.processing }}</text>
        </view>
        <view class="order-type" @click="goToOrders('completed')">
          <text class="iconfont icon-check"></text>
          <text class="type-label">已完成</text>
        </view>
        <view class="order-type" @click="goToOrders('refund')">
          <text class="iconfont icon-refresh"></text>
          <text class="type-label">退款/售后</text>
          <text v-if="orderCounts.refund > 0" class="type-badge">{{ orderCounts.refund }}</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="section">
      <view class="menu-list">
        <view class="menu-item" @click="goToFavorites">
          <view class="menu-icon">
            <text class="iconfont icon-heart"></text>
          </view>
          <text class="menu-label">我的收藏</text>
          <text class="iconfont icon-arrow-right menu-arrow"></text>
        </view>
        
        <view class="menu-item" @click="goToDesigns">
          <view class="menu-icon">
            <text class="iconfont icon-design"></text>
          </view>
          <text class="menu-label">我的设计</text>
          <text class="iconfont icon-arrow-right menu-arrow"></text>
        </view>
        
        <view class="menu-item" @click="goToHistory">
          <view class="menu-icon">
            <text class="iconfont icon-history"></text>
          </view>
          <text class="menu-label">浏览历史</text>
          <text class="iconfont icon-arrow-right menu-arrow"></text>
        </view>
        
        <view class="menu-item" @click="goToAddress">
          <view class="menu-icon">
            <text class="iconfont icon-location"></text>
          </view>
          <text class="menu-label">收货地址</text>
          <text class="iconfont icon-arrow-right menu-arrow"></text>
        </view>
      </view>
    </view>

    <!-- 服务菜单 -->
    <view class="section">
      <view class="menu-list">
        <view class="menu-item" @click="goToCustomerService">
          <view class="menu-icon">
            <text class="iconfont icon-service"></text>
          </view>
          <text class="menu-label">客服中心</text>
          <text class="iconfont icon-arrow-right menu-arrow"></text>
        </view>
        
        <view class="menu-item" @click="goToFeedback">
          <view class="menu-icon">
            <text class="iconfont icon-feedback"></text>
          </view>
          <text class="menu-label">意见反馈</text>
          <text class="iconfont icon-arrow-right menu-arrow"></text>
        </view>
        
        <view class="menu-item" @click="goToAbout">
          <view class="menu-icon">
            <text class="iconfont icon-info"></text>
          </view>
          <text class="menu-label">关于我们</text>
          <text class="iconfont icon-arrow-right menu-arrow"></text>
        </view>
        
        <view class="menu-item" @click="goToSettings">
          <view class="menu-icon">
            <text class="iconfont icon-settings"></text>
          </view>
          <text class="menu-label">设置</text>
          <text class="iconfont icon-arrow-right menu-arrow"></text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="userInfo.isLogin" class="section">
      <button class="logout-btn" @click="logout">退出登录</button>
    </view>

    <!-- 登录弹窗 -->
    <view v-if="showLoginModal" class="login-modal" @click="closeLoginModal">
      <view class="login-content" @click.stop>
        <view class="login-header">
          <text class="login-title">登录</text>
          <button class="close-btn" @click="closeLoginModal">×</button>
        </view>
        
        <view class="login-form">
          <view class="form-item">
            <input 
              type="text" 
              v-model="loginForm.phone" 
              placeholder="请输入手机号"
              class="form-input"
            />
          </view>
          <view class="form-item">
            <input 
              type="text" 
              v-model="loginForm.code" 
              placeholder="请输入验证码"
              class="form-input code-input"
            />
            <button 
              class="code-btn" 
              @click="sendCode"
              :disabled="codeCountdown > 0"
            >
              {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
            </button>
          </view>
        </view>
        
        <button class="login-submit-btn" @click="submitLogin">登录</button>
        
        <view class="login-agreement">
          <text>登录即表示同意</text>
          <text class="agreement-link" @click="showAgreement">《用户协议》</text>
          <text>和</text>
          <text class="agreement-link" @click="showPrivacy">《隐私政策》</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { api } from '@/api/index.js'

// 响应式数据
const userInfo = reactive({
  isLogin: false,
  avatar: '/static/images/default-avatar.png',
  nickname: '',
  desc: ''
})

const userStats = reactive({
  orderCount: 0,
  favoriteCount: 0,
  designCount: 0,
  couponCount: 0
})

const orderCounts = reactive({
  pending: 0,
  processing: 0,
  completed: 0,
  refund: 0
})

const showLoginModal = ref(false)
const loginForm = reactive({
  phone: '',
  code: ''
})

const codeCountdown = ref(0)
let codeTimer = null

// 生命周期
onMounted(() => {
  loadData()
})

onLoad(() => {
  loadData()
})

onShow(() => {
  // 页面显示时刷新用户信息
  loadUserInfo()
  loadUserStats()
})

onUnmounted(() => {
  // 清理定时器
  if (codeTimer) {
    clearInterval(codeTimer)
  }
})

// 方法
const loadData = () => {
  loadUserInfo()
  loadUserStats()
  loadOrderCounts()
}

const loadUserInfo = () => {
  try {
    const savedUserInfo = uni.getStorageSync('user_info')
    if (savedUserInfo) {
      Object.assign(userInfo, savedUserInfo)
    }
  } catch (error) {
    console.error('加载用户信息失败', error)
  }
}

const loadUserStats = async () => {
  if (!userInfo.isLogin) return
  
  try {
    const stats = await api.getUserStats()
    Object.assign(userStats, stats)
  } catch (error) {
    console.error('加载用户统计失败', error)
  }
}

const loadOrderCounts = async () => {
  if (!userInfo.isLogin) return
  
  try {
    const counts = await api.getOrderCounts()
    Object.assign(orderCounts, counts)
  } catch (error) {
    console.error('加载订单统计失败', error)
  }
}

const changeAvatar = () => {
  if (!userInfo.isLogin) {
    login()
    return
  }
  
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 这里应该上传到服务器，暂时只更新本地
      userInfo.avatar = res.tempFilePaths[0]
      saveUserInfo()
      uni.showToast({
        title: '头像更新成功',
        icon: 'success'
      })
    }
  })
}

const login = () => {
  showLoginModal.value = true
}

const closeLoginModal = () => {
  showLoginModal.value = false
  loginForm.phone = ''
  loginForm.code = ''
  if (codeTimer) {
    clearInterval(codeTimer)
    codeCountdown.value = 0
  }
}

const sendCode = () => {
  if (!loginForm.phone) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    })
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(loginForm.phone)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    })
    return
  }
  
  // 模拟发送验证码
  codeCountdown.value = 60
  codeTimer = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) {
      clearInterval(codeTimer)
    }
  }, 1000)
  
  uni.showToast({
    title: '验证码已发送',
    icon: 'success'
  })
}

const submitLogin = async () => {
  if (!loginForm.phone || !loginForm.code) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }
  
  try {
    // 模拟登录
    const loginResult = await api.login(loginForm)
    
    Object.assign(userInfo, {
      ...loginResult,
      isLogin: true
    })
    
    saveUserInfo()
    closeLoginModal()
    loadUserStats()
    loadOrderCounts()
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
  } catch (error) {
    console.error('登录失败', error)
    uni.showToast({
      title: '登录失败',
      icon: 'none'
    })
  }
}

const logout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        Object.assign(userInfo, {
          isLogin: false,
          avatar: '/static/images/default-avatar.png',
          nickname: '',
          desc: ''
        })
        
        Object.assign(userStats, {
          orderCount: 0,
          favoriteCount: 0,
          designCount: 0,
          couponCount: 0
        })
        
        Object.assign(orderCounts, {
          pending: 0,
          processing: 0,
          completed: 0,
          refund: 0
        })
        
        try {
          uni.removeStorageSync('user_info')
        } catch (error) {
          console.error('清除用户信息失败', error)
        }
        
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}

const saveUserInfo = () => {
  try {
    uni.setStorageSync('user_info', userInfo)
  } catch (error) {
    console.error('保存用户信息失败', error)
  }
}

const goToOrders = (status = '') => {
  if (!userInfo.isLogin) {
    login()
    return
  }
  uni.navigateTo({
    url: `/pages/orders/index${status ? '?status=' + status : ''}`
  })
}

const goToFavorites = () => {
  if (!userInfo.isLogin) {
    login()
    return
  }
  uni.navigateTo({
    url: '/pages/favorites/index'
  })
}

const goToDesigns = () => {
  if (!userInfo.isLogin) {
    login()
    return
  }
  uni.navigateTo({
    url: '/pages/my-designs/index'
  })
}

const goToCoupons = () => {
  if (!userInfo.isLogin) {
    login()
    return
  }
  uni.navigateTo({
    url: '/pages/coupons/index'
  })
}

const goToHistory = () => {
  uni.navigateTo({
    url: '/pages/history/index'
  })
}

const goToAddress = () => {
  if (!userInfo.isLogin) {
    login()
    return
  }
  uni.navigateTo({
    url: '/pages/address/index'
  })
}

const goToCustomerService = () => {
  uni.navigateTo({
    url: '/pages/customer-service/index'
  })
}

const goToFeedback = () => {
  uni.navigateTo({
    url: '/pages/feedback/index'
  })
}

const goToAbout = () => {
  uni.navigateTo({
    url: '/pages/about/index'
  })
}

const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/settings/index'
  })
}

const showAgreement = () => {
  uni.navigateTo({
    url: '/pages/agreement/index'
  })
}

const showPrivacy = () => {
  uni.navigateTo({
    url: '/pages/privacy/index'
  })
}
</script>

<style>
.user-section {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  padding: 20px 16px;
  color: #FFFFFF;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.user-desc {
  font-size: 14px;
  opacity: 0.8;
  display: block;
}

.user-actions {
  display: flex;
  align-items: center;
}

.login-btn {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 14px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.section {
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #FFFFFF;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
}

.section-more {
  font-size: 14px;
  color: #4F46E5;
}

.order-types {
  display: flex;
  background-color: #FFFFFF;
  padding: 16px;
}

.order-type {
  flex: 1;
  text-align: center;
  position: relative;
}

.order-type .iconfont {
  font-size: 24px;
  color: #6B7280;
  display: block;
  margin-bottom: 8px;
}

.type-label {
  font-size: 12px;
  color: #6B7280;
}

.type-badge {
  position: absolute;
  top: -4px;
  right: 20px;
  background-color: #EF4444;
  color: #FFFFFF;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.menu-list {
  background-color: #FFFFFF;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #F3F4F6;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 40px;
  height: 40px;
  background-color: #F3F4F6;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.menu-icon .iconfont {
  font-size: 18px;
  color: #4F46E5;
}

.menu-label {
  flex: 1;
  font-size: 16px;
}

.menu-arrow {
  color: #9CA3AF;
}

.logout-btn {
  width: calc(100% - 32px);
  margin: 0 16px;
  padding: 16px;
  background-color: #EF4444;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}

.login-modal {
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

.login-content {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  margin: 0 32px;
  width: calc(100% - 64px);
  max-width: 400px;
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-title {
  font-size: 18px;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #9CA3AF;
  padding: 0;
  width: 32px;
  height: 32px;
}

.login-form {
  margin-bottom: 24px;
}

.form-item {
  margin-bottom: 16px;
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 16px;
}

.code-input {
  padding-right: 100px;
}

.code-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #4F46E5;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 12px;
}

.code-btn:disabled {
  background-color: #9CA3AF;
}

.login-submit-btn {
  width: 100%;
  padding: 16px;
  background-color: #4F46E5;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 16px;
}

.login-agreement {
  text-align: center;
  font-size: 12px;
  color: #6B7280;
}

.agreement-link {
  color: #4F46E5;
}
</style> 