<template>
  <view class="entry-nav">
    <view class="entry-item" v-for="(entry, index) in entries" :key="index" @click="navigate(entry)">
      <view class="entry-icon" :style="{ backgroundColor: entry.bgColor }">
        <text class="iconfont" :class="'icon-' + entry.icon" :style="{ color: entry.iconColor }"></text>
      </view>
      <text class="entry-text">{{ entry.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EntryNav',
  data() {
    return {
      entries: [
        {
          text: '按空间选择',
          icon: 'home',
          bgColor: '#E8F5E9',
          iconColor: '#22C55E',
          url: '/pages/space-selection/index',
          isTabBar: false
        },
        {
          text: '按问题解决',
          icon: 'question',
          bgColor: '#E3F2FD',
          iconColor: '#3B82F6',
          url: '/pages/problem-diagnosis/index',
          isTabBar: false
        },
        {
          text: '拍照诊断',
          icon: 'camera',
          bgColor: '#F3E8FF',
          iconColor: '#8B5CF6',
          url: '/pages/photo-diagnosis/index',
          isTabBar: true
        },
        {
          text: 'DIY设计',
          icon: 'brush',
          bgColor: '#FEF3C7',
          iconColor: '#F59E0B',
          url: '/pages/diy-design/index',
          isTabBar: false
        }
      ]
    }
  },
  methods: {
    navigate(entry) {
      if (entry.url) {
        if (entry.isTabBar) {
          // tabBar页面使用switchTab
          uni.switchTab({
            url: entry.url
          })
        } else {
          // 普通页面使用navigateTo
          uni.navigateTo({
            url: entry.url
          })
        }
      }
    }
  }
}
</script>

<style>
.entry-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
}

.entry-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.iconfont {
  font-size: 24px;
}

.entry-text {
  font-size: 12px;
  color: #4B5563;
  text-align: center;
}
</style> 