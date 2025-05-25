// 页面导航工具类
import store from '@/store/index.js'

class Navigation {
  constructor() {
    // 页面路径映射
    this.routes = {
      home: '/pages/home/index',
      spaceSelection: '/pages/space-selection/index',
      problemDiagnosis: '/pages/problem-diagnosis/index',
      solutionList: '/pages/solution-list/index',
      solutionDetail: '/pages/solution-detail/index',
      photoDiagnosis: '/pages/photo-diagnosis/index',
      diyDesign: '/pages/diy-design/index',
      cart: '/pages/cart/index',
      profile: '/pages/profile/index'
    }

    // tabBar页面列表
    this.tabBarPages = [
      '/pages/home/index',
      '/pages/solution-list/index',
      '/pages/photo-diagnosis/index',
      '/pages/profile/index'
    ]
  }
  
  // 跳转到首页
  toHome() {
    uni.switchTab({
      url: this.routes.home
    })
  }
  
  // 跳转到空间选择页
  toSpaceSelection(params = {}) {
    const url = this.buildUrl(this.routes.spaceSelection, params)
    uni.navigateTo({ url })
  }
  
  // 跳转到问题诊断页
  toProblemDiagnosis(spaceId, spaceName) {
    const params = { spaceId, spaceName }
    const url = this.buildUrl(this.routes.problemDiagnosis, params)
    uni.navigateTo({ url })
  }
  
  // 跳转到方案列表页
  toSolutionList(params = {}) {
    // 方案列表是tabBar页面，使用switchTab
    if (Object.keys(params).length === 0) {
      uni.switchTab({
        url: this.routes.solutionList
      })
    } else {
      // 如果有参数，需要先跳转再传递参数
      uni.switchTab({
        url: this.routes.solutionList,
        success: () => {
          // 通过事件或store传递参数
          uni.$emit('solutionListParams', params)
        }
      })
    }
  }
  
  // 跳转到方案详情页
  toSolutionDetail(solutionId, fromPage = '') {
    // 添加浏览历史
    store.addToHistory(solutionId, 'solution')
    
    const params = { id: solutionId }
    if (fromPage) {
      params.from = fromPage
    }
    
    const url = this.buildUrl(this.routes.solutionDetail, params)
    uni.navigateTo({ url })
  }
  
  // 跳转到拍照诊断页
  toPhotoDiagnosis() {
    // 拍照诊断是tabBar页面，使用switchTab
    uni.switchTab({
      url: this.routes.photoDiagnosis
    })
  }
  
  // 跳转到DIY设计页
  toDiyDesign(params = {}) {
    const url = this.buildUrl(this.routes.diyDesign, params)
    uni.navigateTo({ url })
  }
  
  // 跳转到购物车页
  toCart() {
    // 购物车不是tabBar页面，使用navigateTo
    uni.navigateTo({
      url: this.routes.cart
    })
  }
  
  // 跳转到个人中心页
  toProfile() {
    uni.switchTab({
      url: this.routes.profile
    })
  }
  
  // 跳转到登录页（如果需要）
  toLogin(redirectUrl = '') {
    const params = redirectUrl ? { redirect: redirectUrl } : {}
    const url = this.buildUrl('/pages/login/index', params)
    uni.navigateTo({ url })
  }
  
  // 构建URL参数
  buildUrl(path, params = {}) {
    if (Object.keys(params).length === 0) {
      return path
    }
    
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
    
    return `${path}?${queryString}`
  }
  
  // 解析URL参数
  parseQuery(query = '') {
    if (!query) return {}
    
    const params = {}
    query.split('&').forEach(param => {
      const [key, value] = param.split('=')
      if (key && value) {
        params[decodeURIComponent(key)] = decodeURIComponent(value)
      }
    })
    
    return params
  }
  
  // 返回上一页
  goBack(delta = 1) {
    uni.navigateBack({ delta })
  }
  
  // 重定向到指定页面
  redirectTo(path, params = {}) {
    const url = this.buildUrl(path, params)
    uni.redirectTo({ url })
  }
  
  // 重新加载当前页面
  reLaunch(path, params = {}) {
    const url = this.buildUrl(path, params)
    uni.reLaunch({ url })
  }
  
  // 预加载页面
  preloadPage(path) {
    uni.preloadPage({ url: path })
  }
  
  // 检查是否需要登录
  checkLoginRequired(callback) {
    const userInfo = store.getState('userInfo')
    
    if (!userInfo.isLogin) {
      uni.showModal({
        title: '提示',
        content: '此功能需要登录后使用',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 获取当前页面路径作为登录后的重定向地址
            const pages = getCurrentPages()
            const currentPage = pages[pages.length - 1]
            const redirectUrl = `/${currentPage.route}`
            
            this.toLogin(redirectUrl)
          }
        }
      })
      return false
    }
    
    if (callback) {
      callback()
    }
    return true
  }
  
  // 分享页面
  sharePage(title, path, imageUrl = '') {
    return {
      title,
      path,
      imageUrl
    }
  }
  
  // 获取页面参数（在页面的onLoad中使用）
  getPageParams(options) {
    const params = {}
    
    // 处理页面参数
    Object.keys(options).forEach(key => {
      let value = options[key]
      
      // 尝试解析JSON字符串
      if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        try {
          value = JSON.parse(decodeURIComponent(value))
        } catch (error) {
          // 解析失败，保持原值
        }
      }
      
      params[key] = value
    })
    
    return params
  }
  
  // 设置页面标题
  setPageTitle(title) {
    uni.setNavigationBarTitle({ title })
  }
  
  // 显示页面加载状态
  showPageLoading(title = '加载中...') {
    store.showLoading(title)
  }
  
  // 隐藏页面加载状态
  hidePageLoading() {
    store.hideLoading()
  }

  // 通用页面跳转方法
  navigateTo(path, params = {}) {
    const url = this.buildUrl(path, params)
    
    // 检查是否为tabBar页面
    if (this.tabBarPages.includes(path)) {
      if (Object.keys(params).length === 0) {
        uni.switchTab({ url: path })
      } else {
        // tabBar页面有参数时的处理
        uni.switchTab({
          url: path,
          success: () => {
            // 通过事件传递参数
            uni.$emit('tabBarParams', { path, params })
          }
        })
      }
    } else {
      uni.navigateTo({ url })
    }
  }
}

// 创建全局实例
const navigation = new Navigation()

export default navigation

// 导出常用方法
export const {
  toHome,
  toSpaceSelection,
  toProblemDiagnosis,
  toSolutionList,
  toSolutionDetail,
  toPhotoDiagnosis,
  toDiyDesign,
  toCart,
  toProfile,
  toLogin,
  goBack,
  checkLoginRequired,
  getPageParams,
  setPageTitle,
  showPageLoading,
  hidePageLoading
} = navigation 