<script lang="ts">
import type GoodCardProps from "@/components/home/GoodCard";
import { AtSearchBar, AtLoadMore, AtTabs, AtTabsPane } from "taro-ui-vue3";
import GoodCard from "@/components/home/GoodCard.vue";
import { ref, onMounted } from "vue";
import { LoadStatus } from "@/enums/index";
import icon_add from "@/assets/icon/home_add.png";

const imgUrls = [
  "https://img10.360buyimg.com/babel/s700x360_jfs/t25855/203/725883724/96703/5a598a0f/5b7a22e1Nfd6ba344.jpg!q90!cc_350x180",
  "https://img11.360buyimg.com/babel/s700x360_jfs/t1/4776/39/2280/143162/5b9642a5E83bcda10/d93064343eb12276.jpg!q90!cc_350x180",
  "https://img14.360buyimg.com/babel/s700x360_jfs/t1/4099/12/2578/101668/5b971b4bE65ae279d/89dd1764797acfd9.jpg!q90!cc_350x180",
];

const swiperDuration = 500;
const swiperInterval = 2000;
const tabList = [
  { title: "全部分类" },
  { title: "标签页2" },
  { title: "标签页3" },
  { title: "标签页4" },
  { title: "标签页5" },
  { title: "标签页6" },
  { title: "标签页7" },
];

const goodsInfo: GoodCardProps[] = [
  {
    id: 0,
    imgUrl: "../../assets/images/OIP-b.jpg",
    description:
      "大大代码块雷锋精神独立来快速减肥上了控股了NSF发货说几句废话是南非士大夫你说的开发商的返回的是和安拉胡多久啊是",
    price: 200,
    tags: ["99新"],
    user: {
      id: 1,
      name: "尼古拉斯·赵四",
      avatarUrl: "../../assets/images/OIP-C.jpg",
    },
  },
  {
    id: 1,
    imgUrl: "../../assets/images/OIP-C (1).jpg",
    description:
      "大大代码块雷锋精神独立来快速减肥上了控股了NSF发货说几句废话是南非士大夫你说的开发商的返回的是和安拉胡多久啊是",
    price: 200,
    tags: ["99新", "55新", "daa", "dajda"],
    user: {
      id: 1,
      name: "尼古拉斯·赵四",
      avatarUrl: "../../assets/images/OIP-C.jpg",
    },
  },
  {
    id: 2,
    imgUrl: "../../assets/images/OIP-b.jpg",
    description:
      "大大代码块雷锋精神独立来快速减肥上了控股了NSF发货说几句废话是南非士大夫你说的开发商的返回的是和安拉胡多久啊是",
    price: 200,
    tags: ["99新"],
    user: {
      id: 1,
      name: "尼古拉斯·赵四",
      avatarUrl: "../../assets/images/OIP-C.jpg",
    },
  },
  {
    id: 3,
    imgUrl: "../../assets/images/OIP-b.jpg",
    description:
      "大大代码块雷锋精神独立来快速减肥上了控股了NSF发货说几句废话是南非士大夫你说的开发商的返回的是和安拉胡多久啊是",
    price: 200,
    tags: ["99新"],
    user: {
      id: 1,
      name: "尼古拉斯·赵四",
      avatarUrl: "../../assets/images/OIP-C.jpg",
    },
  },
  {
    id: 4,
    imgUrl: "../../assets/images/OIP-b.jpg",
    description:
      "大大代码块雷锋精神独立来快速减肥上了控股了NSF发货说几句废话是南非士大夫你说的开发商的返回的是和安拉胡多久啊是",
    price: 200,
    tags: ["99新"],
    user: {
      id: 1,
      name: "尼古拉斯·赵四",
      avatarUrl: "../../assets/images/OIP-C.jpg",
    },
  },
  {
    id: 5,
    imgUrl: "../../assets/images/OIP-b.jpg",
    description:
      "大大代码块雷锋精神独立来快速减肥上了控股了NSF发货说几句废话是南非士大夫你说的开发商的返回的是和安拉胡多久啊是",
    price: 200,
    tags: ["99新"],
    user: {
      id: 1,
      name: "尼古拉斯·赵四",
      avatarUrl: "../../assets/images/OIP-C.jpg",
    },
  },
  {
    id: 6,
    imgUrl: "../../assets/images/OIP-b.jpg",
    description:
      "大大代码块雷锋精神独立来快速减肥上了控股了NSF发货说几句废话是南非士大夫你说的开发商的返回的是和安拉胡多久啊是",
    price: 200,
    tags: ["99新"],
    user: {
      id: 1,
      name: "尼古拉斯·赵四",
      avatarUrl: "../../assets/images/OIP-C.jpg",
    },
  },
];
</script>

<script setup lang="ts">
let searchText = ref("");
let loadStatus = ref<string>(LoadStatus.more);

const tabCurrent = ref(0);

const onActionClick = () => {
  console.log(searchText.value);
};

const onSearchClear = () => {
  searchText.value = " ";
};

const handleLoadClick = () => {
  loadStatus.value = LoadStatus.loading;
};

const handleTabClick = (value) => {
  tabCurrent.value = value;
};

onMounted(() => {});
</script>

<template>
  <view class="home">
    <AtSearchBar
      v-model:value="searchText"
      @clear="onSearchClear"
      @action-click="onActionClick"
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
    <AtTabs
      :current="tabCurrent"
      scroll
      :tabList="tabList"
      @click="handleTabClick"
    >
      <AtTabsPane :current="tabCurrent" :index="0">
        <view class="goods-view">
          <GoodCard
            v-for="good in goodsInfo"
            :ref="'goodCard' + good.id"
            :id="good.id"
            :img-url="good.imgUrl"
            :description="good.description"
            :price="good.price"
            :tags="good.tags"
            :user="good.user"
          />
        </view>
      </AtTabsPane>
      <AtTabsPane :current="tabCurrent" :index="1">
        <view style="font-size: 18px; text-align: center; height: 100px"
          >标签页二的内容</view
        >
      </AtTabsPane>
      <AtTabsPane :current="tabCurrent" :index="2">
        <view style="font-size: 18px; text-align: center; height: 100px"
          >标签页三的内容</view
        >
      </AtTabsPane>
      <AtTabsPane :current="tabCurrent" :index="3">
        <view style="font-size: 18px; text-align: center; height: 100px"
          >标签页四的内容</view
        >
      </AtTabsPane>
      <AtTabsPane :current="tabCurrent" :index="4">
        <view style="font-size: 18px; text-align: center; height: 100px"
          >标签页五的内容</view
        >
      </AtTabsPane>
      <AtTabsPane :current="tabCurrent" :index="5">
        <view style="font-size: 18px; text-align: center; height: 100px"
          >标签页六的内容</view
        >
      </AtTabsPane>
    </AtTabs>
    <AtLoadMore
      :moreBtnStyle="'color:#999;border:none;'"
      @click="handleLoadClick"
      :status="loadStatus"
    />
    <movable-area>
      <movable-view direction="all" x="600rpx" y="1150rpx">
        <cover-view class="container">
          <cover-image class="img" :src="icon_add" />
        </cover-view>
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
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 46%);
    grid-gap: 20rpx;
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
      background-color: $primary-bold;
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
</style>
