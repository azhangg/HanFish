<script setup lang="ts">
import type { GoodType } from "@/models/good/good";
import type { AddressType } from "@/models/user/address";

import { onBeforeMount, ref } from "vue";
import Taro from "@tarojs/taro";
import { BASE_URL } from "@/utils/config";
import { getAddressReq } from "@/apis/address";
import { pcaSplit, msg, goPage } from "@/utils/common";
import { getGoodByIdReq } from "@/apis/good";
import { addOrderReq } from "@/apis/order";
import { useStore } from "@/stores";
import { addChatMessageReq } from "@/apis/chatMessage";

const { userInfo, addChatMessageRow } = useStore();

const showPopupOther = ref(false);

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

const address = ref<any>();

const goodInfo = ref<GoodType>();

const addressList = ref<AddressType[]>([]);

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

const getUsersAddress = () => {
  getAddressReq((res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      addressList.value = data;
      existAddress.value = addressList.value.map((a) => adToExist(a));
      const defaultAddress = existAddress.value.find(
        (a) => a.selectedAddress == true
      );
      address.value = defaultAddress ?? "选择地址";
    }
  });
};

const onChooseOtherAddressClick = () => {
  goPage("/package/user/receivingAddress/add", {
    acceptDataFromOpenedPage: (res) => {
      address.value = res;
      existAddress.value.forEach((item) => {
        item.selectedAddress = false;
      });
      existAddress.value.push(res);
    },
  });
};

const onSubmitOrderClick = () => {
  if (!address.value || address.value == "选择地址") {
    msg("请选择收货地址");
    showPopupOther.value = true;
    return;
  }
  getGoodByIdReq(goodInfo.value?.id ?? 0, (res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess && data.status == "未交易") {
      addOrderReq(
        {
          goodId: goodInfo.value?.id ?? 0,
          userId: useStore().userInfo.id,
          addressId: address.value.id,
        },
        (res) => {
          const { isSuccess, data } = res.data;
          if (isSuccess) {
            addChatMessageReq(
              {
                senderId: goodInfo.value?.user.id ?? 0,
                receiverId: userInfo.id,
                content: JSON.stringify(data),
                type: 3,
              },
              (res) => {
                const { isSuccess, data } = res.data;
                if (isSuccess) {
                  addChatMessageRow([
                    {
                      targetInfo: {
                        id: goodInfo?.value?.user?.id ?? 0,
                        name: goodInfo?.value?.user?.name ?? "",
                        avatarUrl: goodInfo?.value?.user?.avatarUrl,
                        loginName: "",
                        roleId: 3,
                      },
                      chatMessages: [data],
                    },
                  ]);
                }
              }
            );
            goPage(
              `/package/goods/order/pay?orderInfo=${encodeURI(
                JSON.stringify(data)
              )}`
            );
          }
        }
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
};

const onChooseAddressClose = ({ type, data }) => {
  if (type == "exist") {
    address.value = data;
  }
};

onBeforeMount(() => {
  const goodInfoFromRouter = Taro.useRouter().params.goodInfo;
  if (goodInfoFromRouter)
    goodInfo.value = JSON.parse(decodeURI(goodInfoFromRouter ?? ""));
  getUsersAddress();
});
</script>

<template>
  <view class="order-confirm">
    <view class="flex m-2 flex-gap-2 text-#827171">
      <image
        class="w-200 h-200 rounded-1"
        :src="`${BASE_URL}/${goodInfo?.imgUrls[0]}`"
      />
      <view class="flex-1 flex flex-col justify-between">
        <view class="description"> {{ goodInfo?.description }} </view>
        <view class="flex flex-row-reverse flex-gap-2 items-center p-2">
          <image
            class="h-60 w-60 rounded-30rpx"
            :src="`${BASE_URL}/${goodInfo?.user.avatarUrl}`"
          />
          <text class="w-300 flex justify-end truncate break-all">
            {{ goodInfo?.user.name }}
          </text>
        </view>
      </view>
    </view>
    <nut-cell title="选择收货地址" is-link @click="showPopupOther = true">
      <template #desc>
        <view>
          <view>{{ `${address?.name ?? ""} ${address?.phone ?? ""}` }}</view>
          <view>
            {{
              `${address?.provinceName ?? ""}${address?.cityName ?? ""}${
                address?.countyName ?? ""
              }${address?.addressDetail ?? ""}`
            }}
          </view>
        </view>
      </template>
    </nut-cell>
    <nut-address
      v-model:visible="showPopupOther"
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
    <view class="bottom-fixed">
      <nut-price :price="goodInfo?.price" size="large" />
      <nut-button type="primary" size="small" @click="onSubmitOrderClick">
        提交订单
      </nut-button>
    </view>
  </view>
</template>

<style lang="scss">
.order-confirm {
  margin: 0;
  .description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
  }
  .bottom-fixed {
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
