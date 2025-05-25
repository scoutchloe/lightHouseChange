<template>
  <view class="page-container">
    <!-- 搜索框 -->
    <view class="search-container">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input 
          type="text" 
          placeholder="搜索方案" 
          confirm-type="search"
          v-model="searchText"
          @confirm="handleSearch"
        />
      </view>
    </view>

    <!-- 筛选条件 -->
    <view class="filter-section">
      <scroll-view scroll-x class="filter-scroll">
        <view class="filter-tags">
          <view 
            class="btn-tag" 
            :class="{ 'active': currentFilterType === 'all' }"
            @click="setFilterType('all')"
          >全部</view>
          <view 
            class="btn-tag" 
            :class="{ 'active': currentFilterType === 'space' }"
            @click="setFilterType('space')"
            v-if="selectedSpace"
          >{{ selectedSpace.name }}</view>
          <view 
            v-for="(problem, index) in selectedProblems" 
            :key="problem.id"
            class="btn-tag" 
            :class="{ 'active': currentFilterType === 'problem' && currentProblemIndex === index }"
            @click="setFilterProblem(index)"
          >{{ problem.name }}</view>
          <view 
            class="btn-tag" 
            :class="{ 'active': currentFilterType === 'price-asc' }"
            @click="setFilterType('price-asc')"
          >价格 ↑</view>
          <view 
            class="btn-tag" 
            :class="{ 'active': currentFilterType === 'price-desc' }"
            @click="setFilterType('price-desc')"
          >价格 ↓</view>
          <view 
            class="btn-tag" 
            :class="{ 'active': currentFilterType === 'rating' }"
            @click="setFilterType('rating')"
          >好评优先</view>
        </view>
      </scroll-view>
    </view>

    <!-- 结果汇总 -->
    <view class="result-summary">
      <text>共找到 {{ filteredSolutions.length }} 个解决方案</text>
    </view>

    <!-- 解决方案列表 -->
    <view class="solution-list">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      <view v-else-if="filteredSolutions.length === 0" class="empty-state">
        <text class="empty-icon iconfont icon-search"></text>
        <text class="empty-text">没有找到匹配的解决方案</text>
        <text class="empty-desc">尝试更换筛选条件或清除搜索关键词</text>
        <button class="btn btn-primary btn-sm" style="margin-top: 16px;" @click="resetFilters">
          清除筛选条件
        </button>
      </view>
      <block v-else>
        <solution-card 
          v-for="solution in filteredSolutions" 
          :key="solution.id" 
          :solution="solution"
        ></solution-card>
      </block>
    </view>
    
    <!-- 返回诊断按钮 -->
    <view class="fab-button" @click="goToDiagnosis" v-if="hasFilters">
      <text class="iconfont icon-edit"></text>
    </view>
  </view>
</template>

<script>
import { api } from '@/api/index.js'
import { useDiagnosisStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import SolutionCard from '@/components/SolutionCard.vue'

export default {
  components: {
    SolutionCard
  },
  data() {
    return {
      solutions: [],
      filteredSolutions: [],
      loading: true,
      searchText: '',
      currentFilterType: 'all',
      currentProblemIndex: -1
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
    hasFilters() {
      return this.selectedSpace || this.selectedProblems.length > 0
    }
  },
  onLoad(options) {
    if (options.keyword) {
      this.searchText = decodeURIComponent(options.keyword)
    }
    this.fetchSolutions()
  },
  onShow() {
    // 监听来自首页的搜索关键词事件
    uni.$on('searchKeyword', this.handleSearchKeyword)
    // 监听来自navigation工具的参数事件
    uni.$on('solutionListParams', this.handleNavigationParams)
  },
  onHide() {
    // 移除事件监听
    uni.$off('searchKeyword', this.handleSearchKeyword)
    uni.$off('solutionListParams', this.handleNavigationParams)
  },
  onPullDownRefresh() {
    this.fetchSolutions().then(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    async fetchSolutions() {
      this.loading = true
      try {
        // 准备筛选参数
        const params = {}
        
        // 如果有搜索关键词
        if (this.searchText) {
          params.keyword = this.searchText
        }
        
        // 如果有选择空间
        if (this.selectedSpace) {
          params.spaceId = this.selectedSpace.id
        }
        
        // 如果有选择问题
        if (this.selectedProblems.length > 0) {
          params.problemIds = this.selectedProblems.map(p => p.id)
        }
        
        const result = await api.getSolutions(params)
        // getSolutions返回的是对象 {list: [], total: number, page: number, pageSize: number}
        // 我们需要提取list字段作为数组
        this.solutions = result.list || result || []
        this.applyFilters()
      } catch (error) {
        console.error('获取解决方案失败', error)
        uni.showToast({
          title: '获取解决方案失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.fetchSolutions()
    },
    setFilterType(type) {
      this.currentFilterType = type
      this.currentProblemIndex = -1
      this.applyFilters()
    },
    setFilterProblem(index) {
      this.currentFilterType = 'problem'
      this.currentProblemIndex = index
      this.applyFilters()
    },
    applyFilters() {
      // 确保solutions是数组
      const solutionsArray = Array.isArray(this.solutions) ? this.solutions : []
      let result = [...solutionsArray]
      
      // 根据筛选类型筛选
      switch (this.currentFilterType) {
        case 'all':
          // 不做额外筛选
          break
        case 'space':
          if (this.selectedSpace) {
            result = result.filter(item => item.space === this.selectedSpace.id)
          }
          break
        case 'problem':
          if (this.currentProblemIndex >= 0 && this.selectedProblems[this.currentProblemIndex]) {
            const problemId = this.selectedProblems[this.currentProblemIndex].id
            result = result.filter(item => item.problems && item.problems.includes(problemId))
          }
          break
        case 'price-asc':
          result.sort((a, b) => (a.price || 0) - (b.price || 0))
          break
        case 'price-desc':
          result.sort((a, b) => (b.price || 0) - (a.price || 0))
          break
        case 'rating':
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
      }
      
      this.filteredSolutions = result
    },
    resetFilters() {
      this.searchText = ''
      this.currentFilterType = 'all'
      this.currentProblemIndex = -1
      this.fetchSolutions()
    },
    goToDiagnosis() {
      uni.navigateTo({
        url: '/pages/problem-diagnosis/index'
      })
    },
    handleSearchKeyword(keyword) {
      this.searchText = keyword
      this.fetchSolutions()
    },
    handleNavigationParams(params) {
      // 处理来自navigation工具的参数
      // 这里可以根据需要处理参数
    }
  }
}
</script>

<style>
.search-container {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
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

.filter-section {
  margin-bottom: 16px;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-tags {
  display: flex;
  padding: 4px 0;
}

.btn-tag {
  margin-right: 8px;
  flex-shrink: 0;
}

.result-summary {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 16px;
}

.solution-list {
  margin-bottom: 24px;
}

.loading, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.empty-icon {
  font-size: 48px;
  color: #9CA3AF;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #6B7280;
  text-align: center;
}

.fab-button {
  position: fixed;
  bottom: 30px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #4F46E5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.fab-button .iconfont {
  color: white;
  font-size: 24px;
}
</style> 