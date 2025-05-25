import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  
  // 添加Pinia状态管理
  const pinia = createPinia()
  app.use(pinia)
  
  return {
    app
  }
} 