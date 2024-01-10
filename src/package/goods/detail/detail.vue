<script setup lang="ts">
import type { GoodType } from "@/models/good/good";

import Taro from "@tarojs/taro";
import { computed } from "vue";
import { reactive, ref } from "vue";
import { onMounted } from "vue";
import {
  getGoodByIdReq,
  modifyGoodPriceReq,
  modifyGoodStatusReq,
} from "@/apis/good";
import { loading, msg, goPage } from "@/utils/common";
import { BASE_URL, DEFAULT_AVATAR } from "@/utils/config";
import { useStore } from "@/stores";
import { useAccount } from "@/hooks/useAccount";

const { userInfo, addChatMessageRow } = useStore();

const { checkLogin, getOpenId } = useAccount();

const goodId = parseInt(Taro.getCurrentInstance().router?.params?.id ?? "0");

const dialogVisible = ref(false);

const changingPrice = ref(0);

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

const formatter = (value) => value.replace(/^(0|\.)+/g, "");

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

const onTalkInPrivateClick = () => {
  if (checkLogin()) {
    const openid = getOpenId();
    addChatMessageRow([
      {
        targetInfo: {
          id: Number(goodInfo.value?.user.id) ?? 0,
          name: goodInfo.value?.user.name ?? "",
          roleId: 3,
          loginName: openid,
          avatarUrl: goodInfo.value?.user.avatarUrl ?? "",
        },
        chatMessages: [],
      },
    ]);
    goPage(`/package/chats/chat/chat?targetId=${goodInfo.value?.user.id}`);
  }
};

const onPlaceOrderClick = () => {
  if (checkLogin()) {
    getGoodByIdReq(goodInfo.value?.id ?? 0, (res) => {
      const { isSuccess, data } = res.data;
      if (isSuccess && data.status == "未交易") {
        goPage(
          `/package/goods/order/confirm?goodId=${
            goodInfo.value?.id
          }&goodInfo=${encodeURI(JSON.stringify(goodInfo?.value))}`
        );
      } else {
        msg("来晚了，已被别的客官抢先一步");
        Taro.eventCenter.trigger("homeRefreshData");
        setTimeout(() => {
          Taro.switchTab({
            url: "/pages/home/home",
          });
        }, 1000);
      }
    });
  }
};

const onShowOrderClick = () => {
  const order = useStore().orders.find((o) => o.goodId === goodId);
  if (order) {
    goPage(`/package/user/deals/detail?orderId=${order.id}`);
  }
};

const onChangePriceClick = () => {
  changingPrice.value = goodInfo.value?.price ?? 0;
  dialogVisible.value = true;
};

const onOffShelfClick = () => {
  modifyGoodStatusReq({ id: goodId, status: 4 }, (res) => {
    const { isSuccess } = res.data;
    if (isSuccess) {
      msg("下架成功");
      Taro.eventCenter.trigger("homeRefreshData");
      setTimeout(() => {
        Taro.switchTab({
          url: "/pages/home/home",
        });
      }, 1000);
    }
  });
};

const onChangePriceConfirm = () => {
  let priceString = changingPrice.value as unknown as string;
  priceString = parseFloat(priceString).toFixed(2);
  const price = parseFloat(priceString);
  modifyGoodPriceReq({ id: goodId, price: price }, (res) => {
    const { isSuccess } = res.data;
    if (isSuccess) {
      msg("修改成功");
      Taro.eventCenter.trigger("homeRefreshData");
      setTimeout(() => {
        Taro.switchTab({
          url: "/pages/home/home",
        });
      }, 1000);
    }
  });
};

const onUserInfoTap = () => {
  if (checkLogin()) {
    goPage(`/package/user/personal/home?userId=${goodInfo.value?.userId}`);
  }
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
      <view class="flex flex-gap-2 items-center" @tap="onUserInfoTap">
        <nut-avatar size="small">
          <img
            :src="`${BASE_URL}/${goodInfo?.user.avatarUrl ?? DEFAULT_AVATAR}`"
          />
        </nut-avatar>
        <text>{{ goodInfo?.user.name }}</text>
      </view>
      <view v-if="userInfo.id != goodInfo?.user.id" class="flex flex-gap-2">
        <nut-button
          plain
          type="primary"
          size="small"
          @click="onTalkInPrivateClick"
        >
          私聊
        </nut-button>
        <nut-button
          v-if="
            !useStore().orders.some((o) => o.goodId === goodId && o.status != 6)
          "
          type="primary"
          size="small"
          @click="onPlaceOrderClick"
        >
          下单
        </nut-button>
        <nut-button
          v-else
          type="primary"
          size="small"
          @click="onShowOrderClick"
        >
          查看订单
        </nut-button>
      </view>
      <view v-else class="flex flex-gap-2">
        <nut-button
          plain
          type="primary"
          size="small"
          @click="onChangePriceClick"
        >
          改价
        </nut-button>
        <nut-button type="primary" size="small" @click="onOffShelfClick">
          下架
        </nut-button>
      </view>
    </view>
    <nut-dialog
      title="修改价格"
      v-model:visible="dialogVisible"
      @cancel="dialogVisible = false"
      @ok="onChangePriceConfirm"
    >
      <nut-input
        placeholder="请输入价格"
        v-model="changingPrice"
        type="digit"
        max-length="13"
        :formatter="formatter"
        format-trigger="onChange"
      />
    </nut-dialog>
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
