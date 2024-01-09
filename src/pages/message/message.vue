<script setup lang="ts">
import type { ChatMessageRowType } from "@/models/message/chatMessage";

import MessageItem from "@/components/message/item.vue";
import { ref, onMounted, computed } from "vue";
import Taro from "@tarojs/taro";
import { useStore } from "@/stores";
import { storeToRefs } from "pinia";
import moment from "moment";
import { goPage } from "@/utils/common";

const { readyChatMessages, userInfo } = storeToRefs(useStore());

const { removeChatMessageRow } = useStore();

let searchText = ref("");

const swipeRef = ref();

const chatMessageList = ref<ChatMessageRowType[]>([]);

const chatMessagesComputed = computed(() => {
  chatMessageList.value = readyChatMessages.value;
  return chatMessageList.value.filter(
    (rcm) =>
      rcm.chatMessages.length != 0 &&
      rcm.targetInfo.name.includes(searchText.value)
  );
});

const convertMessageContent = (message: ChatMessageRowType) => {
  const msg = message.chatMessages[message.chatMessages.length - 1];
  if (msg.type === 1) return msg.content;
  else if (msg.type === 2) return "[图片消息]";
  else if (msg.type === 3) return "[订单消息]";
  else if (msg.type === 4)
    return `${
      msg.senderId === userInfo.value.id ? "您" : "对方"
    }撤回了一条消息`;
  else return "";
};

const userUnreadNum = (message: ChatMessageRowType) => {
  const { chatMessages } = message;
  return chatMessages.filter(
    (c) => c.receiverId === userInfo.value.id && !c.isRead
  ).length;
};

const onSearchClear = () => {
  searchText.value = "";
};

const onActionClick = () => {
  chatMessageList.value = readyChatMessages.value.filter((rcm) =>
    rcm.targetInfo.name.includes(searchText.value)
  );
};

const onMessageTap = (targetId: number) => {
  goPage(`/package/chats/chat/chat?targetId=${targetId}`);
};

const onDeleteMessageClick = (targetId: number, index: number) => {
  removeChatMessageRow(targetId);
  swipeRef.value[index].close();
};

Taro.useDidShow(() => {
  Taro.eventCenter.trigger("unReadChatsUpdate");
});

Taro.usePullDownRefresh(() => {
  searchText.value = "";
  setTimeout(() => {
    Taro.stopPullDownRefresh();
  }, 1000);
});

onMounted(() => {});
</script>
<template>
  <view class="message">
    <AtSearchBar
      placeholder="搜索联系人"
      v-model:value="searchText"
      @clear="onSearchClear"
      @action-click="onActionClick"
    />
    <nut-empty
      v-if="chatMessagesComputed.length === 0"
      image="empty"
      description="暂无消息"
    ></nut-empty>
    <nut-swipe-group lock>
      <nut-swipe
        ref="swipeRef"
        v-for="(message, index) in chatMessagesComputed"
        :name="`${message.targetInfo.id}`"
      >
        <MessageItem
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
        <template #right>
          <nut-button
            shape="square"
            style="height: 100%"
            type="primary"
            @click="onDeleteMessageClick(message.targetInfo.id, index)"
          >
            删除
          </nut-button>
        </template>
      </nut-swipe>
    </nut-swipe-group>
  </view>
</template>

<style lang="scss"></style>
