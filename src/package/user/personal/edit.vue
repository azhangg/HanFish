<script setup lang="ts">
import type { UserType } from "@/models/user/user";

import { ref } from "vue";
import { uploadFiles } from "@/utils/request";
import { BASE_URL } from "@/utils/config";
import { updateUserInfoReq } from "@/apis/user";
import { msg } from "@/utils/common";
import { useStore } from "@/stores";
import Taro from "@tarojs/taro";

const { userInfo, setUserInfo } = useStore();

const user = ref<UserType>({
  id: userInfo.id,
  name: userInfo.name,
  loginName: "",
  avatarUrl: userInfo.avatarUrl,
  roleId: 3,
  createTime: new Date(),
});

const onChooseAvatar = (e: any) => {
  uploadFiles(
    "/User/UploadUserAvatar",
    e.detail.avatarUrl,
    "formFile",
    {},
    (res) => {
      const { data } = res;
      var result = JSON.parse(data);
      user.value.avatarUrl = result.data[0];
    }
  );
};

const onSaveTap = () => {
  updateUserInfoReq(
    {
      id: user.value.id,
      name: user.value.name,
      avatarUrl: user.value.avatarUrl,
    },
    (res) => {
      const { isSuccess } = res.data;
      if (isSuccess) {
        userInfo.name = user.value.name;
        userInfo.avatarUrl = user.value.avatarUrl ?? "";
        setUserInfo(userInfo);
        msg("保存成功");
        setTimeout(() => {
          Taro.switchTab({
            url: "/pages/user/user",
          });
        }, 1000);
      }
    }
  );
};
</script>

<template>
  <view class="personal-edit">
    <button
      class="flex items-center justify-center p-0 h-200 w-200 m-b1"
      open-type="chooseAvatar"
      @chooseavatar="onChooseAvatar"
    >
      <image
        v-if="user.avatarUrl"
        class="h-full w-full"
        :src="`${BASE_URL}/${user.avatarUrl}`"
      ></image>
      <AtIcon v-else value="add" size="50" color="#e0e0e0"></AtIcon>
    </button>
    <text>选择头像</text>
    <input class="nickname" v-model="user.name" placeholder="请输入昵称" />
    <button class="logn-btn w-540" @tap="onSaveTap">保存</button>
  </view>
</template>

<style lang="scss">
.personal-edit {
  color: #585858;
  display: flex;
  flex-direction: column;
  padding: 16rpx;
  align-items: center;
  .nickname {
    width: 500rpx;
    margin: 20rpx 0;
    padding: 10rpx 20rpx;
    border: 1rpx solid #e0e0e0;
    border-radius: 10rpx;
  }
  .logn-btn {
    color: white;
    background-color: #00e86f;
  }
}
</style>
