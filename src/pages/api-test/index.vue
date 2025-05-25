<template>
  <view class="api-test-container">
    <view class="header">
      <text class="title">API接口测试</text>
      <text class="subtitle">前后端接口对接验证</text>
    </view>
    
    <!-- API配置信息 -->
    <view class="section">
      <view class="section-title">API配置信息</view>
      <view class="info-card">
        <view class="info-item">
          <text class="label">API基础地址:</text>
          <text class="value">{{ config.API_BASE_URL }}</text>
        </view>
        <view class="info-item">
          <text class="label">当前状态:</text>
          <text class="value" :class="{ 'status-success': apiStatus === 'online', 'status-error': apiStatus === 'offline' }">
            {{ apiStatus === 'online' ? '在线' : '离线' }}
          </text>
        </view>
      </view>
    </view>
    
    <!-- 已实现的后端接口测试 -->
    <view class="section">
      <view class="section-title">已实现的后端接口</view>
      
      <!-- 健康检查 -->
      <view class="test-card">
        <view class="test-header">
          <text class="test-name">健康检查</text>
          <button class="test-btn" @click="testHealthCheck" :disabled="loading">
            {{ loading ? '测试中...' : '测试' }}
          </button>
        </view>
        <view class="test-result" v-if="healthResult">
          <text class="result-label">结果:</text>
          <text class="result-content">{{ JSON.stringify(healthResult, null, 2) }}</text>
        </view>
      </view>
      
      <!-- 空间数据 -->
      <view class="test-card">
        <view class="test-header">
          <text class="test-name">获取空间数据</text>
          <button class="test-btn" @click="testGetSpaces" :disabled="loading">
            {{ loading ? '测试中...' : '测试' }}
          </button>
        </view>
        <view class="test-result" v-if="spacesResult">
          <text class="result-label">结果 ({{ spacesResult.length }} 条):</text>
          <view class="result-list">
            <view v-for="space in spacesResult" :key="space.id" class="result-item">
              <text>{{ space.id }}. {{ space.name }} ({{ space.iconColor }})</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 问题数据 -->
      <view class="test-card">
        <view class="test-header">
          <text class="test-name">获取问题数据</text>
          <view class="space-selector">
            <picker @change="onSpaceChange" :value="selectedSpaceIndex" :range="spaceOptions" range-key="name">
              <view class="picker-text">{{ selectedSpace ? selectedSpace.name : '选择空间' }}</view>
            </picker>
          </view>
          <button class="test-btn" @click="testGetProblems" :disabled="loading || !selectedSpace">
            {{ loading ? '测试中...' : '测试' }}
          </button>
        </view>
        <view class="test-result" v-if="problemsResult">
          <text class="result-label">结果 ({{ problemsResult.length }} 条):</text>
          <view class="result-list">
            <view v-for="problem in problemsResult" :key="problem.id" class="result-item">
              <text>{{ problem.id }}. {{ problem.name }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 轮播图数据 -->
      <view class="test-card">
        <view class="test-header">
          <text class="test-name">获取轮播图</text>
          <button class="test-btn" @click="testGetBanners" :disabled="loading">
            {{ loading ? '测试中...' : '测试' }}
          </button>
        </view>
        <view class="test-result" v-if="bannersResult">
          <text class="result-label">结果 ({{ bannersResult.length }} 条):</text>
          <view class="result-list">
            <view v-for="banner in bannersResult" :key="banner.id" class="result-item">
              <text>{{ banner.id }}. {{ banner.title }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 解决方案列表 -->
      <view class="test-card">
        <view class="test-header">
          <text class="test-name">获取解决方案列表</text>
          <button class="test-btn" @click="testGetSolutions" :disabled="loading">
            {{ loading ? '测试中...' : '测试' }}
          </button>
        </view>
        <view class="test-result" v-if="solutionsResult">
          <text class="result-label">结果 ({{ solutionsResult.total }} 条):</text>
          <view class="result-list">
            <view v-for="solution in solutionsResult.list" :key="solution.id" class="result-item">
              <text>{{ solution.id }}. {{ solution.title }} - ¥{{ solution.price }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- Mock接口测试 -->
    <view class="section">
      <view class="section-title">Mock接口测试</view>
      
      <!-- 推荐内容 -->
      <view class="test-card">
        <view class="test-header">
          <text class="test-name">获取推荐内容</text>
          <button class="test-btn" @click="testGetRecommendations" :disabled="loading">
            {{ loading ? '测试中...' : '测试' }}
          </button>
        </view>
        <view class="test-result" v-if="recommendationsResult">
          <text class="result-label">结果 ({{ recommendationsResult.length }} 条):</text>
          <view class="result-list">
            <view v-for="item in recommendationsResult" :key="item.id" class="result-item">
              <text>{{ item.id }}. {{ item.title }} - ¥{{ item.price }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 用户信息 -->
      <view class="test-card">
        <view class="test-header">
          <text class="test-name">获取用户信息</text>
          <button class="test-btn" @click="testGetUserInfo" :disabled="loading">
            {{ loading ? '测试中...' : '测试' }}
          </button>
        </view>
        <view class="test-result" v-if="userInfoResult">
          <text class="result-label">结果:</text>
          <text class="result-content">{{ JSON.stringify(userInfoResult, null, 2) }}</text>
        </view>
      </view>
    </view>
    
    <!-- 测试日志 -->
    <view class="section">
      <view class="section-title">测试日志</view>
      <view class="log-container">
        <view v-for="(log, index) in testLogs" :key="index" class="log-item" :class="log.type">
          <text class="log-time">{{ log.time }}</text>
          <text class="log-message">{{ log.message }}</text>
        </view>
        <view v-if="testLogs.length === 0" class="empty-log">
          <text>暂无测试日志</text>
        </view>
      </view>
      <button class="clear-btn" @click="clearLogs" v-if="testLogs.length > 0">清空日志</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, config } from '@/api/index.js'

// 响应式数据
const loading = ref(false)
const apiStatus = ref('unknown')
const testLogs = ref([])

// 测试结果
const healthResult = ref(null)
const spacesResult = ref(null)
const problemsResult = ref(null)
const bannersResult = ref(null)
const recommendationsResult = ref(null)
const userInfoResult = ref(null)
const solutionsResult = ref(null)

// 空间选择相关
const spaceOptions = ref([])
const selectedSpaceIndex = ref(0)
const selectedSpace = ref(null)

// 生命周期
onMounted(() => {
  addLog('页面加载完成', 'info')
  testHealthCheck()
})

// 方法
const addLog = (message, type = 'info') => {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  testLogs.value.unshift({
    time,
    message,
    type
  })
  
  // 限制日志数量
  if (testLogs.value.length > 50) {
    testLogs.value = testLogs.value.slice(0, 50)
  }
}

const clearLogs = () => {
  testLogs.value = []
  addLog('日志已清空', 'info')
}

// 健康检查测试
const testHealthCheck = async () => {
  loading.value = true
  addLog('开始健康检查测试...', 'info')
  
  try {
    const result = await api.healthCheck()
    healthResult.value = result
    apiStatus.value = 'online'
    addLog('健康检查成功', 'success')
  } catch (error) {
    healthResult.value = { error: error.message }
    apiStatus.value = 'offline'
    addLog(`健康检查失败: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// 空间数据测试
const testGetSpaces = async () => {
  loading.value = true
  addLog('开始获取空间数据...', 'info')
  
  try {
    const result = await api.getSpaces()
    spacesResult.value = result
    spaceOptions.value = result
    if (result.length > 0) {
      selectedSpace.value = result[0]
    }
    addLog(`获取空间数据成功，共 ${result.length} 条`, 'success')
  } catch (error) {
    spacesResult.value = null
    addLog(`获取空间数据失败: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// 问题数据测试
const testGetProblems = async () => {
  if (!selectedSpace.value) {
    addLog('请先选择空间', 'warning')
    return
  }
  
  loading.value = true
  addLog(`开始获取空间 ${selectedSpace.value.name} 的问题数据...`, 'info')
  
  try {
    const result = await api.getProblems(selectedSpace.value.id)
    problemsResult.value = result
    addLog(`获取问题数据成功，共 ${result.length} 条`, 'success')
  } catch (error) {
    problemsResult.value = null
    addLog(`获取问题数据失败: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// 轮播图测试
const testGetBanners = async () => {
  loading.value = true
  addLog('开始获取轮播图数据...', 'info')
  
  try {
    const result = await api.getBanners()
    bannersResult.value = result
    addLog(`获取轮播图数据成功，共 ${result.length} 条`, 'success')
  } catch (error) {
    bannersResult.value = null
    addLog(`获取轮播图数据失败: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// 推荐内容测试
const testGetRecommendations = async () => {
  loading.value = true
  addLog('开始获取推荐内容...', 'info')
  
  try {
    const result = await api.getRecommendations()
    recommendationsResult.value = result
    addLog(`获取推荐内容成功，共 ${result.length} 条`, 'success')
  } catch (error) {
    recommendationsResult.value = null
    addLog(`获取推荐内容失败: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// 用户信息测试
const testGetUserInfo = async () => {
  loading.value = true
  addLog('开始获取用户信息...', 'info')
  
  try {
    const result = await api.getUserInfo()
    userInfoResult.value = result
    addLog('获取用户信息成功', 'success')
  } catch (error) {
    userInfoResult.value = null
    addLog(`获取用户信息失败: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// 解决方案列表测试
const testGetSolutions = async () => {
  loading.value = true
  addLog('开始获取解决方案列表...', 'info')
  
  try {
    const result = await api.getSolutions()
    solutionsResult.value = result
    addLog(`获取解决方案列表成功，共 ${result.total} 条`, 'success')
  } catch (error) {
    solutionsResult.value = null
    addLog(`获取解决方案列表失败: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// 空间选择变化
const onSpaceChange = (e) => {
  selectedSpaceIndex.value = e.detail.value
  selectedSpace.value = spaceOptions.value[e.detail.value]
  addLog(`选择空间: ${selectedSpace.value.name}`, 'info')
}
</script>

<style>
.api-test-container {
  background-color: #F6F8FA;
  min-height: 100vh;
  padding: 16px;
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #1F2937;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #6B7280;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #4F46E5;
}

.info-card {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 14px;
  color: #6B7280;
}

.value {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.status-success {
  color: #10B981;
}

.status-error {
  color: #EF4444;
}

.test-card {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.test-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.space-selector {
  flex: 1;
  margin: 0 12px;
}

.picker-text {
  padding: 8px 12px;
  background-color: #F3F4F6;
  border-radius: 4px;
  font-size: 12px;
  color: #6B7280;
  text-align: center;
}

.test-btn {
  padding: 8px 16px;
  background-color: #4F46E5;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 12px;
}

.test-btn:disabled {
  background-color: #D1D5DB;
  color: #9CA3AF;
}

.test-result {
  border-top: 1px solid #F3F4F6;
  padding-top: 12px;
}

.result-label {
  display: block;
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 8px;
}

.result-content {
  display: block;
  font-size: 11px;
  color: #374151;
  background-color: #F9FAFB;
  padding: 8px;
  border-radius: 4px;
  white-space: pre-wrap;
  font-family: monospace;
}

.result-list {
  background-color: #F9FAFB;
  border-radius: 4px;
  padding: 8px;
}

.result-item {
  font-size: 11px;
  color: #374151;
  margin-bottom: 4px;
  padding: 4px 0;
  border-bottom: 1px solid #E5E7EB;
}

.result-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.log-container {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
}

.log-item.info {
  background-color: #EFF6FF;
  color: #1E40AF;
}

.log-item.success {
  background-color: #ECFDF5;
  color: #065F46;
}

.log-item.error {
  background-color: #FEF2F2;
  color: #991B1B;
}

.log-item.warning {
  background-color: #FFFBEB;
  color: #92400E;
}

.log-time {
  margin-right: 8px;
  font-weight: 500;
  min-width: 60px;
}

.log-message {
  flex: 1;
}

.empty-log {
  text-align: center;
  color: #9CA3AF;
  font-size: 14px;
  padding: 20px;
}

.clear-btn {
  width: 100%;
  padding: 12px;
  background-color: #EF4444;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 12px;
}
</style> 