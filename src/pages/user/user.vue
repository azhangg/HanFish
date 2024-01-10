<script setup lang="ts">
import { AtList, AtListItem } from "taro-ui-vue3";
import { BASE_URL, DEFAULT_AVATAR } from "@/utils/config";
import { useStore } from "@/stores";
import Taro from "@tarojs/taro";
import { storeToRefs } from "pinia";
import { useAccount } from "@/hooks/useAccount";
import { goPage, msg } from "@/utils/common";
import { ref } from "vue";

const icons = [
  {
    image: `${BASE_URL}/Files/SystemResource/20231231/20231231102610_06780025-D8E9-4D94-B256-5767BACA9818.png`,
    value: "待付款",
    status: 1,
  },
  {
    image: `${BASE_URL}/Files/SystemResource/20231231/20231231102610_7A95A588-D449-44B1-B097-C83F4AD19B14.png`,
    value: "待发货",
    status: 2,
  },
  {
    image: `${BASE_URL}/Files/SystemResource/20231231/20231231142559_9D00BCF8-EE5F-44B2-BA29-CEBD88326FAD.png`,
    value: "待收货",
    status: 3,
  },
  {
    image: `${BASE_URL}/Files/SystemResource/20231231/20231231102610_39B3F42E-3CB2-4903-9332-F6787E628CB5.png`,
    value: "待评价",
    status: 4,
  },
  {
    image: `${BASE_URL}/Files/SystemResource/20231231/20231231102610_A66E3061-AF5F-4CBD-9A26-8321272F9576.png`,
    value: "已完成",
    status: 5,
  },
];

const images = [
  {
    name: "交易",
    url: `${BASE_URL}/Files/SystemResource/20231231/20231231131202_80C53040-6B46-4D62-81A7-A2FC8B592B32.png`,
    active: 0,
  },
  {
    name: "帖子",
    url: `${BASE_URL}/Files/SystemResource/20231231/20231231131202_7AEC230A-E43A-4936-9EC4-584E5FBDA47F.png`,
    active: 1,
  },
  {
    name: "点赞",
    url: `${BASE_URL}/Files/SystemResource/20231231/20231231131202_76A4B6BA-AFA5-4793-A4EA-39E10396D317.png`,
    active: 2,
  },
  {
    name: "收藏",
    url: `${BASE_URL}/Files/SystemResource/20231231/20231231131202_0737888E-686B-43DE-93FA-1F06EA5CEFBA.png`,
    active: 3,
  },
];

const { userInfo, getUserInfo, orders } = storeToRefs(useStore());
const { getOpenId, getAccessToken, requestUserInfo, checkLogin } = useAccount();
const { refreshUnReadMsgNum, clearCache, loginOut } = useStore();

const miniProgramInfo = Taro.getAccountInfoSync().miniProgram;

const dialogVisible = ref(false);

const orderNum = (status: number) => {
  return orders.value.filter((o) => o.status === status).length;
};

const accountClickHandler = () => {
  if (!getUserInfo.value) {
    if (getOpenId()) {
      getAccessToken();
      setTimeout(() => {
        requestUserInfo();
      }, 1000);
    } else
      Taro.redirectTo({
        url: "/package/login/login",
      });
  } else {
    goPage(`/package/user/personal/edit`);
  }
};

const onAllDealTap = () => {
  if (checkLogin()) {
    goPage("/package/user/deals/deals");
  }
};

const onDealStatusTap = (status: number) => {
  if (checkLogin()) {
    goPage(`/package/user/deals/deals?status=${status}`);
  }
};

const onPersonalHomeTap = (active?: number) => {
  if (checkLogin()) {
    goPage(`/package/user/personal/home?userId=${userInfo.value.id}
      ${active ? "&active=" + active : ""}`);
  }
};

const onClearCacheClick = () => {
  dialogVisible.value = true;
};

const onConfirmClearClick = () => {
  clearCache();
  msg("清理缓存成功");
};

Taro.useDidShow(() => {
  refreshUnReadMsgNum();
});
</script>
<template>
  <view class="user">
    <image
      class="background"
      :src="`${BASE_URL}/Files/SystemResource/20231120/20231120141152_3BA3C2DA-504D-43CE-BC8E-FE0766E0C175.png`"
    />
    <view class="container">
      <view class="user-info flex">
        <image
          class="avatar"
          :src="
            getUserInfo && userInfo.avatarUrl
              ? `${BASE_URL}/${userInfo.avatarUrl}`
              : `${BASE_URL}/${DEFAULT_AVATAR}`
          "
          @tap="accountClickHandler"
        />
        <text @tap="accountClickHandler">
          {{ getUserInfo && userInfo.name ? userInfo.name : "未登录" }}
        </text>
      </view>
      <view class="user-order box-shadow roundness">
        <AtList :hasBorder="false" @tap="onAllDealTap">
          <AtListItem title="我的交易" extraText="全部交易" arrow="right" />
        </AtList>
        <view class="grid grid-cols-5 pl-2 pr-2 pb-2 text-#827171 text-28">
          <view
            v-for="item in icons"
            class="flex flex-col items-center"
            @tap="onDealStatusTap(item.status)"
          >
            <nut-badge :value="orderNum(item.status != 5 ? item.status : 0)">
              <image class="h-65 w-65" :src="item?.image" />
            </nut-badge>
            <text>{{ item?.value }}</text>
          </view>
        </view>
      </view>
      <view class="mt-0 box-shadow roundness">
        <AtList :hasBorder="false">
          <AtListItem
            title="社区"
            extraText="我的主页"
            arrow="right"
            @click="onPersonalHomeTap"
          />
        </AtList>
        <view
          class="grid grid-cols-4 pl-2 pr-2 pb-2 grid-gap-2 text-#827171 text-28"
        >
          <view
            v-for="item in images"
            class="flex h-100 w-full items-center justify-center flex-gap-1 bg-gradient-to-br from-white to-#ff6b81/30 rounded-2"
            @tap="onPersonalHomeTap(item.active)"
          >
            {{ item.name }}
            <image class="h-50 w-50" :src="item.url" />
          </view>
        </view>
      </view>
      <view class="other box-shadow roundness">
        <AtList :hasBorder="false">
          <AtListItem
            title="闲置物品"
            arrow="right"
            @click="
              goPage(`/package/user/personal/idleGood?userId=${userInfo.id}`)
            "
          />
          <AtListItem
            title="收货地址"
            arrow="right"
            @click="goPage('/package/user/receivingAddress/receivingAddress')"
          />
          <AtListItem
            title="个人信息"
            arrow="right"
            @click="goPage(`/package/user/personal/edit`)"
          />
        </AtList>
      </view>
      <nut-button
        class="box-shadow border-0 border-none"
        type="default"
        @click="onClearCacheClick"
      >
        清除缓存
      </nut-button>
      <nut-button class="box-shadow" type="primary" @click="loginOut()"
        >退出登录</nut-button
      >
      <view class="flex justify-center text-#827171 text-26">
        version：
        {{ `${miniProgramInfo.envVersion} ${miniProgramInfo.version}` }}
      </view>
    </view>
    <nut-dialog
      no-cancel-btn
      :overlay-style="{
        backgroundColor: 'rgba(0, 0, 0, .1)',
      }"
      title="温馨提示"
      content="该操作将会清除聊天记录，您确定清除缓存吗。"
      v-model:visible="dialogVisible"
      @ok="onConfirmClearClick"
    />
  </view>
</template>

<style lang="scss">
$top: 175rpx;

.user {
  .background {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .container {
    padding: 20rpx;
    position: relative;
    top: $top;
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    .user-info {
      gap: 20rpx;
      align-items: center;
      font-weight: bold;
      font-size: 35rpx;
      .avatar {
        border-radius: 50%;
        height: 100px;
        width: 100px;
      }
    }
    .user-order {
      margin-top: 35rpx;
      .at-list__item .item-content__info-title {
        font-weight: bold;
      }
    }
  }
  .at-list__item:active {
    background-color: white;
  }
  .nut-button--default {
    border: none;
  }
}
</style>
