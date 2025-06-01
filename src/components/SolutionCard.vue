<template>
  <view class="solution-card" @click="goToDetail">
    <image :src="solution.image" mode="aspectFill" class="solution-image" />
    <view class="solution-info">
      <view class="solution-header">
        <text class="solution-title">{{ solution.title }}</text>
        <text class="solution-price">¥{{ solution.price }}</text>
      </view>
      <view class="solution-meta">
        <text class="solution-benefit">{{ solution.benefits }}</text>
        <view class="rating">
          <text>{{ solution.rating }}</text>
          <text class="rating-star">★</text>
        </view>
      </view>
      <view class="solution-tags">
        <text 
          v-for="(tag, index) in solution.tagsArray" 
          :key="index" 
          class="tag" 
          :class="{'tag-primary': index === 0, 'tag-gray': index !== 0}"
        >{{ tag }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SolutionCard',
  props: {
    solution: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToDetail() {
      uni.navigateTo({
        url: `/pages/solution-detail/index?id=${this.solution.id}`
      })
    }
  }
}
</script>

<style>
.solution-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.solution-image {
  width: 100%;
  height: 160px;
}

.solution-info {
  padding: 12px;
}

.solution-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.solution-title {
  font-size: 16px;
  font-weight: 500;
  flex: 1;
}

.solution-price {
  color: #EF4444;
  font-weight: 500;
}

.solution-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #6B7280;
}

.rating {
  display: flex;
  align-items: center;
}

.rating-star {
  color: #F59E0B;
  margin-left: 4px;
}

.solution-tags {
  display: flex;
  flex-wrap: wrap;
}
</style> 