<script setup lang="ts">
import type { OrderType } from "@/models/good/order";

import { onBeforeMount, ref } from "vue";
import Taro from "@tarojs/taro";
import { BASE_URL } from "@/utils/config";
import { useStore } from "@/stores";
import { msg } from "@/utils/common";
import { addGoodAppraiseReq } from "@/apis/goodAppraise";
import { addChatMessageReq } from "@/apis/chatMessage";

const { accessToken } = useStore();

const UPLOADURL = `${BASE_URL}/api/Files/UploadFile`;

const REQUEST_HEADER = {
  Authorization: `Bearer ${accessToken}`,
};

const rate = ref(0);

const comment = ref("");

const order = ref<OrderType>();

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

const onPublishAppraiseClick = () => {
  const filesMap = fileList.value
    .filter((f) => f.status === "success")
    .map((f) => f.name);
  const imgUrl = filesMap.length > 0 ? filesMap[0] : undefined;
  if (order.value) {
    addGoodAppraiseReq(
      {
        rate: rate.value,
        userId: order.value.userId,
        sellerId: order.value.good.userId,
        goodId: order.value.goodId,
        comment: comment.value ? comment.value : undefined,
        commentImgUrl: imgUrl,
      },
      (res) => {
        const { isSuccess } = res.data;
        if (isSuccess) {
          if (order.value) {
            order.value.status = 5;
            addChatMessageReq(
              {
                senderId: order.value.userId,
                receiverId: order.value.good.userId,
                content: JSON.stringify(order.value),
                type: 3,
              },
              (_) => {}
            );
            msg("评价成功");
            setTimeout(() => {
              Taro.switchTab({
                url: "/pages/user/user",
              });
            }, 1000);
          }
        }
      }
    );
  } else {
    msg("发生错误");
  }
};

onBeforeMount(() => {
  const orderInfo = Taro.useRouter().params.orderInfo;
  if (orderInfo) {
    order.value = JSON.parse(decodeURI(orderInfo));
  }
});
</script>

<template>
  <view class="good-appraise">
    <view class="flex flex-gap-2 items-center">
      <text>评分：</text>
      <nut-rate v-model="rate" />
    </view>
    <AtTextarea
      v-model:value="comment"
      placeholder="请输入评价描述"
      maxLength="300"
      height="200"
    />
    <nut-uploader
      :url="UPLOADURL"
      v-model:file-list="fileList"
      maximum="1"
      multiple
      name="formFile"
      :headers="REQUEST_HEADER"
      @success="onUploadSuccess"
    ></nut-uploader>
    <nut-button type="primary" @click="onPublishAppraiseClick">
      发布评价
    </nut-button>
  </view>
</template>

<style lang="scss">
.good-appraise {
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
