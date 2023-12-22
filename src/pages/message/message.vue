<script setup lang="ts">
import type { ChatMessageRowType } from "@/models/message/chatMessage";

import MessageItem from "@/components/message/item.vue";
import { ref, onMounted } from "vue";
import Taro from "@tarojs/taro";
import { useStore } from "@/stores";
import { storeToRefs } from "pinia";
import moment from "moment";

const { readyChatMessages, userInfo } = storeToRefs(useStore());

let searchText = ref("");

const convertMessageContent = (message: ChatMessageRowType) => {
  const msg = message.chatMessages[message.chatMessages.length - 1];
  if (msg.type === 1) return msg.content;
  else if (msg.type === 2) return "[图片消息]";
  else if (msg.type === 3) return "[订单消息]";
  else if (msg.type === 4) return "对方撤回一条消息";
  else return "";
};

const userUnreadNum = (message: ChatMessageRowType) => {
  const { chatMessages } = message;
  return chatMessages.filter(
    (c) => c.receiverId === userInfo.value.id && !c.isRead
  ).length;
};

const onSearchClear = () => {
  searchText.value = " ";
};

const onActionClick = () => {
  console.log(searchText.value);
};

const onMessageTap = (targetId: number) => {
  Taro.navigateTo({
    url: `/package/chats/chat/chat?targetId=${targetId}`,
  });
};

Taro.useDidShow(() => {
  Taro.eventCenter.trigger("unReadChatsUpdate");
});

onMounted(() => {});
</script>
<template>
  <view class="message">
    <AtSearchBar
      placeholder="搜索聊天记录/联系人"
      v-model:value="searchText"
      @clear="onSearchClear"
      @action-click="onActionClick"
    />
    <MessageItem
      v-for="message in readyChatMessages"
      :user-name="message.targetInfo.name"
      :avatar-url="message.targetInfo.avatarUrl"
      :time="
        moment(
          message.chatMessages[message.chatMessages.length - 1].createTime
        ).toDate()
      "
      :message="convertMessageContent(message)"
      :good-img-url="message.chatMessages[0]?.good?.imgUrls[0] ?? ''"
      :un-read-num="userUnreadNum(message)"
      @tap="onMessageTap(message.targetInfo.id)"
    />
  </view>
</template>

<style lang="scss"></style>
