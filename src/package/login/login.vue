<script setup lang="ts">
import { ref, onMounted } from "vue";
import { AtIcon } from "taro-ui-vue3";
import Taro from "@tarojs/taro";
import { getOpenidReq, loginReq } from "@/apis/account";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores";
import { uploadFiles } from "@/utils/request";
import { BASE_URL } from "@/utils/config";
import { msg } from "@/utils/common";
import { useAccount } from "@/hooks/useAccount";

const { getUserInfo } = storeToRefs(useStore());
const { requestUserInfo } = useAccount();

const avatarUrl = ref("");
const nickName = ref("");

const onChooseAvatar = (e: any) => {
  uploadFiles(
    "/User/UploadUserAvatar",
    e.detail.avatarUrl,
    "formFile",
    {},
    (res) => {
      const { data } = res;
      var result = JSON.parse(data);
      avatarUrl.value = result.data[0];
    }
  );
};

const onNickNameChange = (e) => {
  const { pass } = e.detail;
  if (!pass) {
    Taro.showToast({
      title: "该昵称涉嫌违规，请重新输入！",
      icon: "none",
    });
    nickName.value = "";
  }
};

const getAccessToken = (openid: string) => {
  loginReq({ userName: openid, password: openid }, (res) => {
    const { isSuccess, data, message } = res.data;
    if (isSuccess) {
      Taro.setStorage({
        key: "token",
        data: data.accessToken,
      });
      useStore().setAccessToken(data.accessToken);
      requestUserInfo();
      getUserInfo.value = true;
      Taro.hideLoading();
    } else {
      Taro.showToast({
        title: message,
        icon: "none",
      });
    }
  });
};

const onLoginTap = () => {
  if (!nickName.value) {
    Taro.showToast({
      title: "请输入昵称",
      icon: "none",
    });
    return;
  }
  if (!avatarUrl.value) {
    Taro.showToast({
      title: "请选择头像",
      icon: "none",
    });
    return;
  }

  if (nickName.value && avatarUrl.value) {
    Taro.showLoading({
      title: "加载中",
    });
    setTimeout(function () {
      Taro.hideLoading();
    }, 10000);
    Taro.login({
      success: function (res) {
        if (res.code) {
          getOpenidReq(
            {
              jsCode: res.code,
              userName: nickName.value,
              avatarUrl: avatarUrl.value,
            },
            (res: any) => {
              const { data, isSuccess } = res.data;
              if (isSuccess) {
                Taro.setStorage({
                  key: "openid",
                  data: data.openId,
                });
                getAccessToken(data.openId);
                getUserInfo.value = true;
                Taro.eventCenter.trigger("login");
                Taro.hideLoading();
                Taro.showToast({
                  title: "登录成功",
                  icon: "none",
                });
                Taro.switchTab({
                  url: "/pages/user/user",
                });
              } else
                Taro.showToast({
                  title: "获取openid失败",
                  icon: "none",
                });
            }
          );
        }
      },
    });
  }
};

onMounted(() => {
  var openid = Taro.getStorageSync("openid");
  if (openid) {
    getAccessToken(openid);
    msg("即将自动登录");
    Taro.eventCenter.trigger("login");
    setTimeout(() => {
      Taro.switchTab({
        url: "/pages/user/user",
      });
    }, 1500);
    return;
  }
});
</script>
<template>
  <view class="login">
    <button
      class="flex items-center justify-center p-0 h-200 w-200 m-b1"
      open-type="chooseAvatar"
      @chooseavatar="onChooseAvatar"
    >
      <image
        v-if="avatarUrl"
        class="h-full w-full"
        :src="`${BASE_URL}/${avatarUrl}`"
      ></image>
      <AtIcon v-else value="add" size="50" color="#e0e0e0"></AtIcon>
    </button>
    <text>选择头像</text>
    <input
      type="nickname"
      class="nickname"
      v-model="nickName"
      @nicknamereview="onNickNameChange($event)"
      placeholder="请输入昵称"
    />
    <button class="logn-btn w-540" @tap="onLoginTap">登录</button>
  </view>
</template>
<style lang="scss">
.login {
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
