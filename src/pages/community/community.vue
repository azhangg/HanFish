<script setup lang="ts">
import type { PostType } from "@/models/post/post";

import SocialCard from "@/components/community/SocialCard.vue";
import { ref, reactive, onMounted, computed } from "vue";
import Taro from "@tarojs/taro";
import { getPostReq } from "@/apis/post";
import { useAccount } from "@/hooks/useAccount";
import {
  getUserCollectPostIdsReq,
  addPostCollectReq,
  deletePostCollectReq,
} from "@/apis/postCollect";
import {
  getUserLikePostIdsReq,
  addPostLikeReq,
  deletePostLikeReq,
} from "@/apis/postLike";
import { goLogin } from "@/utils/common";
import { useStore } from "@/stores";

const { refreshUnReadMsgNum } = useStore();

const pagination = reactive({
  page: 1,
  count: 10,
  total: 0,
  search: "",
});

const socialInfos = ref<PostType[]>([]);

const collects = ref<number[]>([]);

const likes = ref<number[]>([]);

const postList = computed(() => {
  return socialInfos.value.map((s) => {
    return {
      ...s,
      isCollect: collects.value.includes(s.id),
      isLike: likes.value.includes(s.id),
    };
  });
});

const onSearchClear = () => (pagination.search = "");

const onSearchClick = () => {
  getPostList();
};

const onAddBtnTap = () => {
  Taro.navigateTo({
    url: "/package/post/add/add",
  });
};

const getPostList = () => {
  getPostReq(pagination, (res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      socialInfos.value = data.data;
      pagination.total = data.total;
    }
  });
  if (useAccount().isLogin) {
    getLikes();
    getCollects();
  }
};

const getCollects = () => {
  getUserCollectPostIdsReq((res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      collects.value = data;
    }
  });
};

const getLikes = () => {
  getUserLikePostIdsReq((res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      likes.value = data;
    }
  });
};

const onColectClick = (isCollect: boolean, postId: number) => {
  if (useAccount().isLogin) {
    isCollect && !collects.value.some((c) => c === postId)
      ? addPostCollectReq(postId, (res) => {
          const { isSuccess } = res.data;
          if (isSuccess) {
            const index = socialInfos.value.findIndex((s) => s.id === postId);
            socialInfos.value[index].collects += 1;
            collects.value.push(postId);
          }
        })
      : deletePostCollectReq(postId, (res) => {
          const { isSuccess } = res.data;
          if (isSuccess) {
            const index = socialInfos.value.findIndex((s) => s.id === postId);
            socialInfos.value[index].collects -= 1;
            collects.value.splice(
              collects.value.findIndex((s) => s === postId),
              1
            );
          }
        });
  } else {
    goLogin();
  }
};

const onLikeClick = (isLike: boolean, postId: number) => {
  if (useAccount().isLogin) {
    isLike
      ? addPostLikeReq(postId, (res) => {
          const { isSuccess } = res.data;
          if (isSuccess) {
            const index = socialInfos.value.findIndex((s) => s.id === postId);
            socialInfos.value[index].likes += 1;
            likes.value.push(postId);
          }
        })
      : deletePostLikeReq(postId, (res) => {
          const { isSuccess } = res.data;
          if (isSuccess) {
            const index = socialInfos.value.findIndex((s) => s.id === postId);
            socialInfos.value[index].likes -= 1;
            likes.value.splice(
              likes.value.findIndex((s) => s === postId),
              1
            );
          }
        });
  } else {
    goLogin();
  }
};

const onPostTap = (id: number, isCollect: boolean, isLike: boolean) => {
  Taro.navigateTo({
    url: `/package/post/detail/detail?id=${id}&isCollect=${isCollect}&isLike=${isLike}`,
  });
};

Taro.usePullDownRefresh(() => {
  pagination.search = "";
  getPostList();
  setTimeout(() => {
    Taro.stopPullDownRefresh();
  }, 1000);
});

Taro.useReachBottom(() => {
  const { count, total } = pagination;
  if (total > count) {
    pagination.count += count;
    getPostList();
  }
});

Taro.useDidShow(() => {
  if (useAccount().isLogin) {
    getLikes();
    getCollects();
  }
  refreshUnReadMsgNum();
});

onMounted(() => {
  getPostList();
});
</script>

<template>
  <view class="community">
    <AtSearchBar
      v-model:value="pagination.search"
      @clear="onSearchClear"
      @action-click="onSearchClick"
    />
    <SocialCard
      v-for="item in postList"
      :id="item.id"
      :imageUrls="item.imgUrls"
      :text="item.text"
      :likes="item.likes"
      :user="item.publisher"
      :comments="item.comments"
      :collects="item.collects"
      :createTime="item.createTime"
      v-model:isLike="item.isLike"
      v-model:isCollect="item.isCollect"
      @on-is-collect-click="(e) => onColectClick(e, item.id)"
      @on-is-like-click="(e) => onLikeClick(e, item.id)"
      @tap="onPostTap(item.id, item.isCollect, item.isLike)"
    />
    <nut-empty v-if="socialInfos.length === 0" description="无数据"></nut-empty>
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
