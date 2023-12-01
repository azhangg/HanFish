<script setup lang="ts">
import type SocialCardProps from "@/components/community/SocialCard";

import SocialCard from "@/components/community/SocialCard.vue";
import { ref, reactive } from "vue";
import { DEFAULT_AVATAR } from "@/utils/config";

const socialInfos = ref<SocialCardProps[]>([
  {
    id: 1,
    text: "的撒大好的记录卡积分单发你打了的阿拉冷淡爱德华把订单哈播撒到拉萨表达了卡萨丁撒开绿灯吧撒肯定撒看德国撒娇的吧啊 近两年打赏",
    imageUrls: [DEFAULT_AVATAR, DEFAULT_AVATAR],
    comments: 539,
    likes: 88,
    collects: 666,
    isLike: true,
    isCollect: true,
    createTime: "2023-12-1",
    user: {
      id: 1,
      avatarUrl: "../../assets/images/OIP-C (6).jpg",
      name: "张三封",
    },
  },
  {
    id: 2,
    text: "娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏",
    imageUrls: [DEFAULT_AVATAR],
    comments: 539,
    likes: 88,
    collects: 583,
    isLike: false,
    isCollect: false,
    createTime: "2023-12-1",
    user: {
      id: 1,
      avatarUrl: "../../assets/images/OIP-C (6).jpg",
      name: "张四封",
    },
  },
  {
    id: 3,
    text: "娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏",
    imageUrls: [DEFAULT_AVATAR, DEFAULT_AVATAR, DEFAULT_AVATAR],
    comments: 539,
    likes: 88,
    collects: 583,
    isLike: false,
    isCollect: false,
    createTime: "2023-12-1",
    user: {
      id: 1,
      avatarUrl: "../../assets/images/OIP-C (6).jpg",
      name: "张四封",
    },
  },
  {
    id: 4,
    text: "娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏",
    imageUrls: [DEFAULT_AVATAR, DEFAULT_AVATAR, DEFAULT_AVATAR, DEFAULT_AVATAR],
    comments: 539,
    likes: 88,
    collects: 583,
    isLike: false,
    isCollect: false,
    createTime: "2023-12-1",
    user: {
      id: 1,
      avatarUrl: "../../assets/images/OIP-C (6).jpg",
      name: "张四封",
    },
  },
  {
    id: 5,
    text: "娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏娇的吧啊 近两年打赏",
    imageUrls: [
      DEFAULT_AVATAR,
      DEFAULT_AVATAR,
      DEFAULT_AVATAR,
      DEFAULT_AVATAR,
      DEFAULT_AVATAR,
    ],
    comments: 539,
    likes: 88,
    collects: 583,
    isLike: false,
    isCollect: false,
    createTime: "2023-12-1",
    user: {
      id: 1,
      avatarUrl: "../../assets/images/OIP-C (6).jpg",
      name: "张四封",
    },
  },
]);

const pagination = reactive({
  page: 1,
  count: 10,
  total: 0,
  search: "",
});

const onSearchClear = () => (pagination.search = "");

const onSearchClick = () => {
  console.log(123);
};

const onAddBtnTap = () => {
  console.log(123);
};
</script>

<template>
  <view class="community">
    <AtSearchBar
      v-model:value="pagination.search"
      placeholder="发帖人/内容"
      @clear="onSearchClear"
      @action-click="onSearchClick"
    />
    <SocialCard
      v-for="item in socialInfos"
      :id="item.id"
      :imageUrls="item.imageUrls"
      :text="item.text"
      :likes="item.likes"
      :user="item.user"
      :comments="item.comments"
      :collects="item.collects"
      :createTime="item.createTime"
      v-model:isLike="item.isLike"
      v-model:isCollect="item.isCollect"
    />
    <movable-area>
      <movable-view direction="all" x="600rpx" y="1150rpx" @tap="onAddBtnTap">
        <view class="container">
          <image class="img" src="@/assets/icon/home_add.png" />
        </view>
      </movable-view>
    </movable-area>
  </view>
</template>

<style lang="scss">
movable-area {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  movable-view {
    position: fixed;
    bottom: 20rpx;
    right: 20rpx;
    width: 100rpx;
    height: 100rpx;
    pointer-events: auto;
    .container {
      height: 100rpx;
      width: 100rpx;
      border-radius: 50%;
      background-color: $primary;
      display: flex;
      align-items: center;
      justify-content: center;
      &:active {
        background-color: $primary;
      }
      .img {
        width: 65%;
        height: 65%;
      }
    }
  }
}
movable-area {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  movable-view {
    position: fixed;
    bottom: 20rpx;
    right: 20rpx;
    width: 100rpx;
    height: 100rpx;
    pointer-events: auto;
    .container {
      height: 100rpx;
      width: 100rpx;
      border-radius: 50%;
      background-color: $primary;
      display: flex;
      align-items: center;
      justify-content: center;
      &:active {
        background-color: $primary;
      }
      .img {
        width: 65%;
        height: 65%;
      }
    }
  }
}
</style>
