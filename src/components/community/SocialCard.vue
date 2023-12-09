<script setup lang="ts">
import type SocialCardProps from "@/components/community/SocialCard";

import { toRefs, onMounted, ref, watch } from "vue";
import { BASE_URL } from "@/utils/config";

import icon_like from "@/assets/icon/ico_likes.png";
import icon_like_active from "@/assets/icon/ico_likes (1).png";
import { getTime } from "@/utils/common";
import { useStore } from "@/stores";

const props = defineProps<SocialCardProps>();

const emit = defineEmits<{
  onIsCollectClick: [isCollect: boolean];
  onIsLikeClick: [isLike: boolean];
}>();

const {
  text,
  imageUrls,
  comments,
  user,
  likes,
  collects,
  isLike,
  isCollect,
  createTime,
} = toRefs(props);

const collectState = ref(0);

const isLikeState = ref(false);

const actionSheetVisible = ref(false);

watch(props, () => {
  isLikeState.value = isLike.value;
  collectState.value = isCollect.value ? 1 : 0;
});

const onLikeTap = () => {
  isLikeState.value = !isLikeState.value;
  emit("onIsLikeClick", isLikeState.value);
};

const onCollectTap = () => {
  emit("onIsCollectClick", collectState.value === 0 ? false : true);
};

const onLongPress = () => {
  if (useStore().userInfo.id === user.value.id) actionSheetVisible.value = true;
};

onMounted(() => {
  collectState.value = isCollect.value ? 1 : 0;
  isLikeState.value = isLike.value;
});
</script>
<template>
  <view class="social-card" @longpress="onLongPress">
    <image
      :lazy-load="true"
      class="custom-avatar"
      :src="user.avatarUrl ? `${BASE_URL}/${user.avatarUrl}` : ''"
    />
    <view class="head">
      <text>{{ user.name }}</text>
      <text class="time">{{ getTime(createTime) }}</text>
    </view>
    <view>&emsp;</view>
    <view class="content roundness">
      <view class="content-text">{{ text }}</view>
      <view
        :class="[
          `content-wrapper`,
          { 'content-wrapper-grid-1': imageUrls.length === 2 },
          { 'content-wrapper-grid-2': imageUrls.length >= 3 },
        ]"
        v-if="imageUrls.length > 0"
      >
        <image
          v-for="(item, index) in imageUrls"
          :class="[
            `content-wrapper__image`,
            { 'content-wrapper__image-full': imageUrls.length > 1 },
            {
              'content-wrapper__image-last':
                imageUrls.length > 4 && index === 3,
            },
          ]"
          :lazy-load="true"
          :src="`${BASE_URL}/${item}`"
        />
        <text v-if="imageUrls.length > 4" class="content-wrapper-over">{{
          `+${imageUrls.length - 4}`
        }}</text>
      </view>
      <view class="content-bottom">
        <text>{{ likes }}</text>
        <image
          class="content-bottom__likes"
          :src="isLikeState ? icon_like_active : icon_like"
          @tap.stop="onLikeTap"
        />
        <text>{{ comments }}&emsp;</text>
        <image
          class="content-bottom__comments"
          src="@/assets/icon/comments.png"
        />
        <text>{{ collects }}&emsp;</text>
        <nut-rate
          v-model="collectState"
          count="1"
          active-color="#ff6b81"
          @tap.stop="onCollectTap"
        />
      </view>
    </view>
  </view>
</template>
<style lang="scss">
.social-card {
  display: grid;
  padding: 20rpx;
  gap: 8rpx;
  color: $text-color;
  grid-template-columns: 70rpx calc(100% - 90rpx);
  grid-template-rows: 70rpx calc(100% - 90rpx);
  align-items: center;
  .head {
    padding: 0 16rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .time {
      color: #696a6d;
    }
  }
  .content {
    padding: 0 10rpx;
    box-shadow: rgba(0, 0, 0, 0.1) 20px 25px 50px 10rpx;
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
      overflow: hidden;
      &-grid-1 {
        display: grid;
        height: 250rpx;
        grid-template-columns: calc(50% - 8rpx) calc(50% - 8rpx);
        grid-template-rows: 240rpx;
        gap: 16rpx;
        overflow: hidden;
      }
      &-grid-2 {
        display: grid;
        height: 500rpx;
        grid-template-columns: calc(50% - 8rpx) calc(50% - 8rpx);
        grid-template-rows: 240rpx 240rpx;
        gap: 16rpx;
        overflow: hidden;
      }
      &__image {
        width: 100%;
        border-radius: 20rpx;
      }
      &__image-full {
        width: 100%;
        height: 100%;
      }
      &__image-last {
        filter: brightness(30%);
      }
      &-over {
        position: relative;
        color: white;
        bottom: 155rpx;
        left: calc(50% - 30rpx);
        font-size: 40rpx;
      }
    }
    &-bottom {
      padding: 10rpx;
      display: flex;
      align-items: center;
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
