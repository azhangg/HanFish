<script setup lang="ts">
import { AtList, AtListItem, AtGrid } from "taro-ui-vue3";
import { onMounted } from "vue";
import { BASE_URL, DEFAULT_AVATAR } from "@/utils/config";
import { useStore } from "@/stores";
import Taro from "@tarojs/taro";
import { storeToRefs } from "pinia";
import { useAccount } from "@/hooks/useAccount";

const { userInfo, getUserInfo } = storeToRefs(useStore());
const { getOpenId, getAccessToken, requestUserInfo } = useAccount();

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
  }
};

onMounted(() => {});
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
        <AtList :hasBorder="false">
          <AtListItem title="我的交易" extraText="全部交易" arrow="right" />
        </AtList>
        <AtGrid
          :hasBorder="false"
          :columnNum="5"
          :data="[
            {
              image:
                'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
              value: '领取中心',
            },
            {
              image:
                'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
              value: '找折扣',
            },
            {
              image:
                'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
              value: '领会员',
            },
            {
              image:
                'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
              value: '新品首发',
            },
            {
              image:
                'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
              value: '领京豆',
            },
            {
              image:
                'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
              value: '手机馆',
            },
          ]"
        />
      </view>
      <view class="other box-shadow roundness">
        <AtList :hasBorder="false">
          <AtListItem title="收货地址" arrow="right" />
          <AtListItem title="优惠卷" extraText="10" arrow="right" />
          <AtListItem title="积分" extraText="2" arrow="right" />
        </AtList>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
$top: 175rpx;

.user {
  .background {
    width: 100%;
    position: absolute;
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
}
</style>
