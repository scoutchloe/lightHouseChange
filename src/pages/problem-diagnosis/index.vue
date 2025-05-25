<template>
  <view class="page-container">
    <!-- 介绍信息 -->
    <view class="intro-card">
      <view class="intro-header">
        <text class="iconfont icon-question" style="color: #8B5CF6; font-size: 20px;"></text>
        <view class="intro-text">
          <text class="intro-title">问题诊断</text>
          <text class="intro-desc">您的{{ spaceName }}有哪些需要改进的问题？</text>
        </view>
      </view>
      <view class="progress-container">
        <view class="progress-bar">
          <view class="progress-fill" style="width: 66%;"></view>
        </view>
        <view class="progress-info">
          <text class="progress-step">步骤 2/3</text>
          <text class="progress-label">问题诊断</text>
        </view>
      </view>
    </view>

    <!-- 问题选择 -->
    <view class="problem-section">
      <text class="section-title">选择您遇到的问题（可多选）</text>
      <view class="problem-list">
        <view 
          v-for="problem in problems" 
          :key="problem.id"
          class="problem-card"
          :class="{ 'active': isSelected(problem.id) }"
          @click="toggleProblem(problem)"
        >
          <view class="problem-icon" :style="{ backgroundColor: iconBgColor(problem.icon) }">
            <text class="iconfont" :class="'icon-' + problem.icon"></text>
          </view>
          <view class="problem-info">
            <text class="problem-name">{{ problem.name }}</text>
            <text class="problem-desc">{{ problem.description }}</text>
          </view>
          <text class="problem-check iconfont icon-check" :class="{ 'visible': isSelected(problem.id) }"></text>
        </view>
      </view>
    </view>

    <!-- 自定义问题 -->
    <view class="custom-problem">
      <text class="section-title">其他问题</text>
      <view class="custom-input">
        <textarea 
          placeholder="请描述您的其他问题..." 
          maxlength="200" 
          v-model="customProblem"
        ></textarea>
        <text class="custom-count">{{ customProblem.length }}/200</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="button-container">
      <button class="btn btn-outline" style="flex: 1; margin-right: 12px;" @click="goBack">
        返回
      </button>
      <button class="btn btn-primary" style="flex: 1;" @click="goToNextStep">
        查看解决方案
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
      problems: [],
      customProblem: '',
      iconColors: {
        'inbox': '#22C55E',
        'sun-o': '#F59E0B',
        'arrows': '#3B82F6',
        'user-secret': '#8B5CF6',
        'moon-o': '#EC4899',
        'archive': '#EF4444',
        'compress': '#8B5CF6',
        'cutlery': '#F59E0B',
        'random': '#3B82F6'
      }
    }
  },
  setup() {
    const diagnosisStore = useDiagnosisStore()
    const { selectedSpace, selectedProblems } = storeToRefs(diagnosisStore)
    return {
      diagnosisStore,
      selectedSpace,
      selectedProblems
    }
  },
  computed: {
    spaceName() {
      return this.selectedSpace ? this.selectedSpace.name : '空间'
    }
  },
  onLoad() {
    if (!this.selectedSpace) {
      this.redirectToSpaceSelection()
      return
    }
    
    this.fetchProblems()
  },
  methods: {
    async fetchProblems() {
      try {
        if (!this.selectedSpace) return
        
        this.problems = await api.getProblems(this.selectedSpace.id)
      } catch (error) {
        console.error('获取问题数据失败', error)
        uni.showToast({
          title: '获取问题数据失败',
          icon: 'none'
        })
      }
    },
    redirectToSpaceSelection() {
      uni.redirectTo({
        url: '/pages/space-selection/index'
      })
    },
    isSelected(problemId) {
      return this.selectedProblems.some(p => p.id === problemId)
    },
    toggleProblem(problem) {
      if (this.isSelected(problem.id)) {
        this.diagnosisStore.removeProblem(problem.id)
      } else {
        this.diagnosisStore.addProblem(problem)
      }
    },
    iconBgColor(icon) {
      const color = this.iconColors[icon] || '#4F46E5'
      return this.hexToRgba(color, 0.1)
    },
    hexToRgba(hex, alpha = 1) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    },
    goBack() {
      uni.navigateBack()
    },
    goToNextStep() {
      if (this.selectedProblems.length === 0 && !this.customProblem.trim()) {
        uni.showToast({
          title: '请至少选择一个问题',
          icon: 'none'
        })
        return
      }
      
      // 如果有自定义问题，创建一个自定义问题对象
      if (this.customProblem.trim()) {
        const customProblemObj = {
          id: 'custom-' + Date.now(),
          name: '自定义问题',
          description: this.customProblem,
          isCustom: true
        }
        this.diagnosisStore.addProblem(customProblemObj)
      }
      
      uni.navigateTo({
        url: '/pages/solution-list/index'
      })
    }
  }
}
</script>

<style>
.intro-card {
  background-color: #F3E8FF;
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
  background-color: #8B5CF6;
  border-radius: 3px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 12px;
  color: #6B7280;
}

.problem-section {
  margin-bottom: 24px;
}

.problem-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.problem-card {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  position: relative;
  border: 2px solid transparent;
}

.problem-card.active {
  border-color: #8B5CF6;
}

.problem-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.problem-icon .iconfont {
  font-size: 24px;
  color: #4F46E5;
}

.problem-info {
  flex: 1;
}

.problem-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.problem-desc {
  font-size: 14px;
  color: #6B7280;
}

.problem-check {
  color: #8B5CF6;
  font-size: 20px;
  visibility: hidden;
}

.problem-check.visible {
  visibility: visible;
}

.custom-problem {
  margin-bottom: 24px;
}

.custom-input {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  position: relative;
}

.custom-input textarea {
  width: 100%;
  height: 100px;
  font-size: 14px;
}

.custom-count {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-size: 12px;
  color: #9CA3AF;
}

.button-container {
  display: flex;
  padding: 16px 0;
}
</style> 