<script lang="ts">
import type { GoodType } from "@/models/good/good";
import { AtSearchBar, AtLoadMore } from "taro-ui-vue3";
import GoodCard from "@/components/home/GoodCard.vue";
import { ref, onMounted, reactive, computed, watch } from "vue";
import { LoadStatus } from "@/enums/index";
import { useAccount } from "@/hooks/useAccount";
import Taro from "@tarojs/taro";
import { getGoodsReq } from "@/apis/good";
import { getGoodCategoriesReq } from "@/apis/goodCategory";
import { msg } from "@/utils/common";
import { BASE_URL } from "@/utils/config";

const { getAccessToken, requestUserInfo } = useAccount();

const pagination = reactive<{
  page: number;
  count: number;
  search: string;
  categoryId: number;
  total: number;
}>({
  page: 1,
  count: 10,
  search: "",
  categoryId: 0,
  total: 0,
});

const imgUrls = [
  "https://img10.360buyimg.com/babel/s700x360_jfs/t25855/203/725883724/96703/5a598a0f/5b7a22e1Nfd6ba344.jpg!q90!cc_350x180",
  "https://img11.360buyimg.com/babel/s700x360_jfs/t1/4776/39/2280/143162/5b9642a5E83bcda10/d93064343eb12276.jpg!q90!cc_350x180",
  "https://img14.360buyimg.com/babel/s700x360_jfs/t1/4099/12/2578/101668/5b971b4bE65ae279d/89dd1764797acfd9.jpg!q90!cc_350x180",
];

const swiperDuration = 500;
const swiperInterval = 2000;

const tabIndex = ref(0);

const goodList = ref<GoodType[]>([]);

const goodCategories = ref<{ id: number; name: string }[]>([]);
</script>

<script setup lang="ts">
let loadStatus = ref<string>(LoadStatus.more);

const goodListLeft = computed(() =>
  goodList.value.filter((_, i) => i % 2 === 0)
);

const goodListRight = computed(() =>
  goodList.value.filter((_, i) => i % 2 !== 0)
);

watch(
  () => tabIndex.value,
  (v) => {
    pagination.categoryId = goodCategories.value[v].id;
    goodList.value = [];
    loadStatus.value = LoadStatus.loading;
    getGoodList();
  }
);

Taro.usePullDownRefresh(() => {
  pagination.search = "";
  getGoodList();
  setTimeout(() => {
    Taro.stopPullDownRefresh();
  }, 1000);
});

const onSearchClick = () => {
  goodList.value = [];
  loadStatus.value = LoadStatus.loading;
  getGoodList();
};

const onSearchClear = () => {
  pagination.search = "";
};

const handleLoadClick = () => {
  const isload = pagination.count < pagination.total;
  loadStatus.value = isload ? LoadStatus.loading : LoadStatus.noMore;
  if (isload) {
    pagination.count += 10;
    loadStatus.value = LoadStatus.loading;
    getGoodList();
  }
};

const onGoodCardTap = (id: number) => {
  Taro.navigateTo({
    url: `/package/goods/detail/detail?id=${id}`,
  });
};

const onAddBtnTap = () => {
  Taro.navigateTo({
    url: "/package/goods/add/add",
  });
};

const getGoodList = () => {
  getGoodsReq(pagination, (res) => {
    const { isSuccess, data, message } = res.data;
    if (isSuccess) {
      goodList.value = data.data;
      pagination.total = data.total;
      setTimeout(() => {
        Taro.hideLoading();
      }, 500);
    } else {
      msg(message);
    }
    loadStatus.value = LoadStatus.more;
  });
};

const getGoodCategories = () => {
  getGoodCategoriesReq((res) => {
    const { isSuccess, data, message } = res.data;
    if (isSuccess) {
      goodCategories.value = data;
      goodCategories.value.unshift({ id: 0, name: "全部" });
    } else {
      msg(message);
    }
  });
};

onMounted(() => {
  getAccessToken();
  getGoodList();
  getGoodCategories();
  setTimeout(() => {
    requestUserInfo();
  }, 2000);
});
</script>

<template>
  <view class="home">
    <AtSearchBar
      v-model:value="pagination.search"
      @clear="onSearchClear"
      @action-click="onSearchClick"
    />
    <swiper
      class="swiper"
      indicatorColor="#999"
      indicatorActiveColor="#ff6b81"
      current="current"
      :duration="swiperDuration"
      :interval="swiperInterval"
      :circular="true"
      :autoplay="true"
      :indicatorDots="true"
    >
      <swiper-item v-for="(item, idx) in imgUrls" :key="idx">
        <image :src="item" class="slide-image" />
      </swiper-item>
    </swiper>
    <nut-tabs
      v-model="tabIndex"
      title-scroll
      :title-gutter="goodCategories.length"
      name="tabName"
    >
      <nut-tab-pane
        v-for="(category, index) in goodCategories"
        :title="category.name"
        :pane-key="index"
      >
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
              @tap="onGoodCardTap(good.id)"
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
              @tap="onGoodCardTap(good.id)"
            />
          </view>
        </view>
      </nut-tab-pane>
    </nut-tabs>
    <AtLoadMore
      :moreBtnStyle="'color:#999;border:none;'"
      @click="handleLoadClick"
      :status="loadStatus"
    />
    <movable-area>
      <movable-view direction="all" x="600rpx" y="1150rpx" @tap="onAddBtnTap">
        <view class="container">
          <image class="img" src="@/assets/icon/home_add.png" />
        </view>
      </movable-view>
    </movable-area>
  </view>
</template>

<style lang="scss">
.home {
  overflow-x: hidden;
  .swiper {
    margin: 20rpx;
    border-radius: $border-radius;
    overflow: hidden;
    .slide-image {
      height: 100%;
      width: 100%;
    }
  }
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
  .at-load-more {
    height: 100rpx;
  }
  .at-fab {
    position: fixed;
    bottom: 20rpx;
    right: 20rpx;
  }
}
movable-area {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  movable-view {
    position: fixed;
    bottom: 20rpx;
    right: 20rpx;
    width: 100rpx;
    height: 100rpx;
    pointer-events: auto;
    .container {
      height: 100rpx;
      width: 100rpx;
      border-radius: 50%;
      background-color: $primary;
      display: flex;
      align-items: center;
      justify-content: center;
      &:active {
        background-color: $primary;
      }
      .img {
        width: 65%;
        height: 65%;
      }
    }
  }
}

.nut-tab-pane {
  padding: 0;
}

.nut-tabs__titles .nut-tabs__list {
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}

.nut-tabs__titles-item.active {
  color: $text-color;
}

.nut-tabs__titles-item.active .nut-tabs__titles-item__line {
  background: $primary;
}
</style>
