<script setup lang="ts">
import type { OrderType } from "@/models/good/order";

import { ref, onBeforeMount } from "vue";
import { msg } from "@/utils/common";
import Taro from "@tarojs/taro";
import { payOrderReq } from "@/apis/order";
import { addChatMessageReq } from "@/apis/chatMessage";

const order = ref<OrderType>();

const onPayClick = () => {
  Taro.showLoading({
    title: "正在支付",
    mask: true,
  });
  setTimeout(() => {
    Taro.hideLoading();
  }, 5000);
  payOrderReq(order.value?.id ?? 0, (res) => {
    const { isSuccess } = res.data;
    if (isSuccess) {
      Taro.hideLoading();
      msg("支付成功");
      order.value ? (order.value.status = 2) : null;
      order.value
        ? addChatMessageReq(
            {
              senderId: order.value.userId,
              receiverId: order.value.good.userId,
              content: JSON.stringify(order.value),
              type: 3,
            },
            (_) => {}
          )
        : null;
      setTimeout(() => {
        Taro.switchTab({
          url: "/pages/home/home",
        });
      }, 1000);
    }
  });
};

onBeforeMount(() => {
  const orderInfo = Taro.useRouter().params.orderInfo;
  if (orderInfo) order.value = JSON.parse(decodeURI(orderInfo ?? ""));
});
</script>

<template>
  <view class="order-pay text-#827171">
    <view>订单编号：{{ order?.code }}</view>
    <view>
      支付金额：<text class="font-bold">{{ order?.good?.price }}</text>
    </view>
    <text>选择支付方式：</text>
    <radio-group @change="">
      <radio class="checkbox-list__checkbox w-full" :value="1" :checked="true">
        <image
          class="h-150 w-full ml-68rpx"
          mode="heightFix"
          src="https://wx.gtimg.com/outwxgtimg/imgs/logo/wxpaylogo_xxxhdpi.png"
        />
      </radio>
      <radio class="checkbox-list__checkbox w-full" :value="2" :checked="false">
        <image
          class="h-200 w-full"
          mode="heightFix"
          src="https://ts1.cn.mm.bing.net/th/id/R-C.bbd7f982815f833cb7ca0dd2bad225ea?rik=7ZACV5JJopTCug&riu=http%3a%2f%2fwww.szquanli.com%2fuploads%2fallimg%2f200313%2f2-200313092Z3-51.png&ehk=CMQBThlNBi4WvlPCGojZrvk9U9R1T3rvTX%2bAKTqKERE%3d&risl=&pid=ImgRaw&r=0"
        />
      </radio>
    </radio-group>
    <nut-button type="success" @click="onPayClick">支付</nut-button>
  </view>
</template>

<style lang="scss">
.order-pay {
  padding: 16rpx;
  display: flex;
  gap: 16rpx;
  flex-direction: column;
}
</style>
