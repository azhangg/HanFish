<script setup lang="ts">
import type { GoodType } from "@/models/good/good";

import Taro from "@tarojs/taro";
import { computed } from "vue";
import { reactive, ref } from "vue";
import { onMounted } from "vue";
import { getGoodByIdReq } from "@/apis/good";
import { loading, msg } from "@/utils/common";
import { BASE_URL, DEFAULT_AVATAR } from "@/utils/config";

const goodId = parseInt(Taro.getCurrentInstance().router?.params?.id ?? "0");

const goodInfo = ref<GoodType>();

const previewImgs = computed(() =>
  goodInfo.value?.imgUrls.map((item) => {
    return {
      src: `${BASE_URL}/${item}`,
    };
  })
);

const showPreview = ref(false);

const swiperState = reactive({
  page: 0,
  current: 1,
});

const swiperChange = (index) => {
  swiperState.page = index;
  swiperState.current = index + 1;
};

const getGoodInfo = () => {
  loading();
  getGoodByIdReq(goodId, (res) => {
    const { isSuccess, data, message } = res.data;
    if (isSuccess) {
      goodInfo.value = data;
      Taro.hideLoading();
    } else {
      msg(message);
    }
  });
};

onMounted(() => {
  getGoodInfo();
});
</script>
<template>
  <view class="good-detail">
    <nut-image-preview
      :show="showPreview"
      :images="previewImgs"
      :init-no="swiperState.page"
      @close="showPreview = false"
    />
    <nut-swiper
      height="300"
      :init-page="swiperState.page"
      :loop="false"
      auto-play="0"
      @change="swiperChange"
    >
      <nut-swiper-item
        v-for="item in goodInfo?.imgUrls"
        @tap.stop="showPreview = true"
      >
        <img :src="`${BASE_URL}/${item}`" mode="aspectFill" />
      </nut-swiper-item>
      <template #page>
        <div class="page">
          {{ swiperState.current }}/{{ goodInfo?.imgUrls.length }}
        </div>
      </template>
    </nut-swiper>
    <nut-price :price="goodInfo?.price" symbol="¥" size="large" />
    <view class="descript">
      <view>
        {{ goodInfo?.description }}
      </view>
    </view>
    <view class="bottom-plane">
      <view class="flex flex-gap-2 items-center">
        <nut-avatar size="normal">
          <img
            :src="`${BASE_URL}/${goodInfo?.user.avatarUrl ?? DEFAULT_AVATAR}`"
          />
        </nut-avatar>
        <text>{{ goodInfo?.user.name }}</text>
      </view>
      <view class="flex flex-gap-2">
        <nut-button plain type="primary">私聊</nut-button>
        <nut-button type="primary">下单</nut-button>
      </view>
    </view>
  </view>
</template>
<style lang="scss">
.good-detail {
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  overflow-y: scroll;
  .descript {
    margin-bottom: calc(150rpx + env(safe-area-inset-bottom));
  }
  .bottom-plane {
    width: calc(100% - 32rpx);
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 16rpx;
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-shadow: rgba(0, 0, 0, 0.25) 32rpx 25rpx 50rpx 8rpx;
    .nut-avatar-round {
      overflow: hidden;
    }
  }
  .nut-swiper-item {
    line-height: 150px;
  }
  .nut-swiper-item img {
    width: 100%;
    height: 100%;
    border-radius: 22rpx;
  }

  .page {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0;
    right: 0;
    width: 100rpx;
    height: 50rpx;
    background: rgba(0, 0, 0, 0.33);
    border-radius: 22px;
    text-align: center;
    color: #fff;
    font-size: 30rpx;
  }
}
</style>
