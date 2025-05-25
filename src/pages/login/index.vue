<template>
  <view class="login-container">
    <!-- 顶部装饰 -->
    <view class="header-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
      <view class="decoration-circle circle-3"></view>
    </view>
    
    <!-- Logo和标题 -->
    <view class="logo-section">
      <view class="logo">
        <text class="logo-text">入舍</text>
      </view>
      <view class="subtitle">让家更美好</view>
    </view>
    
    <!-- 登录表单 -->
    <view class="login-form">
      <view class="form-title">手机号登录</view>
      
      <!-- 手机号输入 -->
      <view class="input-group">
        <view class="input-wrapper">
          <text class="input-prefix">+86</text>
          <input
            class="phone-input"
            type="number"
            placeholder="请输入手机号"
            v-model="formData.phone"
            maxlength="11"
            @input="onPhoneInput"
          />
        </view>
        <view v-if="phoneError" class="error-text">{{ phoneError }}</view>
      </view>
      
      <!-- 验证码输入 -->
      <view class="input-group">
        <view class="input-wrapper code-wrapper">
          <input
            class="code-input"
            type="number"
            placeholder="请输入验证码"
            v-model="formData.code"
            maxlength="6"
          />
          <button
            class="code-btn"
            :class="{ disabled: !canSendCode || countdown > 0 }"
            :disabled="!canSendCode || countdown > 0"
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </view>
        <view v-if="codeError" class="error-text">{{ codeError }}</view>
      </view>
      
      <!-- 登录按钮 -->
      <button
        class="login-btn"
        :class="{ disabled: !canLogin }"
        :disabled="!canLogin"
        @click="handleLogin"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>
      
      <!-- 协议条款 -->
      <view class="agreement">
        <checkbox-group @change="onAgreementChange">
          <label class="agreement-item">
            <checkbox :checked="agreed" color="#FF6B35" />
            <text class="agreement-text">
              我已阅读并同意
              <text class="link" @click="showAgreement('user')">《用户协议》</text>
              和
              <text class="link" @click="showAgreement('privacy')">《隐私政策》</text>
            </text>
          </label>
        </checkbox-group>
      </view>
    </view>
    
    <!-- 其他登录方式 -->
    <view class="other-login">
      <view class="divider">
        <text class="divider-text">其他登录方式</text>
      </view>
      
      <view class="social-login">
        <view class="social-item" @click="wechatLogin">
          <image class="social-icon" src="/static/icons/wechat.png" mode="aspectFit" />
          <text class="social-text">微信登录</text>
        </view>
      </view>
    </view>
    
    <!-- 协议弹窗 -->
    <uni-popup ref="agreementPopup" type="bottom">
      <view class="agreement-popup">
        <view class="popup-header">
          <text class="popup-title">{{ agreementTitle }}</text>
          <text class="popup-close" @click="closeAgreement">×</text>
        </view>
        <scroll-view class="popup-content" scroll-y>
          <text class="agreement-content">{{ agreementContent }}</text>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import store from '@/store/index.js'
import navigation from '@/utils/navigation.js'
import { validatePhone } from '@/utils/common.js'
import { api } from '@/api/index.js'

// 响应式数据
const loginForm = reactive({
  phone: '',
  code: ''
})

const codeCountdown = ref(0)
const isLoading = ref(false)
const agreeTerms = ref(false)
let codeTimer = null

// 生命周期
onMounted(() => {
  // 检查是否已登录
  checkLoginStatus()
})

onLoad(() => {
  checkLoginStatus()
})

onUnmounted(() => {
  // 清理定时器
  if (codeTimer) {
    clearInterval(codeTimer)
  }
})

// 方法
const checkLoginStatus = () => {
  if (store.state.user.isLogin) {
    // 已登录，返回上一页或首页
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
    } else {
      uni.switchTab({
        url: '/pages/home/index'
      })
    }
  }
}

const sendCode = async () => {
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
  
  try {
    await api.sendVerificationCode(loginForm.phone)
    
    // 开始倒计时
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
  } catch (error) {
    console.error('发送验证码失败', error)
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'none'
    })
  }
}

const submitLogin = async () => {
  if (!loginForm.phone || !loginForm.code) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }
  
  if (!agreeTerms.value) {
    uni.showToast({
      title: '请同意用户协议和隐私政策',
      icon: 'none'
    })
    return
  }
  
  try {
    isLoading.value = true
    
    const result = await api.userLogin({
      phone: loginForm.phone,
      code: loginForm.code
    })
    
    // 保存用户信息到store
    await store.login(result)
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    
    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.switchTab({
          url: '/pages/home/index'
        })
      }
    }, 1500)
    
  } catch (error) {
    console.error('登录失败', error)
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

const wechatLogin = () => {
  uni.showToast({
    title: '微信登录功能开发中',
    icon: 'none'
  })
}

const showUserAgreement = () => {
  navigation.toWebView('https://example.com/user-agreement', '用户协议')
}

const showPrivacyPolicy = () => {
  navigation.toWebView('https://example.com/privacy-policy', '隐私政策')
}

const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({
      url: '/pages/home/index'
    })
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    
    &.circle-1 {
      width: 120px;
      height: 120px;
      top: -60px;
      right: -60px;
    }
    
    &.circle-2 {
      width: 80px;
      height: 80px;
      top: 50px;
      left: -40px;
    }
    
    &.circle-3 {
      width: 60px;
      height: 60px;
      top: 120px;
      right: 50px;
    }
  }
}

.logo-section {
  text-align: center;
  padding: 100px 0 60px;
  
  .logo {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    
    .logo-text {
      font-size: 28px;
      font-weight: bold;
      color: white;
    }
  }
  
  .subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
  }
}

.login-form {
  margin: 0 30px;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  .form-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .input-group {
    margin-bottom: 20px;
    
    .input-wrapper {
      display: flex;
      align-items: center;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 0 15px;
      height: 50px;
      background: #f8f9fa;
      
      &:focus-within {
        border-color: #FF6B35;
        background: white;
      }
      
      .input-prefix {
        color: #666;
        margin-right: 10px;
        font-size: 16px;
      }
      
      .phone-input,
      .code-input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 16px;
        color: #333;
        
        &::placeholder {
          color: #999;
        }
      }
      
      &.code-wrapper {
        padding-right: 0;
      }
      
      .code-btn {
        background: #FF6B35;
        color: white;
        border: none;
        border-radius: 0 12px 12px 0;
        height: 50px;
        padding: 0 15px;
        font-size: 14px;
        
        &.disabled {
          background: #ccc;
          color: #999;
        }
      }
    }
    
    .error-text {
      color: #ff4757;
      font-size: 12px;
      margin-top: 5px;
      margin-left: 15px;
    }
  }
  
  .login-btn {
    width: 100%;
    height: 50px;
    background: #FF6B35;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    
    &.disabled {
      background: #ccc;
      color: #999;
    }
  }
  
  .agreement {
    margin-top: 20px;
    
    .agreement-item {
      display: flex;
      align-items: flex-start;
      
      .agreement-text {
        font-size: 12px;
        color: #666;
        line-height: 1.5;
        margin-left: 8px;
        
        .link {
          color: #FF6B35;
        }
      }
    }
  }
}

.other-login {
  margin: 40px 30px 30px;
  
  .divider {
    text-align: center;
    margin-bottom: 20px;
    
    .divider-text {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 0 15px;
      position: relative;
      
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 60px;
        height: 1px;
        background: rgba(255, 255, 255, 0.3);
      }
      
      &::before {
        right: 100%;
        margin-right: 15px;
      }
      
      &::after {
        left: 100%;
        margin-left: 15px;
      }
    }
  }
  
  .social-login {
    display: flex;
    justify-content: center;
    
    .social-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      
      .social-icon {
        width: 30px;
        height: 30px;
        margin-bottom: 8px;
      }
      
      .social-text {
        color: white;
        font-size: 12px;
      }
    }
  }
}

.agreement-popup {
  background: white;
  border-radius: 20px 20px 0 0;
  max-height: 70vh;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    
    .popup-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
    
    .popup-close {
      font-size: 24px;
      color: #999;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .popup-content {
    padding: 20px;
    max-height: 50vh;
    
    .agreement-content {
      font-size: 14px;
      line-height: 1.6;
      color: #666;
      white-space: pre-line;
    }
  }
}
</style> 