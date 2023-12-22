<script setup lang="ts">
import type { MessageItemType } from "@/components/message/item";

import { withDefaults, toRefs } from "vue";
import { BASE_URL } from "@/utils/config";
import { getTime } from "@/utils/common";

const props = withDefaults(defineProps<MessageItemType>(), {
  userName: "",
  avatarUrl: "",
  message: "",
  time: () => new Date(),
  goodImgUrl: "",
  unReadNum: 0,
});

const { userName, avatarUrl, message, goodImgUrl, time, unReadNum } =
  toRefs(props);
</script>
<template>
  <view class="message-item">
    <nut-badge :value="unReadNum" :max="99" top="0" right="8">
      <image class="user-avatar" :src="`${BASE_URL}/${avatarUrl}`" />
    </nut-badge>
    <view class="message-item__content">
      <view class="message-box">
        <text class="user-name">{{ userName }}</text>
        <text class="ellipsis-1 message">
          {{ message }}
        </text>
        <text class="time">{{ getTime(time) }}</text>
      </view>
      <image
        v-if="goodImgUrl"
        class="goods-image"
        :src="`${BASE_URL}/${goodImgUrl}`"
      />
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
  border-bottom: 1rpx #f3ecec solid;
  align-items: center;
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
        color: $text-color;
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
