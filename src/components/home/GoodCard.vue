<script lang="ts" setup>
import type GoodCardProps from "@/components/home/GoodCard.d.ts";
import { AtTag } from "taro-ui-vue3";
import { BASE_URL } from "@/utils/config";
import { toRefs } from "vue";

const props = defineProps<GoodCardProps>();

const { imgUrl, tags, price, description, user } = toRefs(props);
</script>
<template>
  <view class="good-card">
    <image :src="imgUrl" :lazy-load="true" />
    <view class="good-card-description">
      {{ description }}
    </view>
    <AtTag v-for="item in tags" circle size="small">{{ item }}</AtTag>
    <view class="good-card-info">
      <view class="good-card-info-price">
        <text class="sub">¥</text>
        {{ price }}
      </view>
      <view class="good-card-info-user">
        <image class="custom-avatar" :src="`${BASE_URL}/${user.avatarUrl}`" />
        <text class="user-name">{{ user.name }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.good-card {
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: $box-shadow;
  margin-bottom: 30rpx;
  image {
    width: 100%;
  }
  &-description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    margin: 0 10rpx 10rpx 10rpx;
    overflow: hidden;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    color: $text-color;
  }
  &-info {
    padding: 10rpx 20rpx;
    display: flex;
    flex-direction: column;
    button {
      color: white;
      background-color: $primary;
      margin: 0;
      padding: 0 20rpx;
    }
    button:active {
      background-color: $secondary;
    }
    &-price {
      font-size: 35rpx;
      font-weight: bold;
      color: $primary;
    }
    &-user {
      margin-top: 10rpx;
      display: flex;
      align-items: center;
      .user-name {
        color: $text-color;
        width: 220rpx;
        margin-left: 10rpx;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .at-tag {
    color: $primary;
    padding: 0 20rpx;
    border-color: $primary;
    margin: 0 0 0 15rpx;
  }
}
.sub {
  font-size: 26rpx;
  vertical-align: bottom;
}
</style>
