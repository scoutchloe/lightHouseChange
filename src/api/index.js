// API配置
const API_BASE_URL = 'http://localhost:8081/api'

// 通用请求方法
const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 检查后端返回的数据格式
          if (res.data && res.data.success !== undefined) {
            // 如果是统一响应格式 {success: true, data: ..., message: ...}
            if (res.data.success) {
              resolve(res.data.data)
            } else {
              reject(new Error(res.data.message || '请求失败'))
            }
          } else if (res.data && res.data.code !== undefined) {
            // 如果是新的统一响应格式 {code: 200, message: "...", data: ..., timestamp: ...}
            if (res.data.code === 200) {
              resolve(res.data.data)
            } else {
              reject(new Error(res.data.message || '请求失败'))
            }
          } else {
            // 直接返回数据
            resolve(res.data)
          }
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (error) => {
        console.error('API请求失败:', error)
        reject(new Error('网络请求失败，请检查网络连接'))
      }
    })
  })
}

// Mock数据 - 用于后端接口未实现时的临时方案
const mockData = {
  banners: [
    {
      id: 1,
      title: '春季家居焕新',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      link: '/pages/solution-list/index'
    },
    {
      id: 2,
      title: '收纳专题',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      link: '/pages/solution-list/index?category=storage'
    }
  ],
  
  recommendations: [
    {
      id: 1001,
      title: '客厅多功能墙面收纳方案',
      price: 1299,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      description: '利用墙面空间，打造多功能收纳系统，提升客厅整洁度',
      space: 1, // 客厅
      problems: [101, 102], // 收纳不足、空间利用率低
      tags: ['收纳', '墙面', '多功能']
    },
    {
      id: 1002,
      title: '卧室光线优化方案',
      price: 899,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      description: '通过窗帘、灯具搭配，改善卧室光线环境',
      space: 2, // 卧室
      problems: [201], // 光线不足
      tags: ['光线', '窗帘', '灯具']
    },
    {
      id: 1003,
      title: '厨房台面收纳整理',
      price: 599,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      description: '厨房台面空间优化，提升烹饪效率',
      space: 3, // 厨房
      problems: [301, 302], // 台面杂乱、收纳不足
      tags: ['厨房', '台面', '收纳']
    },
    {
      id: 1004,
      title: '卫生间干湿分离改造',
      price: 2199,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      description: '卫生间干湿分离设计，提升使用体验',
      space: 4, // 卫生间
      problems: [401], // 干湿不分
      tags: ['卫生间', '干湿分离', '改造']
    }
  ],
  
  userInfo: {
    id: 1,
    nickname: '用户昵称',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    phone: '138****8888',
    memberLevel: 'VIP',
    points: 1280
  }
}

// 模拟请求延迟
const mockRequest = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

// API接口
export const api = {
  // ========== 已实现的后端接口 ==========
  
  // 获取所有空间类型
  getSpaces() {
    return request('/spaces')
  },
  
  // 根据空间ID获取问题类型
  getProblems(spaceId) {
    return request(`/problems?spaceId=${spaceId}`)
  },
  
  // 健康检查
  healthCheck() {
    return request('/health')
  },
  
  // 获取API信息
  getApiInfo() {
    return request('/health/info')
  },
  
  // ========== 待实现的接口（使用Mock数据） ==========
  
  // 获取首页轮播图
  getBanners() {
    // console.log('使用Mock数据: getBanners')
    return request('/banners')
  },
  
  // 获取推荐内容
  getRecommendations() {
    console.log('使用Mock数据: getRecommendations')
    return mockRequest(mockData.recommendations)
  },
  
  // 获取热门解决方案
  getHotSolutions(limit = 3) {
    console.log('使用Mock数据: getHotSolutions')
    return mockRequest(mockData.recommendations.slice(0, limit))
  },
  
  // 获取解决方案列表
  getSolutions(params = {}) {
    console.log('使用Mock数据: getSolutions', params)
    return mockRequest({
      list: mockData.recommendations,
      total: mockData.recommendations.length,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    })
  },
  
  // 获取解决方案详情
  getSolutionDetail(id) {
    console.log('使用Mock数据: getSolutionDetail', id)
    const solution = mockData.recommendations.find(item => item.id == id)
    return mockRequest(solution || mockData.recommendations[0])
  },
  
  // 用户登录
  userLogin(loginData) {
    console.log('使用Mock数据: userLogin', loginData)
    return mockRequest({
      token: 'mock_token_' + Date.now(),
      userInfo: mockData.userInfo
    })
  },
  
  // 获取用户信息
  getUserInfo() {
    console.log('使用Mock数据: getUserInfo')
    return mockRequest(mockData.userInfo)
  },
  
  // 用户登出
  userLogout() {
    console.log('使用Mock数据: userLogout')
    return mockRequest({ success: true })
  },
  
  // 获取用户统计信息
  getUserStats() {
    console.log('使用Mock数据: getUserStats')
    return mockRequest({
      favoriteCount: 12,
      historyCount: 28,
      orderCount: 5,
      couponCount: 3
    })
  },
  
  // 添加到收藏
  addToFavorites(itemId, itemType = 'solution') {
    console.log('使用Mock数据: addToFavorites', itemId, itemType)
    return mockRequest({ success: true, message: '收藏成功' })
  },
  
  // 获取收藏列表
  getFavorites() {
    console.log('使用Mock数据: getFavorites')
    return mockRequest(mockData.recommendations)
  },
  
  // 检查收藏状态
  checkFavoriteStatus(itemId, itemType = 'solution') {
    console.log('使用Mock数据: checkFavoriteStatus', itemId, itemType)
    return mockRequest({ isFavorited: false })
  },
  
  // 添加到浏览历史
  addToHistory(itemId, itemType = 'solution') {
    console.log('使用Mock数据: addToHistory', itemId, itemType)
    return mockRequest({ success: true })
  },
  
  // 获取浏览历史
  getBrowseHistory() {
    console.log('使用Mock数据: getBrowseHistory')
    return mockRequest(mockData.recommendations)
  },
  
  // 清空浏览历史
  clearBrowseHistory() {
    console.log('使用Mock数据: clearBrowseHistory')
    return mockRequest({ success: true })
  },
  
  // 发送验证码
  sendVerificationCode(phone) {
    console.log('使用Mock数据: sendVerificationCode', phone)
    return mockRequest({ success: true, message: '验证码已发送' })
  },
  
  // 获取订单统计
  getOrderCounts() {
    console.log('使用Mock数据: getOrderCounts')
    return mockRequest({
      all: 8,
      pending: 2,
      paid: 3,
      shipped: 2,
      completed: 1
    })
  },
  
  // 照片分析（AI功能）
  analyzePhoto(photoPath) {
    console.log('使用Mock数据: analyzePhoto', photoPath)
    return mockRequest({
      analysisId: 'analysis_' + Date.now(),
      detectedProblems: [
        { id: 101, name: '收纳不足', confidence: 0.85 },
        { id: 102, name: '光线不足', confidence: 0.72 }
      ],
      suggestions: mockData.recommendations.slice(0, 2)
    })
  },
  
  // 保存照片分析结果
  savePhotoAnalysis(analysisData) {
    console.log('使用Mock数据: savePhotoAnalysis', analysisData)
    return mockRequest({ success: true, id: 'saved_' + Date.now() })
  },
  
  // 获取照片分析历史
  getPhotoAnalysisHistory() {
    console.log('使用Mock数据: getPhotoAnalysisHistory')
    return mockRequest([
      {
        id: 'analysis_1',
        photoUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
        analysisDate: '2024-01-15',
        problems: ['收纳不足', '光线不足']
      }
    ])
  },
  
  // 获取推荐产品
  getRecommendedProducts() {
    console.log('使用Mock数据: getRecommendedProducts')
    return mockRequest([
      {
        id: 'product_1',
        name: '多功能收纳架',
        price: 299,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'
      }
    ])
  },
  
  // 获取可用优惠券
  getAvailableCoupons() {
    console.log('使用Mock数据: getAvailableCoupons')
    return mockRequest([
      {
        id: 'coupon_1',
        name: '新用户专享',
        discount: 50,
        minAmount: 200,
        expireDate: '2024-12-31'
      }
    ])
  }
}

// 导出配置，方便其他地方使用
export const config = {
  API_BASE_URL
} 