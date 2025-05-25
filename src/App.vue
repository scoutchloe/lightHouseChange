<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    // 初始化操作
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
/* 全局样式 */
page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #F6F8FA;
  color: #333;
  box-sizing: border-box;
}

/* 按钮样式 */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 500;
  padding: 10px 16px;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #4F46E5;
  color: white;
  border: none;
}

.btn-outline {
  background-color: white;
  color: #4F46E5;
  border: 1px solid #4F46E5;
}

.btn-block {
  width: 100%;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 14px;
}

/* 标签样式 */
.btn-tag {
  display: inline-block;
  padding: 6px 12px;
  background-color: #f3f4f6;
  border-radius: 16px;
  font-size: 14px;
  color: #4b5563;
  white-space: nowrap;
}

.btn-tag.active {
  background-color: #4F46E5;
  color: white;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 6px;
  margin-bottom: 6px;
}

.tag-primary {
  background-color: #EEF2FF;
  color: #4F46E5;
}

.tag-gray {
  background-color: #F3F4F6;
  color: #4B5563;
}

/* 章节标题 */
.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* 进度条 */
.progress-bar {
  overflow: hidden;
}

/* 页面通用容器 */
.page-container {
  padding: 16px;
  background-color: #F6F8FA;
  min-height: 100vh;
}
</style> 