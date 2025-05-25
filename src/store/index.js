import { defineStore } from 'pinia'

// 用户状态管理
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    isLoggedIn: false,
  }),
  actions: {
    login(userInfo) {
      this.userInfo = userInfo
      this.isLoggedIn = true
    },
    logout() {
      this.userInfo = null
      this.isLoggedIn = false
    }
  }
})

// 购物车状态管理
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    totalPrice: 0
  }),
  getters: {
    cartCount: (state) => state.items.length,
    formattedTotalPrice: (state) => `¥${state.totalPrice.toFixed(2)}`
  },
  actions: {
    addToCart(item) {
      const existingItem = this.items.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.items.push({
          ...item,
          quantity: 1
        })
      }
      this.calculateTotal()
    },
    removeFromCart(itemId) {
      this.items = this.items.filter(item => item.id !== itemId)
      this.calculateTotal()
    },
    updateQuantity(itemId, quantity) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        item.quantity = quantity
      }
      this.calculateTotal()
    },
    calculateTotal() {
      this.totalPrice = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
    clearCart() {
      this.items = []
      this.totalPrice = 0
    }
  }
})

// 空间与问题状态管理
export const useDiagnosisStore = defineStore('diagnosis', {
  state: () => ({
    selectedSpace: null,
    selectedProblems: [],
    photoUrl: null
  }),
  actions: {
    setSelectedSpace(space) {
      this.selectedSpace = space
    },
    addProblem(problem) {
      if (!this.selectedProblems.some(p => p.id === problem.id)) {
        this.selectedProblems.push(problem)
      }
    },
    removeProblem(problemId) {
      this.selectedProblems = this.selectedProblems.filter(p => p.id !== problemId)
    },
    clearProblems() {
      this.selectedProblems = []
    },
    setPhotoUrl(url) {
      this.photoUrl = url
    },
    reset() {
      this.selectedSpace = null
      this.selectedProblems = []
      this.photoUrl = null
    }
  }
})

// 全局状态管理
import { api } from '@/api/mock.js'

class Store {
  constructor() {
    this.state = {
      // 用户信息
      userInfo: {
        isLogin: false,
        id: null,
        nickname: '',
        avatar: '',
        phone: '',
        desc: ''
      },
      
      // 用户统计
      userStats: {
        orderCount: 0,
        favoriteCount: 0,
        designCount: 0,
        couponCount: 0
      },
      
      // 购物车状态
      cartCount: 0,
      
      // 收藏状态缓存
      favoriteCache: new Map(),
      
      // 页面加载状态
      loading: false
    }
    
    // 监听器
    this.listeners = new Map()
    
    // 初始化
    this.init()
  }
  
  // 初始化状态
  async init() {
    try {
      // 加载用户信息
      const userInfo = await api.getUserInfo()
      this.setState('userInfo', userInfo)
      
      if (userInfo.isLogin) {
        // 加载用户统计
        const userStats = await api.getUserStats()
        this.setState('userStats', userStats)
      }
      
      // 加载购物车数量
      this.updateCartCount()
      
    } catch (error) {
      console.error('初始化状态失败', error)
    }
  }
  
  // 设置状态
  setState(key, value) {
    const oldValue = this.state[key]
    this.state[key] = value
    
    // 通知监听器
    this.notifyListeners(key, value, oldValue)
  }
  
  // 获取状态
  getState(key) {
    return key ? this.state[key] : this.state
  }
  
  // 添加监听器
  addListener(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, [])
    }
    this.listeners.get(key).push(callback)
    
    // 返回取消监听的函数
    return () => {
      const listeners = this.listeners.get(key)
      if (listeners) {
        const index = listeners.indexOf(callback)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }
  }
  
  // 通知监听器
  notifyListeners(key, newValue, oldValue) {
    const listeners = this.listeners.get(key)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(newValue, oldValue)
        } catch (error) {
          console.error('监听器执行失败', error)
        }
      })
    }
  }
  
  // 用户登录
  async login(loginData) {
    try {
      this.setState('loading', true)
      const userInfo = await api.userLogin(loginData)
      this.setState('userInfo', userInfo)
      
      // 加载用户统计
      const userStats = await api.getUserStats()
      this.setState('userStats', userStats)
      
      return userInfo
    } catch (error) {
      throw error
    } finally {
      this.setState('loading', false)
    }
  }
  
  // 用户退出登录
  async logout() {
    try {
      await api.userLogout()
      this.setState('userInfo', { isLogin: false })
      this.setState('userStats', {
        orderCount: 0,
        favoriteCount: 0,
        designCount: 0,
        couponCount: 0
      })
      
      // 清空缓存
      this.favoriteCache.clear()
      
      return true
    } catch (error) {
      console.error('退出登录失败', error)
      return false
    }
  }
  
  // 更新购物车数量
  updateCartCount() {
    try {
      const cartItems = uni.getStorageSync('cart_items') || []
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)
      this.setState('cartCount', count)
    } catch (error) {
      console.error('更新购物车数量失败', error)
    }
  }
  
  // 添加到购物车
  addToCart(item) {
    try {
      let cartItems = uni.getStorageSync('cart_items') || []
      const existingIndex = cartItems.findIndex(cartItem => cartItem.id === item.id)
      
      if (existingIndex > -1) {
        cartItems[existingIndex].quantity += item.quantity || 1
      } else {
        cartItems.push({
          ...item,
          quantity: item.quantity || 1,
          selected: true,
          addTime: Date.now()
        })
      }
      
      uni.setStorageSync('cart_items', cartItems)
      this.updateCartCount()
      
      return true
    } catch (error) {
      console.error('添加到购物车失败', error)
      return false
    }
  }
  
  // 切换收藏状态
  async toggleFavorite(itemId, itemType = 'solution') {
    try {
      const result = await api.addToFavorites(itemId, itemType)
      
      if (result.success) {
        // 更新缓存
        const cacheKey = `${itemType}_${itemId}`
        this.favoriteCache.set(cacheKey, result.action === 'added')
        
        // 更新用户统计
        if (this.state.userInfo.isLogin) {
          const userStats = await api.getUserStats()
          this.setState('userStats', userStats)
        }
      }
      
      return result
    } catch (error) {
      console.error('切换收藏状态失败', error)
      return { success: false, error: '操作失败' }
    }
  }
  
  // 检查收藏状态
  async checkFavoriteStatus(itemId, itemType = 'solution') {
    const cacheKey = `${itemType}_${itemId}`
    
    // 先检查缓存
    if (this.favoriteCache.has(cacheKey)) {
      return this.favoriteCache.get(cacheKey)
    }
    
    try {
      const isFavorited = await api.checkFavoriteStatus(itemId, itemType)
      this.favoriteCache.set(cacheKey, isFavorited)
      return isFavorited
    } catch (error) {
      console.error('检查收藏状态失败', error)
      return false
    }
  }
  
  // 添加浏览历史
  async addToHistory(itemId, itemType = 'solution') {
    try {
      await api.addToHistory(itemId, itemType)
    } catch (error) {
      console.error('添加浏览历史失败', error)
    }
  }
  
  // 显示加载状态
  showLoading(title = '加载中...') {
    this.setState('loading', true)
    uni.showLoading({ title })
  }
  
  // 隐藏加载状态
  hideLoading() {
    this.setState('loading', false)
    uni.hideLoading()
  }
  
  // 显示成功提示
  showSuccess(title, duration = 2000) {
    uni.showToast({
      title,
      icon: 'success',
      duration
    })
  }
  
  // 显示错误提示
  showError(title, duration = 2000) {
    uni.showToast({
      title,
      icon: 'none',
      duration
    })
  }
}

// 创建全局实例
const store = new Store()

export default store 