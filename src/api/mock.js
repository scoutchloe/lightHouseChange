// 空间类型数据
export const spaces = [
  {
    id: 1,
    name: '客厅',
    icon: 'tv',
    iconColor: '#22C55E',
    description: '适合社交、休闲的多功能空间',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    name: '卧室',
    icon: 'bed',
    iconColor: '#3B82F6',
    description: '打造舒适私密的睡眠环境',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    name: '厨房',
    icon: 'cutlery',
    iconColor: '#F59E0B',
    description: '高效实用的烹饪空间',
    image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    name: '卫生间',
    icon: 'bath',
    iconColor: '#8B5CF6',
    description: '干湿分离、收纳有序',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 5,
    name: '书房',
    icon: 'book',
    iconColor: '#EF4444',
    description: '专注高效的工作学习区',
    image: 'https://images.unsplash.com/photo-1519974719765-e6559eac2575?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 6,
    name: '阳台',
    icon: 'leaf',
    iconColor: '#22C55E',
    description: '休闲、晾晒多用途空间',
    image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }
]

// 问题类型数据
export const problems = {
  1: [ // 客厅问题
    {
      id: 101,
      name: '收纳不足',
      icon: 'inbox',
      description: '东西太多没地方放，空间显得凌乱'
    },
    {
      id: 102,
      name: '光线不足',
      icon: 'sun-o',
      description: '室内太暗，影响心情和活动'
    },
    {
      id: 103,
      name: '空间拥挤',
      icon: 'arrows',
      description: '家具太多或太大，行动不便'
    },
    {
      id: 104,
      name: '缺乏隐私',
      icon: 'user-secret',
      description: '开放式空间，缺少私密区域'
    }
  ],
  2: [ // 卧室问题
    {
      id: 201,
      name: '睡眠质量差',
      icon: 'moon-o',
      description: '噪音、光线或温度影响睡眠'
    },
    {
      id: 202,
      name: '收纳空间小',
      icon: 'archive',
      description: '衣物和个人物品无处安放'
    },
    {
      id: 203,
      name: '空间狭小',
      icon: 'compress',
      description: '活动范围受限，感觉压抑'
    }
  ],
  3: [ // 厨房问题
    {
      id: 301,
      name: '操作台面小',
      icon: 'cutlery',
      description: '准备食材空间不足'
    },
    {
      id: 302,
      name: '收纳不足',
      icon: 'archive',
      description: '厨具和食材难以归类存放'
    },
    {
      id: 303,
      name: '动线不合理',
      icon: 'random',
      description: '烹饪过程中走动繁琐'
    }
  ]
}

// 解决方案数据
export const solutions = [
  {
    id: 1001,
    title: '客厅多功能墙面收纳方案',
    space: 1,
    problems: [101, 103],
    price: 1299,
    rating: 5.0,
    benefits: '收纳空间增加30%',
    tags: ['收纳', '省钱', '3天完工'],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: '采用挂墙式收纳系统，结合开放式和封闭式储物，既能展示装饰品，又能隐藏杂物，保持空间整洁。',
    materials: [
      { name: '壁挂收纳架', price: 399, quantity: 2 },
      { name: '墙面层板', price: 199, quantity: 3 },
      { name: '收纳盒', price: 99, quantity: 4 }
    ],
    steps: [
      '测量墙面尺寸，确定安装位置',
      '固定壁挂导轨，确保水平',
      '安装搁板和收纳组件',
      '整理物品分类放置'
    ],
    beforeAfter: [
      {
        before: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        after: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 1002,
    title: '卧室光线优化方案',
    space: 2,
    problems: [202, 201],
    price: 899,
    rating: 4.9,
    benefits: '光线增强50%',
    tags: ['光线', '软装', '2天完工'],
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: '通过更换窗帘、调整灯光和增加反光面，优化室内自然光和人造光源，创造明亮舒适的卧室环境。',
    materials: [
      { name: '遮光窗帘', price: 299, quantity: 1 },
      { name: '床头阅读灯', price: 199, quantity: 2 },
      { name: '全光谱台灯', price: 299, quantity: 1 }
    ],
    steps: [
      '安装窗帘导轨和遮光窗帘',
      '布置床头阅读灯',
      '调整主照明灯具位置',
      '添加装饰性光源提升氛围'
    ],
    beforeAfter: [
      {
        before: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        after: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 1003,
    title: '小厨房收纳优化方案',
    space: 3,
    problems: [302, 301],
    price: 1499,
    rating: 4.8,
    benefits: '使用空间增加40%',
    tags: ['收纳', '空间优化', '4天完工'],
    image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: '利用厨房每一寸空间，包括墙面、柜门内侧和顶部空间，增加厨具和食材的存储空间，让烹饪更加高效便捷。',
    materials: [
      { name: '壁挂式调味架', price: 199, quantity: 1 },
      { name: '抽屉分隔收纳盒', price: 149, quantity: 3 },
      { name: '多功能刀架', price: 129, quantity: 1 },
      { name: '柜门挂钩', price: 79, quantity: 4 }
    ],
    steps: [
      '厨具分类整理',
      '安装壁挂收纳系统',
      '柜内空间优化重组',
      '物品归位并标记'
    ],
    beforeAfter: [
      {
        before: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        after: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
]

// 轮播图数据
export const banners = [
  {
    id: 1,
    title: '小空间大变身 - 14㎡客厅改造案例',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    url: '/pages/solution-detail/index?id=1001'
  },
  {
    id: 2,
    title: '极简主义卧室 - 舒眠空间改造',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    url: '/pages/solution-detail/index?id=1002'
  },
  {
    id: 3,
    title: '厨房革命 - 3㎡小厨房的空间魔法',
    image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    url: '/pages/solution-detail/index?id=1003'
  }
]

// 推荐内容数据
export const recommendations = [
  {
    id: 1,
    title: '小户型照明优化指南',
    description: '专业设计师总结的5个照明技巧',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    tags: ['光线', '小户型']
  },
  {
    id: 2,
    title: '打造不凌乱的客厅收纳秘诀',
    description: '3种实用隐藏式收纳方案',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    tags: ['收纳', '客厅']
  }
]

// 搜索和获取方案的API
export const api = {
  // 获取所有空间类型
  getSpaces() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(spaces)
      }, 300)
    })
  },
  
  // 根据空间ID获取问题类型
  getProblems(spaceId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(problems[spaceId] || [])
      }, 300)
    })
  },
  
  // 获取首页轮播图
  getBanners() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(banners)
      }, 300)
    })
  },
  
  // 获取推荐内容
  getRecommendations() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(recommendations)
      }, 300)
    })
  },
  
  // 获取热门方案
  getHotSolutions(limit = 3) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(solutions.slice(0, limit))
      }, 300)
    })
  },
  
  // 根据空间和问题筛选方案
  getSolutions(params = {}) {
    return new Promise(resolve => {
      setTimeout(() => {
        let result = [...solutions]
        
        // 按空间筛选
        if (params.spaceId) {
          result = result.filter(item => item.space === params.spaceId)
        }
        
        // 按问题筛选
        if (params.problemIds && params.problemIds.length > 0) {
          result = result.filter(item => {
            return params.problemIds.some(id => item.problems.includes(id))
          })
        }
        
        // 按关键词搜索
        if (params.keyword) {
          const keyword = params.keyword.toLowerCase()
          result = result.filter(item => {
            return item.title.toLowerCase().includes(keyword) || 
                   item.description.toLowerCase().includes(keyword)
          })
        }
        
        resolve(result)
      }, 500)
    })
  },
  
  // 根据ID获取方案详情
  getSolutionDetail(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const solution = solutions.find(item => item.id === Number(id))
        if (solution) {
          resolve(solution)
        } else {
          reject(new Error('方案不存在'))
        }
      }, 300)
    })
  },

  // AI拍照分析
  analyzePhoto(photoPath) {
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟AI分析结果
        const mockResults = [
          {
            spaceType: '客厅',
            confidence: 92,
            problems: [
              {
                id: 1,
                name: '收纳空间不足',
                description: '检测到大量物品散落在沙发和茶几上，缺乏有效的收纳系统',
                severity: 'high'
              },
              {
                id: 2,
                name: '光线不足',
                description: '室内光线较暗，建议增加照明设备或优化窗帘',
                severity: 'medium'
              }
            ],
            recommendedSolutions: solutions.filter(s => s.space === 1).slice(0, 2)
          },
          {
            spaceType: '卧室',
            confidence: 88,
            problems: [
              {
                id: 1,
                name: '空间拥挤',
                description: '床铺周围活动空间较小，建议优化家具布局',
                severity: 'medium'
              },
              {
                id: 2,
                name: '收纳不足',
                description: '衣物和个人物品缺乏合理的收纳空间',
                severity: 'high'
              }
            ],
            recommendedSolutions: solutions.filter(s => s.space === 2).slice(0, 2)
          },
          {
            spaceType: '厨房',
            confidence: 95,
            problems: [
              {
                id: 1,
                name: '操作台面杂乱',
                description: '台面上物品过多，影响烹饪操作效率',
                severity: 'high'
              },
              {
                id: 2,
                name: '收纳系统混乱',
                description: '厨具和调料缺乏分类收纳，取用不便',
                severity: 'medium'
              }
            ],
            recommendedSolutions: solutions.filter(s => s.space === 3).slice(0, 2)
          }
        ]
        
        // 随机返回一个分析结果
        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
        resolve(randomResult)
      }, 2000) // 模拟AI分析时间
    })
  },

  // 保存拍照分析结果
  savePhotoAnalysis(analysisData) {
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟保存到本地存储
        const historyKey = 'photo_analysis_history'
        let history = []
        
        try {
          const stored = uni.getStorageSync(historyKey)
          if (stored) {
            history = JSON.parse(stored)
          }
        } catch (error) {
          console.error('读取历史记录失败', error)
        }
        
        // 添加新记录
        const newRecord = {
          id: Date.now(),
          photo: analysisData.photo,
          spaceType: analysisData.result.spaceType,
          problemCount: analysisData.result.problems.length,
          result: analysisData.result,
          createTime: analysisData.createTime
        }
        
        history.unshift(newRecord)
        
        // 只保留最近20条记录
        if (history.length > 20) {
          history = history.slice(0, 20)
        }
        
        try {
          uni.setStorageSync(historyKey, JSON.stringify(history))
        } catch (error) {
          console.error('保存历史记录失败', error)
        }
        
        resolve(newRecord)
      }, 500)
    })
  },

  // 获取拍照分析历史记录
  getPhotoAnalysisHistory() {
    return new Promise(resolve => {
      setTimeout(() => {
        const historyKey = 'photo_analysis_history'
        let history = []
        
        try {
          const stored = uni.getStorageSync(historyKey)
          if (stored) {
            history = JSON.parse(stored)
          }
        } catch (error) {
          console.error('读取历史记录失败', error)
        }
        
        resolve(history)
      }, 300)
    })
  },

  // 获取推荐商品
  getRecommendedProducts() {
    return new Promise(resolve => {
      setTimeout(() => {
        const recommendedProducts = [
          {
            id: 2001,
            title: '北欧风收纳柜',
            description: '简约实用的收纳解决方案',
            price: 299,
            originalPrice: 399,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            tags: ['收纳', '北欧风']
          },
          {
            id: 2002,
            title: '多功能置物架',
            description: '墙面收纳好帮手',
            price: 159,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            tags: ['收纳', '墙面']
          },
          {
            id: 2003,
            title: '智能感应灯',
            description: '提升空间照明效果',
            price: 89,
            image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            tags: ['照明', '智能']
          }
        ]
        resolve(recommendedProducts)
      }, 300)
    })
  },

  // 获取可用优惠券
  getAvailableCoupons() {
    return new Promise(resolve => {
      setTimeout(() => {
        const coupons = [
          {
            id: 'coupon_1',
            amount: 50,
            minAmount: 299,
            expireTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天后过期
            title: '新用户专享'
          },
          {
            id: 'coupon_2',
            amount: 100,
            minAmount: 599,
            expireTime: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15天后过期
            title: '满减优惠券'
          },
          {
            id: 'coupon_3',
            amount: 20,
            minAmount: 199,
            expireTime: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3天后过期
            title: '限时特惠'
          }
        ]
        resolve(coupons)
      }, 300)
    })
  },

  // 用户登录
  userLogin(loginData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟登录验证
        if (loginData.phone && loginData.code) {
          const userInfo = {
            id: Date.now(),
            phone: loginData.phone,
            nickname: `用户${loginData.phone.slice(-4)}`,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
            desc: '让家更美好',
            isLogin: true,
            loginTime: Date.now()
          }
          
          // 保存用户信息到本地
          try {
            uni.setStorageSync('user_info', JSON.stringify(userInfo))
          } catch (error) {
            console.error('保存用户信息失败', error)
          }
          
          resolve(userInfo)
        } else {
          reject(new Error('手机号或验证码不能为空'))
        }
      }, 1000)
    })
  },

  // 获取用户信息
  getUserInfo() {
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          const stored = uni.getStorageSync('user_info')
          if (stored) {
            const userInfo = JSON.parse(stored)
            resolve(userInfo)
          } else {
            resolve({ isLogin: false })
          }
        } catch (error) {
          console.error('获取用户信息失败', error)
          resolve({ isLogin: false })
        }
      }, 300)
    })
  },

  // 用户退出登录
  userLogout() {
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          uni.removeStorageSync('user_info')
          resolve(true)
        } catch (error) {
          console.error('退出登录失败', error)
          resolve(false)
        }
      }, 300)
    })
  },

  // 获取用户统计数据
  getUserStats() {
    return new Promise(resolve => {
      setTimeout(() => {
        // 模拟用户统计数据
        const stats = {
          orderCount: Math.floor(Math.random() * 10) + 1,
          favoriteCount: Math.floor(Math.random() * 20) + 5,
          designCount: Math.floor(Math.random() * 8) + 2,
          couponCount: Math.floor(Math.random() * 5) + 1
        }
        resolve(stats)
      }, 300)
    })
  },

  // 添加到收藏
  addToFavorites(itemId, itemType = 'solution') {
    return new Promise(resolve => {
      setTimeout(() => {
        const favoritesKey = 'user_favorites'
        let favorites = []
        
        try {
          const stored = uni.getStorageSync(favoritesKey)
          if (stored) {
            favorites = JSON.parse(stored)
          }
        } catch (error) {
          console.error('读取收藏列表失败', error)
        }
        
        // 检查是否已收藏
        const existingIndex = favorites.findIndex(item => item.id === itemId && item.type === itemType)
        
        if (existingIndex === -1) {
          // 添加到收藏
          favorites.unshift({
            id: itemId,
            type: itemType,
            createTime: Date.now()
          })
          
          try {
            uni.setStorageSync(favoritesKey, JSON.stringify(favorites))
            resolve({ success: true, action: 'added' })
          } catch (error) {
            console.error('保存收藏失败', error)
            resolve({ success: false, error: '保存失败' })
          }
        } else {
          // 已存在，取消收藏
          favorites.splice(existingIndex, 1)
          
          try {
            uni.setStorageSync(favoritesKey, JSON.stringify(favorites))
            resolve({ success: true, action: 'removed' })
          } catch (error) {
            console.error('取消收藏失败', error)
            resolve({ success: false, error: '操作失败' })
          }
        }
      }, 300)
    })
  },

  // 获取收藏列表
  getFavorites() {
    return new Promise(async resolve => {
      setTimeout(async () => {
        const favoritesKey = 'user_favorites'
        let favorites = []
        
        try {
          const stored = uni.getStorageSync(favoritesKey)
          if (stored) {
            favorites = JSON.parse(stored)
          }
        } catch (error) {
          console.error('读取收藏列表失败', error)
        }
        
        // 获取收藏项目的详细信息
        const favoriteDetails = []
        for (const favorite of favorites) {
          if (favorite.type === 'solution') {
            const solution = solutions.find(s => s.id === favorite.id)
            if (solution) {
              favoriteDetails.push({
                ...solution,
                favoriteTime: favorite.createTime
              })
            }
          }
        }
        
        resolve(favoriteDetails)
      }, 300)
    })
  },

  // 检查是否已收藏
  checkFavoriteStatus(itemId, itemType = 'solution') {
    return new Promise(resolve => {
      setTimeout(() => {
        const favoritesKey = 'user_favorites'
        let favorites = []
        
        try {
          const stored = uni.getStorageSync(favoritesKey)
          if (stored) {
            favorites = JSON.parse(stored)
          }
        } catch (error) {
          console.error('读取收藏状态失败', error)
        }
        
        const isFavorited = favorites.some(item => item.id === itemId && item.type === itemType)
        resolve(isFavorited)
      }, 100)
    })
  },

  // 添加浏览历史
  addToHistory(itemId, itemType = 'solution') {
    return new Promise(resolve => {
      setTimeout(() => {
        const historyKey = 'browse_history'
        let history = []
        
        try {
          const stored = uni.getStorageSync(historyKey)
          if (stored) {
            history = JSON.parse(stored)
          }
        } catch (error) {
          console.error('读取浏览历史失败', error)
        }
        
        // 移除已存在的记录
        history = history.filter(item => !(item.id === itemId && item.type === itemType))
        
        // 添加到历史记录开头
        history.unshift({
          id: itemId,
          type: itemType,
          viewTime: Date.now()
        })
        
        // 只保留最近50条记录
        if (history.length > 50) {
          history = history.slice(0, 50)
        }
        
        try {
          uni.setStorageSync(historyKey, JSON.stringify(history))
          resolve(true)
        } catch (error) {
          console.error('保存浏览历史失败', error)
          resolve(false)
        }
      }, 100)
    })
  },

  // 获取浏览历史
  getBrowseHistory() {
    return new Promise(resolve => {
      setTimeout(() => {
        const historyKey = 'browse_history'
        let history = []
        
        try {
          const stored = uni.getStorageSync(historyKey)
          if (stored) {
            history = JSON.parse(stored)
          }
        } catch (error) {
          console.error('读取浏览历史失败', error)
        }
        
        // 获取历史项目的详细信息
        const historyDetails = []
        for (const historyItem of history) {
          if (historyItem.type === 'solution') {
            const solution = solutions.find(s => s.id === historyItem.id)
            if (solution) {
              historyDetails.push({
                ...solution,
                viewTime: historyItem.viewTime
              })
            }
          }
        }
        
        resolve(historyDetails)
      }, 300)
    })
  },

  // 清空浏览历史
  clearBrowseHistory() {
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          uni.removeStorageSync('browse_history')
          resolve(true)
        } catch (error) {
          console.error('清空浏览历史失败', error)
          resolve(false)
        }
      }, 300)
    })
  },

  // 发送验证码
  sendVerificationCode(phone) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟发送验证码
        if (phone && /^1[3-9]\d{9}$/.test(phone)) {
          resolve({
            success: true,
            message: '验证码已发送',
            code: '123456' // 模拟验证码，实际应用中不应返回
          })
        } else {
          reject(new Error('手机号格式不正确'))
        }
      }, 1000)
    })
  },

  // 获取订单统计
  getOrderCounts() {
    return new Promise(resolve => {
      setTimeout(() => {
        const counts = {
          pending: Math.floor(Math.random() * 3),
          processing: Math.floor(Math.random() * 2),
          completed: Math.floor(Math.random() * 10) + 5,
          refund: Math.floor(Math.random() * 2)
        }
        resolve(counts)
      }, 300)
    })
  }
} 