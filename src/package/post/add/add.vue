<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { AtTextarea } from "taro-ui-vue3";
import Taro from "@tarojs/taro";
import { BASE_URL } from "@/utils/config";
import { useStore } from "@/stores/index";
import { msg } from "@/utils/common";
import { addPostReq } from "@/apis/post";

const UPLOADURL = `${BASE_URL}/api/Files/UploadFile`;

const { accessToken } = useStore();

const REQUEST_HEADER = {
  Authorization: `Bearer ${accessToken}`,
};

const post = reactive<{
  text: string;
  imgUrls: string[];
}>({
  text: "",
  imgUrls: [],
});

const fileList = ref<any[]>([]);

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
  if (!post.text) {
    msg("请输入内容");
    return;
  }
  post.imgUrls = fileList.value
    .filter((f) => f.status === "success")
    .map((f) => f.name);
  Taro.showLoading();
  setTimeout(() => {
    Taro.hideLoading();
  }, 10000);
  addPostReq({ ...post }, (res) => {
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
onMounted(() => {});
</script>
<template>
  <view class="good-add">
    <AtTextarea
      v-model:value="post.text"
      placeholder="请输入内容"
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
    <nut-button type="primary" @click="onPublishGoodClick">发布帖子</nut-button>
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
