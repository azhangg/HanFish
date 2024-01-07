<script setup lang="ts">
import type { AddressType } from "@/models/user/address";

import { ref, reactive } from "vue";
import {
  getAddressReq,
  setDefaultAddressReq,
  deleteAddressReq,
} from "@/apis/address";
import Taro from "@tarojs/taro";
import { msg } from "@/utils/common";

let addressId = 0;

const reqFlag = ref(false);

const dialogVisible = ref(false);

const addressList = ref<AddressType[]>([]);

const dataOptions = reactive({
  id: "id",
  fullAddress: "deliveryAddress",
  phone: "contactNum",
  addressName: "name",
  defaultAddress: "isDefault",
});

const getUsersAddress = () => {
  reqFlag.value = true;
  getAddressReq((res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      addressList.value = data;
    }
    reqFlag.value = false;
  });
};

const onSetDefaultTap = (address: any) => {
  setDefaultAddressReq(address.id, (res) => {
    const { isSuccess } = res.data;
    if (isSuccess) {
      msg(`已将${address.fullAddress}设为默认地址`);
      getUsersAddress();
    }
  });
};

const onEditClick = (_, item) => {
  Taro.navigateTo({
    url: `/package/user/receivingAddress/edit?id=${item.id}&name=${item.addressName}&contactNum=${item.phone}&deliveryAddress=${item.fullAddress}`,
  });
};

const onDelClick = (_, item) => {
  addressId = item.id;
  dialogVisible.value = true;
};

const onDeleteConfirm = () => {
  deleteAddressReq(addressId, (res) => {
    const { isSuccess } = res.data;
    if (isSuccess) {
      msg("删除成功");
      getUsersAddress();
    }
  });
};

Taro.useDidShow(() => {
  getUsersAddress();
});
</script>

<template>
  <view class="receivingAddress">
    <nut-address-list
      :data="addressList"
      swipe-edition
      @del-icon="onDelClick"
      @edit-icon="onEditClick"
      @add="
        Taro.navigateTo({
          url: '/package/user/receivingAddress/add',
        })
      "
      :data-options="dataOptions"
    >
      <template #swipe-right="{ item }">
        <view
          class="flex-1 flex items-center p-2 pl-3 pr-3 bg-#add8e6 text-white"
          @tap="onSetDefaultTap(item)"
        >
          设为默认
        </view>
      </template>
    </nut-address-list>
    <view
      v-if="addressList.length === 0 && !reqFlag"
      class="text-center text-#827171"
    >
      暂无收货地址
    </view>
    <nut-dialog
      :overlay-style="{
        backgroundColor: 'rgba(0, 0, 0, .1)',
      }"
      no-cancel-btn
      title="温馨提示"
      content="您确定删除该地址吗？"
      v-model:visible="dialogVisible"
      @cancel="dialogVisible = false"
      @ok="onDeleteConfirm"
    />
  </view>
</template>

<style lang="scss">
.receivingAddress {
  padding: 16rpx;
  .nut-address-list-item__info-contact-default {
    background-color: $primary;
  }
  .nut-address-list__bottom {
    bottom: 0;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    .nut-button {
      background-color: $primary;
    }
  }
  .nut-swipe__right {
    display: flex;
  }
}
</style>
