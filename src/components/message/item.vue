<script setup lang="ts">
import a from "@/assets/images/OIP-C (20).jpg";
import { AtBadge } from "taro-ui-vue3";
</script>
<template>
  <view class="message-item">
    <AtBadge :value="10" :maxValue="99">
      <image class="user-avatar" :src="a" />
    </AtBadge>
    <view class="message-item__content">
      <view class="message-box">
        <text class="user-name">张山里斯</text>
        <text class="ellipsis-1 message">
          打撒大厦大厦到拉萨拉拉肥很多凉粉案件路口放大了哈哈喽大厦里的哈利大厦积分哈佛和按计划案件客户啊空间哈看看卡
        </text>
        <text class="time"> 2023/9/4 10:30 </text>
      </view>
      <image class="goods-image" :src="a" />
    </view>
  </view>
</template>
<style lang="scss">
$avatar-size: 100rpx;
$image-size: 125rpx;
$gap: 20rpx;

.message-item {
  padding: 20rpx;
  display: grid;
  grid-template-columns: $avatar-size auto;
  grid-template-rows: $image-size;
  gap: $gap;
  &__content {
    display: grid;
    grid-template-columns: auto $image-size;
    grid-template-rows: $image-size;
    gap: $gap;
    .message-box {
      display: flex;
      flex-direction: column;
      .user-name {
        font-weight: bold;
      }
      .message {
        font-size: 28rpx;
      }
      .time {
        font-size: 24rpx;
      }
      .message,
      .time {
        color: $text-secondary-color;
      }
    }
  }
  .user-avatar {
    height: $avatar-size;
    width: $avatar-size;
    border-radius: 50%;
  }
  .goods-image {
    height: $image-size;
    width: $image-size;
    border-radius: $border-radius;
  }
}
.at-badge__num {
  top: -8rpx;
  right: 4rpx;
}
</style>
