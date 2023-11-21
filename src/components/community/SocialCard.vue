<script setup lang="ts">
import type SocialCardProps from "@/components/community/SocialCard";

const props = defineProps<SocialCardProps>();

const { text, imageUrl, comments, user, likes } = props;
</script>
<template>
  <view class="social-card">
    <image class="custom-avatar" :src="user.avatarUrl ?? ''" />
    <view class="head">
      <text>{{ user.name }}</text>
      <view class="btn-collect">
        <image class="btn-collect-icon" src="@/assets/icon/add(2).png" />
        <text>收藏</text>
      </view>
    </view>
    <view>&emsp;</view>
    <view class="content box-shadow roundness">
      <view class="content-text">{{ text }}</view>
      <view class="content-wrapper" v-if="imageUrl">
        <image class="content-wrapper__image" :src="imageUrl" />
      </view>
      <view class="content-bottom">
        <text>{{ likes }}</text>
        <image
          class="content-bottom__likes"
          src="@/assets/icon/ico_likes.png"
        />
        <text>{{ comments }}&emsp;</text>
        <image
          class="content-bottom__comments"
          src="@/assets/icon/comments.png"
        />
      </view>
    </view>
  </view>
</template>
<style lang="scss">
.social-card {
  display: grid;
  padding: 20rpx;
  color: $text-color;
  grid-template-columns: 70rpx calc(100% - 90rpx);
  grid-template-rows: 70rpx calc(100% - 90rpx);
  align-items: center;
  .head {
    padding: 0 10rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn-collect {
      padding: 10rpx;
      background-color: $ashen;
      border-radius: $border-radius;
      font-size: 27rpx;
      display: flex;
      align-items: center;
      &-icon {
        height: 30rpx;
        width: 30rpx;
        margin-right: 5rpx;
      }
    }
  }
  .content {
    padding: 0 10rpx;
    &-text {
      margin: 20rpx 10rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 3;
      text-overflow: ellipsis;
    }
    &-wrapper {
      margin: 0 10rpx;
      border-radius: $border-radius;
      overflow: hidden;
      &__image {
        width: 100%;
      }
    }
    &-bottom {
      padding: 10rpx;
      display: flex;
      align-items: self-end;
      flex-flow: row-reverse;
      &__comments {
        height: 50rpx;
        width: 50rpx;
      }
      &__likes {
        height: 40rpx;
        width: 40rpx;
        margin-right: 5rpx;
      }
    }
  }
}
</style>
