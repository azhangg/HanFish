<script setup lang="ts">
import type { UserType } from "@/models/user/user";
import type { PostType } from "@/models/post/post";
import type { GoodAppraiseType } from "@/models/good/goodAppraise";

import { ref, onBeforeMount } from "vue";
import { BASE_URL } from "@/utils/config";
import { getUserInfoByUserIdReq } from "@/apis/user";
import Taro from "@tarojs/taro";
import { useStore } from "@/stores";
import { getTime, msg, goPage } from "@/utils/common";
import {
  getPostsByUserIdReq,
  getUserCollectedPostsReq,
  getUserLikedPostsReq,
  deletePostReq,
  getUserCommunityDataReq,
} from "@/apis/post";
import {
  deletePostCollectReq,
  getUserCollectPostIdsReq,
} from "@/apis/postCollect";
import { deletePostLikeReq, getUserLikePostIdsReq } from "@/apis/postLike";
import { getGoodAppraisesReq } from "@/apis/goodAppraise";

import { IconFont } from "@nutui/icons-vue-taro";

let x = 0;

let y = 0;

const { userInfo } = useStore();

const userId = ref(0);

const active = ref(0);

const operatingPostId = ref(0);

const postsNum = ref(0);

const overlayVisible = ref(false);

const lock = ref(true);

const posts = ref<PostType[]>([]);

const collects = ref<number[]>([]);

const likes = ref<number[]>([]);

const communityData = ref({
  appraiseNum: 0,
  postNum: 0,
  bePraiseNum: 0,
  collectNum: 0,
});

const goodAppraises = ref<GoodAppraiseType[]>([]);

const user = ref<UserType>({
  id: 0,
  name: "",
  loginName: "",
  roleId: 3,
  createTime: new Date(),
});

const getUserInfo = (success?: () => void) => {
  getUserInfoByUserIdReq(userId.value, (res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      user.value = data;
      if (success) success();
    }
  });
};

const getPersonalInfo = (active: number) => {
  switch (active) {
    case 0:
      getGoodAppraisesReq(user.value.id, (res) => {
        const { isSuccess, data } = res.data;
        if (isSuccess) {
          goodAppraises.value = data;
        }
      });

      break;
    case 1:
      getPostsByUserIdReq(user.value.id, (res) => {
        const { isSuccess, data } = res.data;
        if (isSuccess) {
          posts.value = data;
          postsNum.value = data.length;
        }
      });
      break;
    case 2:
      getUserLikedPostsReq(user.value.id, (res) => {
        const { isSuccess, data } = res.data;
        if (isSuccess) {
          posts.value = data;
        }
      });
      break;
    case 3:
      getUserCollectedPostsReq(user.value.id, (res) => {
        const { isSuccess, data } = res.data;
        if (isSuccess) {
          posts.value = data;
        }
      });
      break;
  }
  getLikes();
  getCollects();
  getUserCommunityData();
};

const getUserCommunityData = () => {
  getUserCommunityDataReq(userId.value, (res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      communityData.value = data;
    }
  });
};

const getCollects = () => {
  getUserCollectPostIdsReq((res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      collects.value = data;
    }
  }, userId.value);
};

const getLikes = () => {
  getUserLikePostIdsReq((res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      likes.value = data;
    }
  }, userId.value);
};

const onTabSwitch = (_, index) => {
  getPersonalInfo(index);
};

const onMoreClick = (postId: number, e) => {
  operatingPostId.value = postId;
  const { touches } = e;
  x = Math.floor(touches[0].clientX);
  y = Math.floor(touches[0].clientY) + 30;
  overlayVisible.value = true;
};

const onDeleteMessageTap = () => {
  switch (active.value) {
    case 1:
      deletePostReq(operatingPostId.value, (res) => {
        const { isSuccess } = res.data;
        if (isSuccess) {
          msg("已删除帖子");
          getPersonalInfo(active.value);
        }
      });
      break;
    case 2:
      deletePostLikeReq(operatingPostId.value, (res) => {
        const { isSuccess } = res.data;
        if (isSuccess) {
          msg("已取消点赞");
          getPersonalInfo(active.value);
        }
      });
      break;
    case 3:
      deletePostCollectReq(operatingPostId.value, (res) => {
        const { isSuccess } = res.data;
        if (isSuccess) {
          msg("已取消收藏");
          getPersonalInfo(active.value);
        }
      });
      break;
  }
  getUserCommunityData();
  overlayVisible.value = false;
};

const onPostTap = (id: number, isCollect: boolean, isLike: boolean) => {
  goPage(
    `/package/post/detail/detail?id=${id}&isCollect=${isCollect}&isLike=${isLike}`
  );
};

const onidleGoodClick = () => {
  goPage(`/package/user/personal/idleGood?userId=${user.value.id}`);
};

Taro.useDidShow(() => {
  if (!lock.value) {
    getPersonalInfo(active.value);
  }
});

onBeforeMount(() => {
  const userIdFromRouter = Taro.useRouter().params.userId;
  const curr = Taro.useRouter().params.active;
  if (userId) userId.value = Number(userIdFromRouter);
  if (curr) active.value = Number.isNaN(Number(curr)) ? 0 : Number(curr);
  getUserInfo(() => {
    Taro.setNavigationBarTitle({
      title: `${
        userId.value == userInfo.id ? "个人" : user.value.name + "的"
      }主页`,
    });
    lock.value = false;
    getPersonalInfo(active.value);
  });
});
</script>

<template>
  <view class="personal-home">
    <view class="flex flex-gap-2 p-2">
      <view class="flex flex-gap-2 items-center">
        <image
          v-if="user.avatarUrl"
          class="h100 w-100 rounded-50rpx"
          :src="`${BASE_URL}/${user.avatarUrl}`"
        />
        <text class="max-w-230 line-clamp-1">
          {{ user.name }}
        </text>
      </view>
      <view class="flex-1 flex flex-col flex-gap-2 p-2">
        <view class="flex flex-gap-2 justify-around text-#827171 text-28">
          <view class="flex flex-col flex-gap-1 text-center">
            <view>交易</view>
            <text>{{ communityData.appraiseNum }}</text>
          </view>
          <view class="flex flex-col flex-gap-1 text-center">
            <view>帖子</view>
            <text>{{ communityData.postNum }}</text>
          </view>
          <view class="flex flex-col flex-gap-1 text-center">
            <view>获赞</view>
            <text>{{ communityData.bePraiseNum }}</text>
          </view>
          <view class="flex flex-col flex-gap-1 text-center">
            <view>收藏</view>
            <text>{{ communityData.collectNum }}</text>
          </view>
        </view>
        <nut-button
          v-if="user.id != 0 && userInfo.id === user.id"
          type="primary"
          size="small"
          @click="goPage(`/package/user/personal/edit`)"
        >
          编辑资料
        </nut-button>
        <nut-button
          v-if="user.id != 0 && userInfo.id != user.id"
          type="info"
          size="small"
          @click="onidleGoodClick"
        >
          闲置物品
        </nut-button>
      </view>
    </view>
    <nut-tabbar
      v-model="active"
      :unactive-color="'#aaa'"
      :active-color="'#ff6b81'"
      @tab-switch="onTabSwitch"
    >
      <nut-tabbar-item tab-title="交易" />
      <nut-tabbar-item tab-title="帖子" />
      <nut-tabbar-item tab-title="点赞" />
      <nut-tabbar-item tab-title="收藏" />
    </nut-tabbar>
    <view class="views-container grow p-4 overflow-y-auto">
      <nut-empty
        v-if="active == 0 && goodAppraises.length === 0"
        image="empty"
        description="暂无交易"
      ></nut-empty>
      <view
        v-if="active == 0"
        v-for="appraise in goodAppraises"
        class="good-appraise p-2 mb-4 shadow rounded-2"
      >
        <view class="flex flex-gap-2 justify-between items-center">
          <view class="flex flex-gap-2 items-center text-#827171">
            <image
              v-if="appraise.user.avatarUrl"
              class="h-60 w-60 rounded-30rpx"
              :src="`${BASE_URL}/${appraise.user.avatarUrl}`"
            />
            <view class="max-w-230 line-clamp-1">
              {{ appraise.user.name }}
            </view>
            <text>
              {{ getTime(appraise.createTime) }}
            </text>
          </view>
        </view>
        <view class="flex flex-col p-2 flex-gap-2">
          <nut-rate v-model="appraise.rate" readonly size="30rpx" />
          <text v-if="appraise.comment">
            {{ appraise.comment }}
          </text>
          <image
            v-if="appraise.commentImgUrl"
            class="h-200 w-200 rounded-2"
            :src="`${BASE_URL}/${appraise.commentImgUrl}`"
          />
          <view class="flex flex-gap-2 p-2 bg-black/5 rounded-2">
            <image
              v-if="appraise.good.imgUrls.length > 0"
              class="h-150 w-150 rounded-2"
              :src="`${BASE_URL}/${appraise.good.imgUrls[0]}`"
            />
            <view class="flex flex-gap-2 flex-col">
              <text class="max-w-438rpx line-clamp-2">
                {{ appraise.good.description }}
              </text>
              <nut-price :price="appraise.good.price" />
            </view>
          </view>
        </view>
      </view>
      <nut-empty
        v-if="active != 0 && posts.length === 0"
        image="empty"
        description="暂无动态"
      ></nut-empty>
      <view
        v-if="active != 0"
        v-for="post in posts"
        class="post p-2 mb-4 shadow rounded-2"
        @tap="
          onPostTap(
            post.id,
            collects.includes(post.id),
            likes.includes(post.id)
          )
        "
      >
        <view class="head flex flex-gap-2 justify-between items-center">
          <view class="head-user flex flex-gap-2 items-center text-#827171">
            <image
              v-if="post.publisher.avatarUrl"
              class="h-60 w-60 rounded-30rpx"
              :src="`${BASE_URL}/${post.publisher.avatarUrl}`"
            />
            <view class="max-w-230 line-clamp-1">
              {{ post.publisher.name }}
            </view>
            <text> {{ getTime(post.createTime) }}</text>
          </view>
          <IconFont
            name="more-x"
            color="#827171"
            @click.stop="onMoreClick(post.id, $event)"
          ></IconFont>
        </view>
        <view class="post-content flex flex-col">
          <text class="line-clamp-3 p-1">
            {{ post.text }}
          </text>
          <view
            :class="[
              `content-wrapper`,
              { 'content-wrapper-grid-1': post.imgUrls.length === 2 },
              { 'content-wrapper-grid-2': post.imgUrls.length >= 3 },
            ]"
            v-if="post.imgUrls.length > 0"
          >
            <image
              v-for="(item, index) in post.imgUrls"
              :class="[
                `content-wrapper__image`,
                { 'content-wrapper__image-full': post.imgUrls.length > 1 },
                {
                  'content-wrapper__image-last':
                    post.imgUrls.length > 4 && index === 3,
                },
              ]"
              :lazy-load="true"
              :src="`${BASE_URL}/${item}`"
            />
            <text v-if="post.imgUrls.length > 4" class="content-wrapper-over">{{
              `+${post.imgUrls.length - 4}`
            }}</text>
          </view>
        </view>
      </view>
    </view>
    <nut-popup
      :style="{
        left: `${x}px`,
        top: `${y}px`,
      }"
      :overlay-style="{
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }"
      v-model:visible="overlayVisible"
    >
      <view
        class="w-100 flex flex-col border shadow border-#ccc border-solid flex-gap-2 rounded-1 justify-center p-2"
      >
        <view class="text-red text-center" @tap="onDeleteMessageTap">删除</view>
      </view>
    </nut-popup>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}
.personal-home {
  height: 100%;
  display: flex;
  flex-direction: column;
  .nut-tabbar-item_icon-box_big-word {
    font-size: 28rpx;
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
  }
}
</style>
