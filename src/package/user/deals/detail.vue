<script setup lang="ts">
import type { OrderType } from "@/models/good/order";
import type { AddressType } from "@/models/user/address";

import { ref, onBeforeMount } from "vue";
import Taro from "@tarojs/taro";
import { BASE_URL } from "@/utils/config";
import { useStore } from "@/stores";
import { goPage, msg, pcaSplit } from "@/utils/common";
import { getAddressReq } from "@/apis/address";
import { addChatMessageReq } from "@/apis/chatMessage";
import {
  getOrderByIdReq,
  updateOrderReq,
  orderDeliveryReq,
  receiveOrderReq,
  cancelOrderReq,
} from "@/apis/order";

const { userInfo } = useStore();

const current = ref(0);

const promptContent = ref("");

const promptVisible = ref(false);

const chooseAddressVisible = ref(false);

const order = ref<OrderType>();

const existAddress = ref<
  {
    id: number;
    provinceName: string;
    cityName: string;
    countyName: string;
    addressDetail: string;
    townName: string;
    name: string;
    phone: string;
    selectedAddress: boolean;
  }[]
>([]);

const statusStrArr = () => {
  const strArr = ["付款", "发货", "收货", "评价"];
  if (current.value >= 0 && current.value <= 5)
    for (let i = 0; i < strArr.length; i++) {
      if (current.value - 1 > i) strArr[i] = "已" + strArr[i];
      else strArr[i] = "待" + strArr[i];
    }
  strArr.push("已完成");
  return strArr;
};

const adToExist = (address: AddressType) => {
  const result = pcaSplit(address.deliveryAddress);
  return {
    id: address.id,
    provinceName: result[1],
    cityName: result[2],
    countyName: result[3],
    addressDetail: result[4],
    townName: "",
    name: address.name,
    phone: address.contactNum,
    selectedAddress: address.isDefault,
  };
};

const getOrder = (id: number) => {
  getOrderByIdReq(id, (res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      order.value = data;
      current.value = order.value?.status ?? 0;
    }
  });
};

const getUsersAddress = () => {
  getAddressReq((res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      existAddress.value = data.map((a) => adToExist(a));
    }
  });
};

const onGoPayClick = () => {
  goPage(
    `/package/goods/order/pay?orderInfo=${encodeURI(
      JSON.stringify(order.value)
    )}`
  );
};

const onChooseAddressClose = ({ type, data }) => {
  if (type == "exist") {
    updateOrderReq(
      { id: order.value?.id ?? 0, addressId: data?.id ?? 0 },
      (res) => {
        const { isSuccess } = res.data;
        if (isSuccess) {
          if (order.value) {
            order.value.addressId = data.id;
            order.value.address.name = data.name;
            order.value.address.contactNum = data.phone;
            order.value.address.deliveryAddress = `${data.provinceName}${data.cityName}${data.countyName}${data.addressDetail}`;
            addChatMessageReq(
              {
                senderId: order.value.userId,
                receiverId: order.value.good.userId,
                content: JSON.stringify(order.value),
                type: 3,
              },
              (_) => {}
            );
          }
        }
      }
    );
  }
};

const onChooseOtherAddressClick = () => {
  goPage("/package/user/receivingAddress/add", {
    acceptDataFromOpenedPage: (res) => {
      existAddress.value.forEach((item) => {
        item.selectedAddress = false;
      });
      existAddress.value.push(res);
    },
  });
};

const onGoDeliveryClick = () => {
  if (order.value) {
    getOrder(order.value.id);
    promptVisible.value = true;
  } else {
    msg("发生错误");
  }
};

const onDeliveryConfirm = () => {
  orderDeliveryReq(order.value?.id ?? 0, (res) => {
    const { isSuccess } = res.data;
    if (isSuccess) {
      if (order.value) {
        order.value.status = 3;
        current.value = 3;
        addChatMessageReq(
          {
            senderId: order.value.good.userId,
            receiverId: order.value.userId,
            content: JSON.stringify(order.value),
            type: 3,
          },
          (_) => {}
        );
      }
    }
  });
};

const onReceiveConfirm = () => {
  receiveOrderReq(order?.value?.id ?? 0, (res) => {
    const { isSuccess } = res.data;
    if (isSuccess) {
      if (order.value) {
        order.value.status = 4;
        msg("已收货");
        setTimeout(() => {
          current.value = 4;
        }, 1000);
        addChatMessageReq(
          {
            senderId: order.value.good.userId,
            receiverId: order.value.userId,
            content: JSON.stringify(order.value),
            type: 3,
          },
          (_) => {}
        );
      }
    }
  });
};

const onGoAppraiseClick = () => {
  goPage(
    `/package/goods/appraise/appraise?orderInfo=${encodeURI(
      JSON.stringify(order.value)
    )}`
  );
};

const onCancelOrderClick = () => {
  cancelOrderReq(order.value?.id ?? 0, (res) => {
    const { isSuccess } = res.data;
    if (isSuccess) {
      if (order.value) {
        order.value.status = 6;
        const receiverId =
          order.value.userId != userInfo.id
            ? order.value.userId
            : order.value.good.userId;
        addChatMessageReq(
          {
            senderId: userInfo.id,
            receiverId: receiverId,
            content: JSON.stringify(order.value),
            type: 3,
          },
          (_) => {}
        );
        msg("取消成功");
        setTimeout(() => {
          current.value = 6;
        }, 1000);
      }
    }
  });
};

onBeforeMount(() => {
  const orderId = Taro.useRouter().params.orderId;
  if (orderId) {
    getOrder(Number(orderId));
  }
  getUsersAddress();
});
</script>

<template>
  <view class="order-detail">
    <view class="ml-3"> 订单编号：{{ order?.code ?? "" }} </view>
    <nut-steps v-if="current > 0 && current <= 5" :current="current">
      <nut-step>
        <template #title>
          {{ statusStrArr()[0] }}
        </template>
      </nut-step>
      <nut-step>
        <template #title>
          {{ statusStrArr()[1] }}
        </template>
      </nut-step>
      <nut-step>
        <template #title>
          {{ statusStrArr()[2] }}
        </template>
      </nut-step>
      <nut-step>
        <template #title>
          {{ statusStrArr()[3] }}
        </template>
      </nut-step>
      <nut-step>
        <template #title>
          {{ statusStrArr()[4] }}
        </template>
      </nut-step>
    </nut-steps>
    <view v-else class="pl-3 text-red font-bold"> 已取消 </view>
    <view v-if="order" class="flex m-2 flex-gap-2 text-#827171">
      <image
        class="w-200 h-200 rounded-1"
        :src="`${BASE_URL}/${order?.good.imgUrls[0]}`"
      />
      <view class="flex-1 flex flex-col justify-between">
        <view class="description"> {{ order?.good.description }} </view>
        <view class="flex flex-row-reverse flex-gap-2 items-center p-2">
          <image
            class="h-60 w-60 rounded-30rpx"
            :src="`${BASE_URL}/${order?.user.avatarUrl}`"
          />
          <text class="w-300 flex justify-end truncate break-all">
            {{ order?.user.name }}
          </text>
        </view>
      </view>
    </view>
    <view class="flex p-3 flex-gap-2 flex-col">
      <text>收货地址：</text>
      <view>
        {{ order?.address.name ?? "" }}
      </view>
      <view>
        {{ order?.address.contactNum ?? "" }}
      </view>
      <view>
        {{ order?.address.deliveryAddress ?? "" }}
      </view>
    </view>
    <nut-button
      v-if="current === 1 && order?.userId == userInfo.id"
      type="success"
      @click="onGoPayClick"
    >
      ¥ {{ order?.good.price ?? "" }} 去支付
    </nut-button>
    <nut-button
      v-if="current === 1"
      color="linear-gradient(to right, #ff6034, #ee0a24)"
      @click="onCancelOrderClick"
    >
      取消交易
    </nut-button>
    <nut-button
      v-if="current === 2 && order?.userId === userInfo.id"
      type="warning"
      @click="chooseAddressVisible = true"
    >
      修改地址
    </nut-button>
    <nut-button
      v-if="current === 2 && order?.good.userId === userInfo.id"
      type="info"
      @click="onGoDeliveryClick"
    >
      去发货
    </nut-button>
    <nut-button
      v-if="current === 3 && order?.userId === userInfo.id"
      color="linear-gradient(to right, #ff6034, #ee0a24)"
      @click="onReceiveConfirm"
    >
      确认收货
    </nut-button>
    <nut-button
      v-if="current === 4 && order?.userId === userInfo.id"
      color="linear-gradient(to right, #ff6034, #ee0a24)"
      @click="onGoAppraiseClick"
    >
      去评价
    </nut-button>
    <nut-address
      v-model:visible="chooseAddressVisible"
      type="exist"
      :exist-address="existAddress"
      :is-show-custom-address="false"
      @close="onChooseAddressClose"
    >
      <template #bottom>
        <div class="flex p-3">
          <nut-button type="primary" @click="onChooseOtherAddressClick">
            选择其它地址
          </nut-button>
        </div>
      </template>
    </nut-address>
    <nut-dialog
      no-cancel-btn
      :overlay-style="{
        backgroundColor: 'rgba(0, 0, 0, .1)',
      }"
      title="温馨提示"
      :content="promptContent"
      v-model:visible="promptVisible"
      @ok="onDeliveryConfirm"
    >
      <view class="h-230 text-32">
        <view>买方最后保存的收货信息为：</view>
        <view class="font-bold">
          {{ order?.address.name ?? "" }}
        </view>
        <view class="font-bold">
          {{ order?.address.contactNum ?? "" }}
        </view>
        <view class="font-bold">
          {{ order?.address.deliveryAddress ?? "" }}
        </view>
        <view>请仔细核对收货地址，确认核对无误后点击确认按钮发货。</view>
      </view>
    </nut-dialog>
  </view>
</template>

<style lang="scss">
.order-detail {
  --nut-steps-process-title-color: #ff6b81;
  --nut-steps-finish-title-color: #ff6b81;
  --nut-steps-finish-head-color: #ff6b81;
  --nut-steps-finish-line-background: #ff6b81;

  padding: 16rpx;
  color: #827171;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  .nut-step.nut-step-process .nut-step-icon.is-icon {
    background-color: $primary;
  }
  .nut-address {
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom)) !important;
    .nut-icon {
      color: $primary !important;
    }
    .nut-button {
      width: 100%;
    }
  }
}
</style>
