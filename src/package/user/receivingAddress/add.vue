<script setup lang="ts">
import { ref, computed } from "vue";

import pcaJson from "@/assets/pca.json";
import { msg, testTelPhoneNumber, pcaSplit } from "@/utils/common";
import { addAddressReq } from "@/apis/address";
import Taro from "@tarojs/taro";

const town = [{ id: 0, name: "无" }];

const name = ref("");

const contactNum = ref("");

const address = ref("");

const addressDetail = ref("");

const showPopup = ref(false);

const pcaValue = ref<number[]>([]);

const city = computed(() => {
  const result = pcaJson.city.filter(
    (c) => Math.floor(c.id / 100) === pcaValue.value[0]
  );
  return result.length > 0 ? result : [{ id: 0, name: "无" }];
});

const area = computed(() => {
  const result = pcaJson.area.filter(
    (a) => Math.floor(a.id / 100) === pcaValue.value[1]
  );
  return result.length > 0 ? result : [{ id: 0, name: "无" }];
});

const onChange = ({ custom, value }) => {
  switch (custom) {
    case "province":
      pcaValue.value[0] = value?.id ?? 0;
      break;
    case "city":
      pcaValue.value[1] = value?.id ?? 0;
      break;
    case "country":
      pcaValue.value[2] = value?.id ?? 0;
      break;
    default:
      break;
  }
  showPopup.value = custom != "country";
};

const onClose = ({ data }) => {
  address.value = data.addressStr;
};

const onAddAddressClick = () => {
  if (!name.value) {
    msg("请输入姓名");
    return;
  }
  if (!testTelPhoneNumber(contactNum.value)) {
    msg("手机号码格式错误");
    return;
  }
  if (pcaValue.value.length != 3 || pcaValue.value.some((i) => i === 0)) {
    msg("请选择所在地区");
    return;
  }
  if (!addressDetail.value) {
    msg("请输入详细地址");
    return;
  }
  addAddressReq(
    {
      name: name.value,
      contactNum: contactNum.value,
      deliveryAddress: `${address.value}${addressDetail.value}`,
    },
    (res) => {
      const { isSuccess, data } = res.data;
      if (isSuccess) {
        msg("添加成功");
        const eventChannel =
          Taro.getCurrentPages()[
            Taro.getCurrentPages().length - 1
          ]?.getOpenerEventChannel();
        if (eventChannel) {
          const result = pcaSplit(data.deliveryAddress);
          eventChannel.emit("acceptDataFromOpenedPage", {
            id: data.id,
            provinceName: result[1],
            cityName: result[2],
            countyName: result[3],
            addressDetail: result[4],
            townName: "",
            name: data.name,
            phone: data.contactNum,
            selectedAddress: true,
          });
        }

        setTimeout(() => {
          Taro.navigateBack();
        }, 1000);
      }
    }
  );
};
</script>

<template>
  <view class="addAddress">
    <view
      class="flex items-center pl-36rpx pr-36rpx mt-22rpx mb-22rpx text-#827171 shadow-md shadow-#d3d3d4/30"
    >
      <text>姓名</text>
      <input
        class="flex-1 pl-36rpx pr-0 pt-28rpx pb-28rpx"
        v-model="name"
        placeholder="请输入姓名"
      />
    </view>
    <view
      class="flex items-center pl-36rpx pr-36rpx text-#827171 shadow-md shadow-#d3d3d4/30"
    >
      <text>手机号码</text>
      <input
        class="flex-1 pl-36rpx pr-0 pt-28rpx pb-28rpx"
        v-model="contactNum"
        :maxlength="11"
        placeholder="请输入手机号码"
      />
    </view>
    <nut-cell
      title="选择地区"
      :desc="address"
      is-link
      @click="showPopup = true"
    ></nut-cell>
    <input
      class="pl-36rpx pr-36rpx pt-28rpx pb-28rpx mb-22rpx text-#827171 shadow-md shadow-#d3d3d4/30"
      v-model="addressDetail"
      placeholder="请输入详细地址"
    />
    <view class="pl-3 pr-3">
      <nut-button type="primary" @click="onAddAddressClick"
        >新增地址</nut-button
      >
    </view>
    <nut-address
      v-model="pcaValue"
      v-model:visible="showPopup"
      :province="pcaJson.province"
      :city="city"
      :country="area"
      :town="town"
      custom-address-title="请选择所在地区"
      @change="onChange"
      @close="onClose"
    ></nut-address>
  </view>
</template>

<style lang="scss">
.addAddress {
  margin: 0;
  .nut-button {
    width: 100%;
  }
  .nut-popup {
    .nut-icon {
      color: $primary !important;
    }
  }
}
</style>
