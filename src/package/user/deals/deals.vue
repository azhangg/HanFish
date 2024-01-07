<script setup lang="ts">
import type { OrderType } from "@/models/good/order";

import { ref, computed } from "vue";
import { BASE_URL } from "@/utils/config";
import { useStore } from "@/stores";
import { storeToRefs } from "pinia";
import Taro from "@tarojs/taro";

const { orders } = storeToRefs(useStore());

const active = ref(0);

const deals = computed(() => {
  if (active.value === 0) return orders.value;
  return orders.value.filter((o) => o.status === active.value);
});

const statusStr = (status: number) => {
  switch (status) {
    case 0:
      return "";
    case 1:
      return "待付款";
    case 2:
      return "待发货";
    case 3:
      return "待收货";
    case 4:
      return "待评价";
    case 5:
      return "已完成";
    case 6:
      return "已取消";
  }
};

const orderNum = (status: number) => {
  return orders.value.filter((o) => o.status === status).length;
};

const onDealTap = (order: OrderType) => {
  Taro.navigateTo({
    url: `/package/user/deals/detail?orderId=${order.id}`,
  });
};

Taro.useDidShow(() => {
  const status = Taro.useRouter().params.status;
  if (status) {
    active.value = Number(status);
  }
});
</script>

<template>
  <view class="deals">
    <nut-tabbar
      v-model="active"
      :unactive-color="'#aaa'"
      :active-color="'#ff6b81'"
    >
      <nut-tabbar-item tab-title="全部"> </nut-tabbar-item>
      <nut-tabbar-item tab-title="待付款" :value="orderNum(1)">
      </nut-tabbar-item>
      <nut-tabbar-item tab-title="待发货" :value="orderNum(2)">
      </nut-tabbar-item>
      <nut-tabbar-item tab-title="待收货" :value="orderNum(3)">
      </nut-tabbar-item>
      <nut-tabbar-item tab-title="待评价" :value="orderNum(4)">
      </nut-tabbar-item>
      <nut-tabbar-item tab-title="已完成"> </nut-tabbar-item>
    </nut-tabbar>
    <view class="flex flex-col flex-gap-2 p-2">
      <view v-if="deals.length === 0" class="text-#aaa text-center">
        暂无交易
      </view>
      <view
        v-for="deal in deals"
        class="flex p-2 flex-gap-3 text-#827171 rounded-2 shadow"
        @tap="onDealTap(deal)"
      >
        <image
          class="w-200 h-200 rounded-1"
          :src="`${BASE_URL}/${deal.good.imgUrls[0]}`"
        />
        <view class="flex-1 flex flex-col justify-between">
          <view class="description"> {{ deal.good.description }} </view>
          <view class="flex flex-row-reverse flex-gap-2 items-center p-2">
            <text class="font-bold c-#ff6b81">
              {{ statusStr(deal.status) }}
            </text>
            <image
              class="h-60 w-60 rounded-30rpx"
              :src="`${BASE_URL}/${deal.user.avatarUrl}`"
            />
            <text class="w-200 flex justify-end truncate break-all">
              {{ deal.user.name }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.deals {
  .nut-tabbar-item_icon-box_big-word {
    font-size: 28rpx;
  }
  .nut-badge .nut-badge__content--sup {
    top: -13px !important;
    right: -5px !important;
  }
}
</style>
