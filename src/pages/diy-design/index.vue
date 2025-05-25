<template>
  <view class="page-container">
    <!-- 工具栏 -->
    <view class="toolbar">
      <view class="tool-group">
        <button 
          class="tool-btn" 
          :class="{ active: currentTool === 'select' }"
          @click="setTool('select')"
        >
          <text class="iconfont icon-cursor"></text>
          <text class="tool-text">选择</text>
        </button>
        <button 
          class="tool-btn" 
          :class="{ active: currentTool === 'furniture' }"
          @click="setTool('furniture')"
        >
          <text class="iconfont icon-sofa"></text>
          <text class="tool-text">家具</text>
        </button>
        <button 
          class="tool-btn" 
          :class="{ active: currentTool === 'measure' }"
          @click="setTool('measure')"
        >
          <text class="iconfont icon-ruler"></text>
          <text class="tool-text">测量</text>
        </button>
      </view>
      
      <view class="action-group">
        <button class="action-btn" @click="undoAction" :disabled="!canUndo">
          <text class="iconfont icon-undo"></text>
        </button>
        <button class="action-btn" @click="redoAction" :disabled="!canRedo">
          <text class="iconfont icon-redo"></text>
        </button>
        <button class="action-btn" @click="clearCanvas">
          <text class="iconfont icon-trash"></text>
        </button>
      </view>
    </view>

    <!-- 设计画布 -->
    <view class="design-canvas" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
      <!-- 网格背景 -->
      <view class="grid-background"></view>
      
      <!-- 房间轮廓 -->
      <view class="room-outline" :style="roomStyle">
        <!-- 已放置的家具 -->
        <view 
          v-for="item in placedItems" 
          :key="item.id"
          class="furniture-item"
          :class="{ selected: selectedItem?.id === item.id }"
          :style="getFurnitureStyle(item)"
          @tap="selectItem(item)"
        >
          <image :src="item.icon" mode="aspectFit" class="furniture-icon" />
          <text class="furniture-name">{{ item.name }}</text>
        </view>
        
        <!-- 测量线 -->
        <view 
          v-for="line in measureLines" 
          :key="line.id"
          class="measure-line"
          :style="getMeasureLineStyle(line)"
        >
          <text class="measure-text">{{ line.length }}cm</text>
        </view>
      </view>
      
      <!-- 拖拽预览 -->
      <view 
        v-if="draggingItem" 
        class="dragging-preview"
        :style="draggingStyle"
      >
        <image :src="draggingItem.icon" mode="aspectFit" class="furniture-icon" />
      </view>
    </view>

    <!-- 家具面板 -->
    <view v-if="currentTool === 'furniture'" class="furniture-panel">
      <view class="panel-header">
        <text class="panel-title">选择家具</text>
        <view class="category-tabs">
          <text 
            v-for="category in furnitureCategories" 
            :key="category.id"
            class="category-tab"
            :class="{ active: currentCategory === category.id }"
            @click="setCategory(category.id)"
          >{{ category.name }}</text>
        </view>
      </view>
      
      <scroll-view class="furniture-list" scroll-y>
        <view 
          v-for="item in currentFurnitureList" 
          :key="item.id"
          class="furniture-option"
          @touchstart="startDragFurniture(item, $event)"
        >
          <image :src="item.icon" mode="aspectFit" class="option-icon" />
          <text class="option-name">{{ item.name }}</text>
          <text class="option-size">{{ item.width }}×{{ item.height }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 属性面板 -->
    <view v-if="selectedItem" class="property-panel">
      <view class="panel-header">
        <text class="panel-title">{{ selectedItem.name }}</text>
        <button class="delete-btn" @click="deleteSelectedItem">
          <text class="iconfont icon-delete"></text>
        </button>
      </view>
      
      <view class="property-list">
        <view class="property-item">
          <text class="property-label">X坐标</text>
          <input 
            type="number" 
            v-model="selectedItem.x" 
            @input="updateItemPosition"
            class="property-input"
          />
        </view>
        <view class="property-item">
          <text class="property-label">Y坐标</text>
          <input 
            type="number" 
            v-model="selectedItem.y" 
            @input="updateItemPosition"
            class="property-input"
          />
        </view>
        <view class="property-item">
          <text class="property-label">旋转角度</text>
          <slider 
            :value="selectedItem.rotation || 0" 
            min="0" 
            max="360" 
            @change="updateItemRotation"
            class="property-slider"
          />
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <button class="action-button secondary" @click="saveDesign">保存设计</button>
      <button class="action-button primary" @click="previewDesign">预览效果</button>
      <button class="action-button secondary" @click="shareDesign">分享设计</button>
    </view>

    <!-- 预览模态框 -->
    <view v-if="showPreview" class="preview-modal" @click="closePreview">
      <view class="preview-content" @click.stop>
        <view class="preview-header">
          <text class="preview-title">设计预览</text>
          <button class="close-btn" @click="closePreview">×</button>
        </view>
        <view class="preview-canvas">
          <!-- 3D预览效果 -->
          <view class="preview-room" :style="previewRoomStyle">
            <view 
              v-for="item in placedItems" 
              :key="item.id"
              class="preview-furniture"
              :style="getPreviewFurnitureStyle(item)"
            >
              <image :src="item.preview3d || item.icon" mode="aspectFit" />
            </view>
          </view>
        </view>
        <view class="preview-actions">
          <button class="preview-btn" @click="exportDesign">导出图片</button>
          <button class="preview-btn primary" @click="generateSolution">生成方案</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '@/api/index.js'

export default {
  data() {
    return {
      currentTool: 'select',
      currentCategory: 1,
      selectedItem: null,
      draggingItem: null,
      draggingStyle: {},
      placedItems: [],
      measureLines: [],
      showPreview: false,
      
      // 画布设置
      canvasWidth: 300,
      canvasHeight: 400,
      gridSize: 10,
      
      // 房间设置
      roomWidth: 400,
      roomHeight: 300,
      
      // 历史记录
      history: [],
      historyIndex: -1,
      
      // 家具分类
      furnitureCategories: [
        { id: 1, name: '沙发' },
        { id: 2, name: '桌椅' },
        { id: 3, name: '床具' },
        { id: 4, name: '收纳' },
        { id: 5, name: '装饰' }
      ],
      
      // 家具库
      furnitureLibrary: {
        1: [ // 沙发
          {
            id: 'sofa_1',
            name: '三人沙发',
            width: 200,
            height: 80,
            icon: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
            preview3d: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          },
          {
            id: 'sofa_2',
            name: '单人沙发',
            width: 80,
            height: 80,
            icon: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
            preview3d: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          }
        ],
        2: [ // 桌椅
          {
            id: 'table_1',
            name: '茶几',
            width: 120,
            height: 60,
            icon: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
            preview3d: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          },
          {
            id: 'chair_1',
            name: '餐椅',
            width: 50,
            height: 50,
            icon: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
            preview3d: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          }
        ],
        3: [ // 床具
          {
            id: 'bed_1',
            name: '双人床',
            width: 180,
            height: 200,
            icon: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
            preview3d: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          }
        ],
        4: [ // 收纳
          {
            id: 'cabinet_1',
            name: '衣柜',
            width: 120,
            height: 60,
            icon: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
            preview3d: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          }
        ],
        5: [ // 装饰
          {
            id: 'plant_1',
            name: '绿植',
            width: 40,
            height: 40,
            icon: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
            preview3d: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          }
        ]
      }
    }
  },
  
  computed: {
    currentFurnitureList() {
      return this.furnitureLibrary[this.currentCategory] || []
    },
    
    roomStyle() {
      return {
        width: this.roomWidth + 'px',
        height: this.roomHeight + 'px'
      }
    },
    
    previewRoomStyle() {
      return {
        width: '100%',
        height: '300px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative'
      }
    },
    
    canUndo() {
      return this.historyIndex > 0
    },
    
    canRedo() {
      return this.historyIndex < this.history.length - 1
    }
  },
  
  onLoad() {
    this.initCanvas()
    this.saveState()
  },
  
  methods: {
    // 初始化画布
    initCanvas() {
      // 获取系统信息设置画布大小
      const systemInfo = uni.getSystemInfoSync()
      this.canvasWidth = systemInfo.windowWidth - 40
      this.canvasHeight = systemInfo.windowHeight - 300
    },
    
    // 设置工具
    setTool(tool) {
      this.currentTool = tool
      this.selectedItem = null
    },
    
    // 设置家具分类
    setCategory(categoryId) {
      this.currentCategory = categoryId
    },
    
    // 开始拖拽家具
    startDragFurniture(item, event) {
      this.draggingItem = { ...item }
      this.updateDraggingPosition(event)
    },
    
    // 触摸开始
    onTouchStart(event) {
      const touch = event.touches[0]
      this.touchStartX = touch.clientX
      this.touchStartY = touch.clientY
      
      if (this.currentTool === 'select') {
        // 检查是否点击了家具
        const clickedItem = this.getItemAtPosition(touch.clientX, touch.clientY)
        if (clickedItem) {
          this.selectedItem = clickedItem
        } else {
          this.selectedItem = null
        }
      }
    },
    
    // 触摸移动
    onTouchMove(event) {
      if (this.draggingItem) {
        this.updateDraggingPosition(event.touches[0])
      }
    },
    
    // 触摸结束
    onTouchEnd(event) {
      if (this.draggingItem) {
        const touch = event.changedTouches[0]
        const canvasRect = this.getCanvasRect()
        
        if (this.isInCanvas(touch.clientX, touch.clientY, canvasRect)) {
          // 放置家具
          const newItem = {
            ...this.draggingItem,
            id: Date.now(),
            x: touch.clientX - canvasRect.left,
            y: touch.clientY - canvasRect.top,
            rotation: 0
          }
          
          this.placedItems.push(newItem)
          this.saveState()
        }
        
        this.draggingItem = null
        this.draggingStyle = {}
      }
    },
    
    // 更新拖拽位置
    updateDraggingPosition(touch) {
      this.draggingStyle = {
        position: 'fixed',
        left: (touch.clientX - 25) + 'px',
        top: (touch.clientY - 25) + 'px',
        zIndex: 1000
      }
    },
    
    // 获取画布矩形
    getCanvasRect() {
      // 简化实现，实际应该使用 uni.createSelectorQuery()
      return {
        left: 20,
        top: 100,
        right: this.canvasWidth + 20,
        bottom: this.canvasHeight + 100
      }
    },
    
    // 检查是否在画布内
    isInCanvas(x, y, canvasRect) {
      return x >= canvasRect.left && x <= canvasRect.right && 
             y >= canvasRect.top && y <= canvasRect.bottom
    },
    
    // 获取指定位置的家具
    getItemAtPosition(x, y) {
      const canvasRect = this.getCanvasRect()
      const relativeX = x - canvasRect.left
      const relativeY = y - canvasRect.top
      
      return this.placedItems.find(item => {
        return relativeX >= item.x && relativeX <= item.x + item.width &&
               relativeY >= item.y && relativeY <= item.y + item.height
      })
    },
    
    // 选择家具
    selectItem(item) {
      this.selectedItem = item
    },
    
    // 删除选中的家具
    deleteSelectedItem() {
      if (this.selectedItem) {
        const index = this.placedItems.findIndex(item => item.id === this.selectedItem.id)
        if (index > -1) {
          this.placedItems.splice(index, 1)
          this.selectedItem = null
          this.saveState()
        }
      }
    },
    
    // 更新家具位置
    updateItemPosition() {
      this.saveState()
    },
    
    // 更新家具旋转
    updateItemRotation(event) {
      if (this.selectedItem) {
        this.selectedItem.rotation = event.detail.value
        this.saveState()
      }
    },
    
    // 获取家具样式
    getFurnitureStyle(item) {
      return {
        position: 'absolute',
        left: item.x + 'px',
        top: item.y + 'px',
        width: item.width + 'px',
        height: item.height + 'px',
        transform: `rotate(${item.rotation || 0}deg)`
      }
    },
    
    // 获取预览家具样式
    getPreviewFurnitureStyle(item) {
      const scaleX = 100 / this.roomWidth
      const scaleY = 100 / this.roomHeight
      
      return {
        position: 'absolute',
        left: (item.x * scaleX) + '%',
        top: (item.y * scaleY) + '%',
        width: (item.width * scaleX) + '%',
        height: (item.height * scaleY) + '%',
        transform: `rotate(${item.rotation || 0}deg)`
      }
    },
    
    // 获取测量线样式
    getMeasureLineStyle(line) {
      return {
        position: 'absolute',
        left: line.x1 + 'px',
        top: line.y1 + 'px',
        width: Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2)) + 'px',
        transform: `rotate(${Math.atan2(line.y2 - line.y1, line.x2 - line.x1)}rad)`
      }
    },
    
    // 保存状态
    saveState() {
      const state = JSON.parse(JSON.stringify(this.placedItems))
      this.history = this.history.slice(0, this.historyIndex + 1)
      this.history.push(state)
      this.historyIndex = this.history.length - 1
    },
    
    // 撤销操作
    undoAction() {
      if (this.canUndo) {
        this.historyIndex--
        this.placedItems = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
        this.selectedItem = null
      }
    },
    
    // 重做操作
    redoAction() {
      if (this.canRedo) {
        this.historyIndex++
        this.placedItems = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
        this.selectedItem = null
      }
    },
    
    // 清空画布
    clearCanvas() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有设计内容吗？',
        success: (res) => {
          if (res.confirm) {
            this.placedItems = []
            this.selectedItem = null
            this.measureLines = []
            this.saveState()
          }
        }
      })
    },
    
    // 保存设计
    async saveDesign() {
      try {
        const designData = {
          items: this.placedItems,
          roomSize: { width: this.roomWidth, height: this.roomHeight },
          createTime: Date.now()
        }
        
        // 保存到本地存储
        const savedDesigns = uni.getStorageSync('saved_designs') || []
        savedDesigns.unshift(designData)
        uni.setStorageSync('saved_designs', savedDesigns)
        
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('保存设计失败', error)
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    },
    
    // 预览设计
    previewDesign() {
      this.showPreview = true
    },
    
    // 关闭预览
    closePreview() {
      this.showPreview = false
    },
    
    // 分享设计
    shareDesign() {
      uni.showActionSheet({
        itemList: ['保存到相册', '分享给朋友', '生成链接'],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.exportDesign()
              break
            case 1:
              this.shareToFriend()
              break
            case 2:
              this.generateShareLink()
              break
          }
        }
      })
    },
    
    // 导出设计
    exportDesign() {
      uni.showToast({
        title: '导出功能开发中',
        icon: 'none'
      })
    },
    
    // 分享给朋友
    shareToFriend() {
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      })
    },
    
    // 生成分享链接
    generateShareLink() {
      uni.showToast({
        title: '链接生成功能开发中',
        icon: 'none'
      })
    },
    
    // 生成解决方案
    generateSolution() {
      uni.showModal({
        title: '生成方案',
        content: '是否根据当前设计生成完整的改造方案？',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/solution-list/index?from=diy'
            })
          }
        }
      })
    }
  }
}
</script>

<style>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
}

.tool-group {
  display: flex;
  gap: 8px;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  background-color: #FFFFFF;
  font-size: 12px;
}

.tool-btn.active {
  background-color: #4F46E5;
  color: #FFFFFF;
  border-color: #4F46E5;
}

.tool-text {
  margin-top: 4px;
  font-size: 10px;
}

.action-group {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:disabled {
  opacity: 0.5;
}

.design-canvas {
  flex: 1;
  position: relative;
  background-color: #F9FAFB;
  margin: 16px;
  border-radius: 12px;
  overflow: hidden;
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(to right, #E5E7EB 1px, transparent 1px),
    linear-gradient(to bottom, #E5E7EB 1px, transparent 1px);
  background-size: 20px 20px;
}

.room-outline {
  position: relative;
  margin: 20px;
  border: 2px solid #374151;
  background-color: rgba(255, 255, 255, 0.8);
}

.furniture-item {
  position: absolute;
  border: 1px solid transparent;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(79, 70, 229, 0.1);
}

.furniture-item.selected {
  border-color: #4F46E5;
  background-color: rgba(79, 70, 229, 0.2);
}

.furniture-icon {
  width: 80%;
  height: 60%;
}

.furniture-name {
  font-size: 10px;
  color: #374151;
  text-align: center;
}

.dragging-preview {
  width: 50px;
  height: 50px;
  opacity: 0.8;
  pointer-events: none;
}

.measure-line {
  height: 1px;
  background-color: #EF4444;
  transform-origin: left center;
}

.measure-text {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #EF4444;
  background-color: #FFFFFF;
  padding: 2px 4px;
  border-radius: 2px;
}

.furniture-panel {
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  height: 200px;
  background-color: #FFFFFF;
  border-top: 1px solid #E5E7EB;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #E5E7EB;
}

.panel-title {
  font-size: 16px;
  font-weight: 500;
  color: #1F2937;
}

.category-tabs {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.category-tab {
  font-size: 14px;
  color: #6B7280;
  padding: 4px 8px;
  border-radius: 4px;
}

.category-tab.active {
  color: #4F46E5;
  background-color: #EEF2FF;
}

.furniture-list {
  height: 140px;
  padding: 8px 16px;
}

.furniture-option {
  display: inline-block;
  width: 80px;
  margin-right: 12px;
  margin-bottom: 8px;
  text-align: center;
}

.option-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: #F3F4F6;
}

.option-name {
  display: block;
  font-size: 12px;
  color: #374151;
  margin-top: 4px;
}

.option-size {
  display: block;
  font-size: 10px;
  color: #9CA3AF;
}

.property-panel {
  position: fixed;
  right: 0;
  top: 60px;
  width: 200px;
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin: 16px;
}

.delete-btn {
  background-color: #EF4444;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
}

.property-list {
  padding: 12px;
}

.property-item {
  margin-bottom: 12px;
}

.property-label {
  display: block;
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 4px;
}

.property-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 14px;
}

.property-slider {
  width: 100%;
}

.bottom-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
  background-color: #FFFFFF;
  border-top: 1px solid #E5E7EB;
}

.action-button {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  border: none;
}

.action-button.secondary {
  background-color: #F3F4F6;
  color: #374151;
}

.action-button.primary {
  background-color: #4F46E5;
  color: #FFFFFF;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-content {
  width: 90%;
  max-width: 500px;
  background-color: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
}

.preview-title {
  font-size: 18px;
  font-weight: 500;
  color: #1F2937;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #F3F4F6;
  color: #6B7280;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-canvas {
  height: 300px;
  background-color: #F9FAFB;
}

.preview-room {
  position: relative;
  margin: 20px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
}

.preview-furniture {
  position: absolute;
}

.preview-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.preview-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background-color: #FFFFFF;
  color: #374151;
  font-size: 14px;
}

.preview-btn.primary {
  background-color: #4F46E5;
  color: #FFFFFF;
  border-color: #4F46E5;
}
</style> 