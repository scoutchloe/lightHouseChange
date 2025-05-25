<template>
  <view class="swiper-container">
    <swiper
      class="swiper"
      :indicator-dots="true"
      indicator-active-color="#ffffff"
      indicator-color="rgba(255, 255, 255, 0.5)"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      :circular="true"
    >
      <swiper-item v-for="(item, index) in items" :key="index" @click="handleClick(item)">
        <view class="swiper-item">
          <image :src="item.image" mode="aspectFill" class="slide-image" />
          <view class="slide-info">
            <text class="slide-title">{{ item.title }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'CommonSwiper',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleClick(item) {
      if (item.isTabBar) {
        uni.switchTab({
          url: item.link
        })
      } else {
        uni.navigateTo({
          url: item.link
        })
      }
    }
  }
}
</script>

<style>
.swiper-container {
  width: 100%;
  height: 160px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-item {
  width: 100%;
  height: 100%;
  position: relative;
}

.slide-image {
  width: 100%;
  height: 100%;
}

.slide-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 16px;
}

.slide-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
}
</style> 