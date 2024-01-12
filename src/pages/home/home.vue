<script lang="ts">
import type { GoodType } from "@/models/good/good";
import { AtSearchBar, AtLoadMore } from "taro-ui-vue3";
import GoodCard from "@/components/home/GoodCard.vue";
import { ref, onMounted, onUnmounted, reactive, computed, watch } from "vue";
import { LoadStatus } from "@/enums/index";
import Taro from "@tarojs/taro";
import { getGoodsReq } from "@/apis/good";
import { getGoodCategoriesReq } from "@/apis/goodCategory";
import { goPage, msg } from "@/utils/common";
import { BASE_URL } from "@/utils/config";
import { useEventCenter } from "@/hooks/useEvent";
import { useStore } from "@/stores";
import { storeToRefs } from "pinia";
import { getBannerReq } from "@/apis/banner";
import "@/hooks/useUpdate";

const { readyChatMessages } = storeToRefs(useStore());

const { refreshUnReadMsgNum } = useStore();

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

const imgUrls = ref([]);

const swiperDuration = 500;
const swiperInterval = 5000;

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

const getBannerList = () => {
  getBannerReq((res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      imgUrls.value = data.map((d) => d.imgUrl);
    }
  });
};

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
  goPage(`/package/goods/detail/detail?id=${id}`, {
    acceptDataFromGoodDetail: () => {
      getGoodList();
    },
  });
};

const onAddBtnTap = () => {
  goPage("/package/goods/add/add");
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

const onHomeRefreshDataHandler = () => {
  getGoodList();
};

Taro.usePullDownRefresh(() => {
  pagination.search = "";
  getGoodList();
  setTimeout(() => {
    Taro.stopPullDownRefresh();
  }, 1000);
});

Taro.useDidShow(() => {
  refreshUnReadMsgNum();
});

onMounted(() => {
  useEventCenter();
  getGoodList();
  getGoodCategories();
  getBannerList();
  Taro.eventCenter.trigger("login");
  Taro.eventCenter.on("homeRefreshData", onHomeRefreshDataHandler);
});

onUnmounted(() => {
  Taro.eventCenter.off();
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
        <image :src="`${BASE_URL}/${item}`" class="slide-image" />
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
              :status="good.status"
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
              :status="good.status"
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
    <view class="position-fixed w-0 h-0 c-transparent">
      {{ readyChatMessages.length }}
    </view>
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
