<script setup lang="ts">
import type { PostCommentType } from "@/models/post/postComment";

import Comment from "./comment.vue";

import { withDefaults, toRefs, ref } from "vue";
import { BASE_URL } from "@/utils/config";
import { getTime, goPage } from "@/utils/common";

const props = withDefaults(
  defineProps<{ data: PostCommentType[]; publisherId?: number }>(),
  {
    data: () => [],
    publisherId: 0,
  }
);

const emit = defineEmits<{
  onLongPress: [comment: PostCommentType];
  onImgClick: [imgUrl: string];
}>();

const showChildrenList = ref<number[]>([]);

const { data, publisherId } = toRefs(props);

const onOnLongPress = (comment: PostCommentType) => {
  emit("onLongPress", comment);
};

const onImgClick = (url?: string) => {
  if (url) {
    emit("onImgClick", url);
  }
};
</script>
<template>
  <view class="post-comment" v-for="item in data">
    <view class="head">
      <image
        v-if="item.avatarUrl"
        :lazy-load="true"
        :src="`${BASE_URL}/${item.avatarUrl}`"
        @tap="goPage(`/package/user/personal/home?userId=${item.userId}`)"
      />
      <text>
        {{ item.userName }}
      </text>
      <nut-tag v-if="item.userId === publisherId" color="#ff6b81" plain>
        楼主
      </nut-tag>
      <text class="time">
        {{ getTime(item.createTime) }}
      </text>
    </view>
    <view class="post-comment-content">
      <view @longpress="onOnLongPress(item)">
        {{ item.comment }}
      </view>
      <image
        v-if="item.imgUrl"
        :lazy-load="true"
        :src="`${BASE_URL}/${item.imgUrl}`"
        @tap="onImgClick(item.imgUrl)"
      />
    </view>
    <view
      v-if="item.children.length > 0"
      class="mt-2 pl-2 pt-2 pb-3 mr-2 border-#6b7280 border-l-4 border-t-0 border-r-0 border-b-0 border-solid border-opacity-10"
    >
      <Comment
        v-if="showChildrenList.includes(item.id)"
        :data="item.children"
        :publisher-id="publisherId"
        @on-long-press="onOnLongPress"
        @on-img-click="onImgClick"
      />
      <text v-else class="reply" @tap.stop="showChildrenList.push(item.id)">
        {{ item.children.length }}
        回复&gt;
      </text>
    </view>
  </view>
</template>
<style lang="scss">
.post-comment {
  margin-bottom: 32rpx;
  .head {
    display: flex;
    align-items: center;
    gap: 16rpx;
    image {
      height: 65rpx;
      width: 65rpx;
      border-radius: 50%;
    }
    .time {
      color: #696a6d;
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    padding: 0 16rpx;
    image {
      margin-top: 16rpx;
      width: 400rpx;
      height: 400rpx;
      border-radius: 20rpx;
    }
  }
  .reply {
    padding: 8rpx 16rpx;
    background-color: #adb1bb;
    color: white;
    font-size: 24rpx;
    border-radius: 24rpx;
  }
}
</style>
