<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { AtTextarea, AtTag, AtButton } from "taro-ui-vue3";
import Taro from "@tarojs/taro";
import { getGoodCategoriesReq } from "@/apis/goodCategory";
import { BASE_URL } from "@/utils/config";
import { useStore } from "@/stores/index";
import { msg } from "@/utils/common";
import { addGoodReq } from "@/apis/good";

const DEFAULT_CATEGORIES = { id: 0, name: "无" };

const UPLOADURL = `${BASE_URL}/api/Files/UploadFile`;

const { accessToken } = useStore();

const REQUEST_HEADER = {
  Authorization: `Bearer ${accessToken}`,
};

const good = reactive<{
  description: string;
  imgUrls: string[];
  categoryId: number;
  price: number;
  tags: string[];
}>({
  description: "",
  imgUrls: [],
  categoryId: 0,
  price: 0,
  tags: [],
});

const categories = ref<{ id: number; name: string }[]>([]);

const unChooseTagList = ref<string[]>([
  "98成新",
  "9成新",
  "8成新",
  "美女自用一手货",
]);

const fileList = ref<any[]>([]);

const categoryIndex = ref(DEFAULT_CATEGORIES.id);

const isOpened = ref(false);

const customTagName = ref("");

const handleCategoryChange = (e) => {
  const { value } = e.detail;
  categoryIndex.value = value;
  var category = categories.value[value];
  good.categoryId = category.id;
};

const onTagClick = (name: string) => {
  const currentIndex = good.tags.findIndex((t) => t === name);
  if (currentIndex >= 0) {
    good.tags.splice(currentIndex, 1);
    unChooseTagList.value.push(name);
  }
};

const onUnChooseTagClick = (name: string) => {
  const currentIndex = unChooseTagList.value.findIndex((t) => t === name);
  if (currentIndex >= 0) {
    unChooseTagList.value.splice(currentIndex, 1);
    good.tags.push(name);
  }
};

const onAddTagConfirm = () => {
  const tagName = customTagName.value;
  if (!good.tags.some((t) => t === tagName)) {
    good.tags.push(tagName);
  } else msg("该标签已存在");
  customTagName.value = "";
};

const onUploadSuccess = (res) => {
  const result = JSON.parse(res.data.data);
  const { isSuccess, data, message } = result;
  if (isSuccess) {
    fileList.value[fileList.value.length - 1].name = data[0];
  } else {
    msg(message ?? "未知错误");
  }
};

const onPublishGoodClick = () => {
  if (!good.description) {
    msg("请输入物品描述");
    return;
  }
  if (!fileList.value.some((f) => f.status === "success")) {
    msg("请至少上传一张物品图片");
    return;
  }
  good.imgUrls = fileList.value
    .filter((f) => f.status === "success")
    .map((f) => f.name);
  if (good.categoryId === 0) {
    msg("请选择物品分类");
    return;
  }
  let priceString = good.price as unknown as string;
  priceString = parseFloat(priceString).toFixed(2);
  good.price = parseFloat(priceString);
  if (good.price <= 0) {
    msg("请输入物品价格");
    return;
  }
  Taro.showLoading();
  setTimeout(() => {
    Taro.hideLoading();
  }, 10000);
  addGoodReq({ ...good, userId: 0 }, (res) => {
    const { isSuccess, message } = res.data;
    if (isSuccess) {
      Taro.hideLoading();
      msg("发布成功");
      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
    } else {
      msg(message ?? "未知错误");
    }
  });
};

const getGoodCategories = () => {
  getGoodCategoriesReq((res) => {
    const { data, isSuccess, message } = res.data;
    if (isSuccess) categories.value = [DEFAULT_CATEGORIES, ...data];
    else {
      Taro.showToast({
        title: message,
        icon: "none",
      });
    }
  });
};
onMounted(() => {
  getGoodCategories();
});
</script>
<template>
  <view class="good-add">
    <AtTextarea
      v-model:value="good.description"
      placeholder="请输入物品描述"
      maxLength="300"
      height="200"
    />
    <nut-uploader
      :url="UPLOADURL"
      v-model:file-list="fileList"
      multiple
      name="formFile"
      :headers="REQUEST_HEADER"
      @success="onUploadSuccess"
    ></nut-uploader>
    <picker
      mode="selector"
      :range="categories"
      range-key="name"
      :value="categoryIndex"
      @change="handleCategoryChange"
    >
      <AtList>
        <AtListItem
          title="物品分类"
          :extraText="categories.find((c) => c.id === good.categoryId)?.name"
          arrow="right"
        ></AtListItem>
      </AtList>
    </picker>
    <view class="flex p-2 items-center">
      <text class="w-72">价格</text>
      <nut-input
        placeholder="请输入价格"
        v-model="good.price"
        type="digit"
        max-length="13"
      />
    </view>
    <view class="tags">
      <text class="h-44">标签</text>
      <AtTag
        v-for="tag in good.tags"
        circle
        :active="true"
        @click="onTagClick(tag)"
      >
        <view>
          {{ tag }}
          <text class="close-icon"> &times; </text>
        </view>
      </AtTag>
      <AtButton
        type="secondary"
        size="small"
        :circle="true"
        @click="isOpened = true"
      >
        +
      </AtButton>
    </view>
    <view class="flex flex-gap-2 flex-wrap">
      <AtTag
        v-for="tag in unChooseTagList"
        circle
        :active="false"
        @click="onUnChooseTagClick(tag)"
      >
        <view>
          {{ tag }}
          <text class="close-icon"> &times; </text>
        </view>
      </AtTag>
    </view>
    <nut-button type="primary" @click="onPublishGoodClick">发布物品</nut-button>
    <nut-dialog
      title="添加标签"
      v-model:visible="isOpened"
      @cancel="isOpened = false"
      @ok="onAddTagConfirm"
    >
      <nut-input
        v-model="customTagName"
        placeholder="请输入标签名称"
        clearable
      />
    </nut-dialog>
  </view>
</template>
<style lang="scss">
.good-add {
  height: 100%;
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  color: #595959;
  .nut-uploader__preview-img .close {
    top: 20rpx;
    right: 10rpx;
    color: $primary;
  }
  .nut-uploader__preview {
    height: 217rpx;
    width: 217rpx;
  }
  .nut-uploader__preview-img__c {
    max-height: 217rpx;
    max-width: 217rpx;
  }
  .at-tag--active {
    color: $primary;
    border-color: $primary;
    background-color: #fff;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    padding: 16rpx;
    align-items: center;
    border-bottom: 1px solid #eff4f9;
    .close-icon {
      position: relative;
      left: 18rpx;
    }
    .at-button--small.at-button--circle {
      margin: 0;
      color: $primary;
      border-color: $primary;
      font-size: 60rpx;
      line-height: 50rpx;
    }
  }
}
</style>
