// 通用工具函数

/**
 * 格式化价格
 * @param {number} price 价格
 * @param {boolean} showSymbol 是否显示货币符号
 * @returns {string} 格式化后的价格
 */
export function formatPrice(price, showSymbol = true) {
  if (typeof price !== 'number' || isNaN(price)) {
    return showSymbol ? '¥0' : '0'
  }
  
  const formatted = price.toFixed(2)
  return showSymbol ? `¥${formatted}` : formatted
}

/**
 * 格式化时间
 * @param {number|string|Date} time 时间
 * @param {string} format 格式
 * @returns {string} 格式化后的时间
 */
export function formatTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
  const date = new Date(time)
  
  if (isNaN(date.getTime())) {
    return ''
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 获取相对时间
 * @param {number|string|Date} time 时间
 * @returns {string} 相对时间描述
 */
export function getRelativeTime(time) {
  const now = Date.now()
  const targetTime = new Date(time).getTime()
  const diff = now - targetTime
  
  if (diff < 0) {
    return '未来'
  }
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < month) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`
  } else {
    return `${Math.floor(diff / year)}年前`
  }
}

/**
 * 验证手机号
 * @param {string} phone 手机号
 * @returns {boolean} 是否有效
 */
export function validatePhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email 邮箱
 * @returns {boolean} 是否有效
 */
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} delay 延迟时间
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, delay = 300) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} delay 延迟时间
 * @returns {Function} 节流后的函数
 */
export function throttle(func, delay = 300) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      func.apply(this, args)
    }
  }
}

/**
 * 深拷贝
 * @param {any} obj 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }
  
  if (typeof obj === 'object') {
    const cloned = {}
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key])
    })
    return cloned
  }
  
  return obj
}

/**
 * 生成唯一ID
 * @param {string} prefix 前缀
 * @returns {string} 唯一ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `${prefix}${timestamp}${random}`
}

/**
 * 获取图片尺寸
 * @param {string} src 图片地址
 * @returns {Promise<{width: number, height: number}>} 图片尺寸
 */
export function getImageSize(src) {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: (res) => {
        resolve({
          width: res.width,
          height: res.height
        })
      },
      fail: reject
    })
  })
}

/**
 * 压缩图片
 * @param {string} src 图片地址
 * @param {number} quality 压缩质量 0-1
 * @returns {Promise<string>} 压缩后的图片地址
 */
export function compressImage(src, quality = 0.8) {
  return new Promise((resolve, reject) => {
    uni.compressImage({
      src,
      quality,
      success: (res) => {
        resolve(res.tempFilePath)
      },
      fail: reject
    })
  })
}

/**
 * 选择图片
 * @param {Object} options 选择选项
 * @returns {Promise<Array>} 选择的图片列表
 */
export function chooseImage(options = {}) {
  const defaultOptions = {
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera']
  }
  
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      ...defaultOptions,
      ...options,
      success: (res) => {
        resolve(res.tempFilePaths)
      },
      fail: reject
    })
  })
}

/**
 * 保存图片到相册
 * @param {string} filePath 图片路径
 * @returns {Promise<boolean>} 是否保存成功
 */
export function saveImageToPhotosAlbum(filePath) {
  return new Promise((resolve) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        resolve(true)
      },
      fail: (error) => {
        if (error.errMsg.includes('auth')) {
          uni.showModal({
            title: '提示',
            content: '需要授权访问相册',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting()
              }
            }
          })
        } else {
          uni.showToast({
            title: '保存失败',
            icon: 'none'
          })
        }
        resolve(false)
      }
    })
  })
}

/**
 * 复制到剪贴板
 * @param {string} data 要复制的内容
 * @returns {Promise<boolean>} 是否复制成功
 */
export function copyToClipboard(data) {
  return new Promise((resolve) => {
    uni.setClipboardData({
      data,
      success: () => {
        uni.showToast({
          title: '复制成功',
          icon: 'success'
        })
        resolve(true)
      },
      fail: () => {
        uni.showToast({
          title: '复制失败',
          icon: 'none'
        })
        resolve(false)
      }
    })
  })
}

/**
 * 获取系统信息
 * @returns {Promise<Object>} 系统信息
 */
export function getSystemInfo() {
  return new Promise((resolve, reject) => {
    uni.getSystemInfo({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取网络状态
 * @returns {Promise<Object>} 网络状态
 */
export function getNetworkType() {
  return new Promise((resolve, reject) => {
    uni.getNetworkType({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 震动反馈
 * @param {string} type 震动类型 'short' | 'long'
 */
export function vibrateShort(type = 'short') {
  if (type === 'long') {
    uni.vibrateLong()
  } else {
    uni.vibrateShort()
  }
}

/**
 * 本地存储封装
 */
export const storage = {
  // 设置存储
  set(key, value) {
    try {
      const data = JSON.stringify(value)
      uni.setStorageSync(key, data)
      return true
    } catch (error) {
      console.error('存储失败', error)
      return false
    }
  },
  
  // 获取存储
  get(key, defaultValue = null) {
    try {
      const data = uni.getStorageSync(key)
      return data ? JSON.parse(data) : defaultValue
    } catch (error) {
      console.error('读取存储失败', error)
      return defaultValue
    }
  },
  
  // 删除存储
  remove(key) {
    try {
      uni.removeStorageSync(key)
      return true
    } catch (error) {
      console.error('删除存储失败', error)
      return false
    }
  },
  
  // 清空存储
  clear() {
    try {
      uni.clearStorageSync()
      return true
    } catch (error) {
      console.error('清空存储失败', error)
      return false
    }
  }
}

/**
 * 数组工具
 */
export const arrayUtils = {
  // 数组去重
  unique(arr, key) {
    if (!key) {
      return [...new Set(arr)]
    }
    
    const seen = new Set()
    return arr.filter(item => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  },
  
  // 数组分组
  groupBy(arr, key) {
    return arr.reduce((groups, item) => {
      const group = item[key]
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(item)
      return groups
    }, {})
  },
  
  // 数组排序
  sortBy(arr, key, order = 'asc') {
    return arr.sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (order === 'desc') {
        return bVal > aVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })
  }
}

/**
 * 字符串工具
 */
export const stringUtils = {
  // 截断字符串
  truncate(str, length, suffix = '...') {
    if (str.length <= length) {
      return str
    }
    return str.substring(0, length) + suffix
  },
  
  // 首字母大写
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  
  // 驼峰转下划线
  camelToSnake(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  },
  
  // 下划线转驼峰
  snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
  }
} 