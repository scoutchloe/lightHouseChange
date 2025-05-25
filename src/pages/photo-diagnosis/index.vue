<template>
  <view class="page-container">
    <!-- 拍照区域 -->
    <view class="photo-section">
      <view class="photo-tips">
        <text class="tips-title">拍照小贴士</text>
        <text class="tips-text">• 确保光线充足，避免阴影遮挡</text>
        <text class="tips-text">• 尽量拍摄完整的空间全景</text>
        <text class="tips-text">• 保持手机稳定，避免模糊</text>
      </view>
      
      <view class="photo-area">
        <view v-if="!photoPath" class="photo-placeholder" @click="choosePhoto">
          <text class="iconfont icon-camera"></text>
          <text class="placeholder-text">点击拍照或选择图片</text>
        </view>
        <view v-else class="photo-preview">
          <image :src="photoPath" mode="aspectFit" class="preview-image" />
          <view class="photo-actions">
            <button class="action-btn secondary" @click="choosePhoto">重新拍照</button>
            <button class="action-btn primary" @click="analyzePhoto" :disabled="analyzing">
              {{ analyzing ? '分析中...' : '开始分析' }}
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 分析结果 -->
    <view v-if="analysisResult" class="analysis-section">
      <view class="analysis-header">
        <text class="analysis-title">AI诊断结果</text>
        <view class="confidence-score">
          <text class="score-label">准确度：</text>
          <text class="score-value">{{ analysisResult.confidence }}%</text>
        </view>
      </view>

      <!-- 识别的空间类型 -->
      <view class="space-info">
        <text class="info-label">识别空间：</text>
        <text class="info-value">{{ analysisResult.spaceType }}</text>
      </view>

      <!-- 发现的问题 -->
      <view class="problems-section">
        <text class="section-title">发现的问题</text>
        <view class="problems-list">
          <view 
            v-for="problem in analysisResult.problems" 
            :key="problem.id"
            class="problem-item"
          >
            <view class="problem-header">
              <text class="problem-name">{{ problem.name }}</text>
              <text class="problem-severity" :class="getSeverityClass(problem.severity)">
                {{ getSeverityText(problem.severity) }}
              </text>
            </view>
            <text class="problem-desc">{{ problem.description }}</text>
          </view>
        </view>
      </view>

      <!-- 推荐方案 -->
      <view class="solutions-section">
        <text class="section-title">推荐解决方案</text>
        <view class="solutions-list">
          <solution-card 
            v-for="solution in analysisResult.recommendedSolutions" 
            :key="solution.id" 
            :solution="solution"
            @click="goToSolutionDetail(solution.id)"
          ></solution-card>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="btn-outline" @click="saveAnalysis">保存诊断</button>
        <button class="btn-primary" @click="goToSolutions">查看更多方案</button>
      </view>
    </view>

    <!-- 历史记录 -->
    <view v-if="historyList.length > 0" class="history-section">
      <view class="section-header">
        <text class="section-title">历史诊断</text>
        <text class="section-more" @click="showAllHistory">查看全部</text>
      </view>
      <view class="history-list">
        <view 
          v-for="item in historyList.slice(0, 3)" 
          :key="item.id"
          class="history-item"
          @click="loadHistoryItem(item)"
        >
          <image :src="item.photo" mode="aspectFill" class="history-image" />
          <view class="history-info">
            <text class="history-space">{{ item.spaceType }}</text>
            <text class="history-date">{{ formatDate(item.createTime) }}</text>
            <text class="history-problems">发现{{ item.problemCount }}个问题</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '@/api/index.js'
import SolutionCard from '@/components/SolutionCard.vue'

export default {
  components: {
    SolutionCard
  },
  data() {
    return {
      photoPath: '',
      analyzing: false,
      analysisResult: null,
      historyList: []
    }
  },
  onLoad() {
    this.loadHistory()
  },
  methods: {
    // 选择照片
    choosePhoto() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          this.photoPath = res.tempFilePaths[0]
          this.analysisResult = null
        },
        fail: (error) => {
          console.error('选择图片失败', error)
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        }
      })
    },

    // 分析照片
    async analyzePhoto() {
      if (!this.photoPath) {
        uni.showToast({
          title: '请先选择照片',
          icon: 'none'
        })
        return
      }

      this.analyzing = true
      
      try {
        // 模拟AI分析过程
        await this.simulateAnalysis()
        
        // 调用模拟API进行分析
        this.analysisResult = await api.analyzePhoto(this.photoPath)
        
        uni.showToast({
          title: '分析完成',
          icon: 'success'
        })
      } catch (error) {
        console.error('分析失败', error)
        uni.showToast({
          title: '分析失败，请重试',
          icon: 'none'
        })
      } finally {
        this.analyzing = false
      }
    },

    // 模拟分析过程
    simulateAnalysis() {
      return new Promise((resolve) => {
        setTimeout(resolve, 2000) // 模拟2秒分析时间
      })
    },

    // 获取问题严重程度样式类
    getSeverityClass(severity) {
      const classMap = {
        high: 'severity-high',
        medium: 'severity-medium',
        low: 'severity-low'
      }
      return classMap[severity] || 'severity-low'
    },

    // 获取问题严重程度文本
    getSeverityText(severity) {
      const textMap = {
        high: '严重',
        medium: '中等',
        low: '轻微'
      }
      return textMap[severity] || '轻微'
    },

    // 保存诊断结果
    async saveAnalysis() {
      if (!this.analysisResult) return
      
      try {
        await api.savePhotoAnalysis({
          photo: this.photoPath,
          result: this.analysisResult,
          createTime: Date.now()
        })
        
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        
        this.loadHistory()
      } catch (error) {
        console.error('保存失败', error)
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    },

    // 跳转到方案详情
    goToSolutionDetail(solutionId) {
      uni.navigateTo({
        url: `/pages/solution-detail/index?id=${solutionId}`
      })
    },

    // 跳转到方案列表
    goToSolutions() {
      uni.switchTab({
        url: '/pages/solution-list/index'
      })
    },

    // 加载历史记录
    async loadHistory() {
      try {
        this.historyList = await api.getPhotoAnalysisHistory()
      } catch (error) {
        console.error('加载历史记录失败', error)
      }
    },

    // 加载历史项目
    loadHistoryItem(item) {
      this.photoPath = item.photo
      this.analysisResult = item.result
    },

    // 显示全部历史
    showAllHistory() {
      uni.navigateTo({
        url: '/pages/photo-diagnosis/history'
      })
    },

    // 格式化日期
    formatDate(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 24 * 60 * 60 * 1000) {
        return '今天'
      } else if (diff < 48 * 60 * 60 * 1000) {
        return '昨天'
      } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`
      }
    }
  }
}
</script>

<style>
.photo-section {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.photo-tips {
  margin-bottom: 20px;
}

.tips-title {
  font-size: 16px;
  font-weight: 500;
  color: #1F2937;
  display: block;
  margin-bottom: 8px;
}

.tips-text {
  font-size: 12px;
  color: #6B7280;
  display: block;
  line-height: 1.5;
  margin-bottom: 4px;
}

.photo-area {
  border: 2px dashed #D1D5DB;
  border-radius: 12px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}

.icon-camera {
  font-size: 48px;
  color: #9CA3AF;
  margin-bottom: 12px;
}

.placeholder-text {
  font-size: 14px;
  color: #6B7280;
}

.photo-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.photo-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  border: none;
}

.action-btn.secondary {
  background-color: #F3F4F6;
  color: #374151;
}

.action-btn.primary {
  background-color: #4F46E5;
  color: #FFFFFF;
}

.action-btn:disabled {
  opacity: 0.6;
}

.analysis-section {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.analysis-title {
  font-size: 18px;
  font-weight: 500;
  color: #1F2937;
}

.confidence-score {
  display: flex;
  align-items: center;
}

.score-label {
  font-size: 12px;
  color: #6B7280;
  margin-right: 4px;
}

.score-value {
  font-size: 14px;
  font-weight: 500;
  color: #059669;
}

.space-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px;
  background-color: #F3F4F6;
  border-radius: 8px;
}

.info-label {
  font-size: 14px;
  color: #6B7280;
  margin-right: 8px;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
}

.problems-section, .solutions-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #1F2937;
  display: block;
  margin-bottom: 12px;
}

.problems-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.problem-item {
  padding: 12px;
  background-color: #FEF2F2;
  border-radius: 8px;
  border-left: 4px solid #EF4444;
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.problem-name {
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
}

.problem-severity {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  color: #FFFFFF;
}

.severity-high {
  background-color: #EF4444;
}

.severity-medium {
  background-color: #F59E0B;
}

.severity-low {
  background-color: #10B981;
}

.problem-desc {
  font-size: 12px;
  color: #6B7280;
  line-height: 1.4;
}

.solutions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-outline {
  flex: 1;
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  background-color: #FFFFFF;
  color: #374151;
  font-size: 14px;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #4F46E5;
  color: #FFFFFF;
  font-size: 14px;
}

.history-section {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-more {
  font-size: 14px;
  color: #4F46E5;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  padding: 12px;
  background-color: #F9FAFB;
  border-radius: 8px;
}

.history-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  margin-right: 12px;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.history-space {
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
}

.history-date {
  font-size: 12px;
  color: #6B7280;
}

.history-problems {
  font-size: 12px;
  color: #4F46E5;
}
</style> 