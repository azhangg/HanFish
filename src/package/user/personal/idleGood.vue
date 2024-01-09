<script setup lang="ts">
import type { UserType } from "@/models/user/user";
import type { GoodType } from "@/models/good/good";

import { ref, onBeforeMount, computed } from "vue";
import { getUserInfoByUserIdReq } from "@/apis/user";
import Taro from "@tarojs/taro";
import { useStore } from "@/stores";
import {
  getUsersGoodReq,
  modifyGoodStatusReq,
  deleteGoodReq,
} from "@/apis/good";
import { BASE_URL } from "@/utils/config";

import GoodCard from "@/components/home/GoodCard.vue";
import { goPage, msg } from "@/utils/common";

let userId = 0;

const operatingGoodId = ref(0);

const visible = ref(false);

const user = ref<UserType>();

const goodList = ref<GoodType[]>([]);

const goodListLeft = computed(() =>
  goodList.value.filter((_, i) => i % 2 === 0)
);

const goodListRight = computed(() =>
  goodList.value.filter((_, i) => i % 2 !== 0)
);

const menuItems = computed(() => {
  const baseitem = [{ name: "删除" }];
  if (
    goodList.value.some(
      (g) => g.status == "已下架" && g.id == operatingGoodId.value
    )
  ) {
    baseitem.unshift({ name: "上架" });
  }
  return baseitem;
});

const getUserInfo = () => {
  getUserInfoByUserIdReq(userId, (res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      user.value = data;
      Taro.setNavigationBarTitle({
        title: `${
          useStore().userInfo.id === data.id ? "我" : data.name
        }的闲置物品`,
      });
    }
  });
};

const getUsersGood = (userId: number) => {
  getUsersGoodReq(userId, (res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      goodList.value = data;
    }
  });
};

const onGoodCardTap = (good: GoodType) => {
  if (good.status === "未交易") {
    goPage(`/package/goods/detail/detail?id=${good.id}`);
  }
};

const onChoose = ({ name }) => {
  switch (name) {
    case "上架":
      modifyGoodStatusReq({ id: operatingGoodId.value, status: 1 }, (res) => {
        const { isSuccess } = res.data;
        if (isSuccess) {
          msg("上架成功");
          Taro.eventCenter.trigger("homeRefreshData");
          getUsersGood(userId);
        }
      });
      break;
    case "删除":
      deleteGoodReq(operatingGoodId.value, (res) => {
        const { isSuccess } = res.data;
        if (isSuccess) {
          msg("删除成功");
          Taro.eventCenter.trigger("homeRefreshData");
          getUsersGood(userId);
        }
      });
      break;
    default:
      break;
  }
};

const onGoodCardLongPress = (good: GoodType) => {
  if (useStore().userInfo.id === userId && good.status != "已交易") {
    operatingGoodId.value = good.id;
    visible.value = true;
  }
};

onBeforeMount(() => {
  const userIdFromRouter = Taro.useRouter().params.userId;
  if (userIdFromRouter) {
    userId = Number(userIdFromRouter);
    getUserInfo();
    getUsersGood(userId);
  }
});
</script>

<template>
  <view class="idle-good">
    <nut-empty
      v-if="goodList.length === 0"
      image="empty"
      description="暂无物品"
    ></nut-empty>
    <view class="goods-view">
      <view class="goods-view__left">
        <GoodCard
          v-for="good in goodListLeft"
          :id="good.id"
          :img-url="`${BASE_URL}/${good.imgUrls[0]}`"
          :description="good.description"
          :price="good.price"
          :tags="good.tags"
          :user="good.user"
          :status="good.status"
          @tap="onGoodCardTap(good)"
          @longpress="onGoodCardLongPress(good)"
        />
      </view>
      <view class="goods-view__right">
        <GoodCard
          v-for="good in goodListRight"
          :id="good.id"
          :img-url="`${BASE_URL}/${good.imgUrls[0]}`"
          :description="good.description"
          :price="good.price"
          :tags="good.tags"
          :user="good.user"
          :status="good.status"
          @tap="onGoodCardTap(good)"
          @longpress="onGoodCardLongPress(good)"
        />
      </view>
    </view>
    <nut-action-sheet
      v-model:visible="visible"
      :menu-items="menuItems"
      cancel-txt="取消"
      @choose="onChoose"
    />
  </view>
</template>

<style lang="scss">
.idle-good {
  .goods-view {
    padding: 20rpx;
    display: flex;
    gap: 20rpx;
    justify-content: space-between;
    &__left {
      width: 50%;
    }
    &__right {
      width: 50%;
    }
  }
  .nut-popup {
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  }
}
</style>
