<script setup lang="ts">
import type {
  ChatMessageType,
  TargetInfoType,
} from "@/models/message/chatMessage";

import { onBeforeMount, onMounted, onUnmounted, ref, computed } from "vue";
import Taro from "@tarojs/taro";
import { useStore } from "@/stores";
import {
  getChatMessagesReq,
  readMessageReq,
  addChatMessageReq,
} from "@/apis/chatMessage";
import { BASE_URL, PICTURE_ICON } from "@/utils/config";
import moment from "moment";
import { IconFont } from "@nutui/icons-vue-taro";
import { nextTick } from "@tarojs/runtime";
import { storeToRefs } from "pinia";

enum ChooseMode {
  表情,
  其它,
}

const { readyChatMessages } = storeToRefs(useStore());

const { userInfo, addChatMessageRow, readChatMessage } = useStore();

let userId = 0;

let targetInfo: TargetInfoType = {
  id: 0,
  name: "",
  loginName: "",
  avatarUrl: "",
  roleId: 0,
};

const collapseModel = ref(false);

const message = ref("");

const emojiIndex = ref(0);

const emojisList = ref<{ title: string; emojis: string[] }[]>([]);

const chooseMode = ref(ChooseMode.其它);

const chatMessageList = computed<ChatMessageType[]>(
  () =>
    readyChatMessages.value.find((rcm) => rcm.targetInfo.id === userId)
      ?.chatMessages ?? []
);

const style = computed(() => {
  let padding = 0;
  if (collapseModel.value) {
    if (chooseMode.value == ChooseMode.表情) padding = 150 + 508;
    else if (chooseMode.value == ChooseMode.其它) padding = 150 + 73;
  } else padding = 150;

  return {
    "padding-bottom": `calc(${padding}rpx + env(safe-area-inset-bottom))`,
  };
});

const getTargetId = () => {
  const { params } = Taro.useRouter();
  const { targetId } = params;
  if (targetId) userId = Number(targetId);
};

const getEmojiList = () => {
  Taro.request({
    url: `${BASE_URL}/Files/Static/emoji.json`,
    method: "GET",
    timeout: 10000,
    success: (res: any) => {
      const { data } = res;
      emojisList.value = data;
    },
    fail: (err) => {
      Taro.showToast({
        title: err.errMsg,
        icon: "none",
        duration: 3000,
      });
    },
  });
};

const getTargetInfo = () => {
  var target = readyChatMessages.value.find(
    (cm) => cm.targetInfo.id === userId
  );

  if (target) {
    targetInfo = target.targetInfo;
    nextTick(() => {
      Taro.setNavigationBarTitle({
        title: targetInfo.name,
      });
    });
  }
};

const getChatMessageFormDataBase = (targetId: number, time: string) => {
  getChatMessagesReq(targetId, time, (res) => {
    const { data } = res.data;
    if (data) {
      addChatMessageRow([data]);
    }
  });
};

const getTime = (time: string | Date) => {
  const momentTime = moment(time);
  if (momentTime.format("YYYYMMDD") == moment(Date.now()).format("YYYYMMDD"))
    return momentTime.format("HH:mm");
  else if (momentTime.format("YYYYMM") == moment(Date.now()).format("YYYYMM"))
    return momentTime.format("MM/DD HH:mm");
  else return momentTime.format("YYYY/MM/DD HH:mm");
};

const readMsg = () => {
  const unReadMsgIds = chatMessageList.value
    .filter((cm) => cm.receiverId === userInfo.id && !cm.isRead)
    .map((item) => item.id);
  if (unReadMsgIds.length > 0) {
    readMessageReq(unReadMsgIds, (res) => {
      const { isSuccess } = res.data;
      if (isSuccess) {
        if (unReadMsgIds.length > 0) readChatMessage(userId);
      }
    });
  }
};

const isShowTime = (index: number) => {
  if (index === 0) return true;
  if (index > 0 && index < chatMessageList.value.length) {
    const curr = chatMessageList.value[index];
    const front = chatMessageList.value[index - 1];
    return moment(curr.createTime).diff(moment(front.createTime), "m") > 5;
  } else return false;
};

const scrollToBottom = () =>
  nextTick(() => {
    Taro.pageScrollTo({
      selector: "#bottom",
      offsetTop: 0,
      duration: 1000,
      fail: (res) => {
        console.log("滚动失败", res);
      },
    });
  });

const readSendChatMessageHandler = () => {
  scrollToBottom();
  setTimeout(() => {
    readMsg();
  }, 1000);
};

const onChooseEmojiTap = () => {
  chooseMode.value = ChooseMode.表情;
  collapseModel.value = true;
  scrollToBottom();
};

const onInputCoverTap = () => {
  collapseModel.value = false;
  scrollToBottom();
};

const onAddTap = () => {
  chooseMode.value = ChooseMode.其它;
  collapseModel.value = true;
  scrollToBottom();
};

const onSendClick = () => {
  addChatMessageReq(
    {
      senderId: userInfo.id,
      receiverId: userId,
      content: message.value,
      type: 1,
    },
    (res) => {
      const { isSuccess, data } = res.data;
      if (isSuccess) {
        addChatMessageRow([{ targetInfo, chatMessages: [data] }]);
        message.value = "";
        scrollToBottom();
      }
    }
  );
};

onBeforeMount(() => {
  getTargetId();
  getTargetInfo();
});

onMounted(() => {
  getChatMessageFormDataBase(userId, "");
  getEmojiList();
  scrollToBottom();
  setTimeout(() => {
    readMsg();
  }, 1000);
  Taro.eventCenter.on("readSendChatMessage", readSendChatMessageHandler);
});

onUnmounted(() => {
  Taro.eventCenter.off("readSendChatMessage", readSendChatMessageHandler);
});
</script>
<template>
  <view class="chat" :style="style">
    <view
      v-for="(message, index) in chatMessageList"
      class="flex flex-col flex-gap-2"
    >
      <view class="flex justify-center">
        <text
          v-if="isShowTime(index)"
          class="bg-#9a9a9a33 p-1 rounded-1 text-25"
        >
          {{ getTime(message.createTime) }}
        </text>
      </view>
      <view
        :class="['chat-item', { reverse: message.senderId === userInfo.id }]"
      >
        <image
          :src="`${BASE_URL}/${
            message.senderId === userInfo.id
              ? userInfo.avatarUrl
              : targetInfo.avatarUrl
          }`"
        />
        <view
          :class="[
            'chat-item-wrap',
            { 'bg-i': message.senderId === userInfo.id },
          ]"
          user-select
        >
          {{ message.content }}
        </view>
        <view
          v-if="message.senderId === userInfo.id"
          :class="['flex', 'items-end', message.isRead ? 'c-#908989' : 'c-red']"
        >
          {{ message.isRead ? "已读" : "未读" }}
        </view>
      </view>
    </view>
    <view id="bottom"></view>
    <view
      v-if="collapseModel"
      class="cover-input"
      @tap="onInputCoverTap"
    ></view>
    <view class="bottom-fixed">
      <view class="w-full flex justify-between items-center flex-gap-2">
        <input
          class="bg-#F5F3F2 c-#696a6d p-2 flex-1 rounded-3"
          v-model="message"
          :cursor-spacing="15"
          placeholder="说点什么~"
          @tap.stop=""
        />
        <IconFont
          size="22"
          :name="`${BASE_URL}/Files/SystemResource/20231220/20231220170707_C7E7F871-84E0-47EB-B4A9-4707FE6973DC.png`"
          @tap.stop="onChooseEmojiTap"
        ></IconFont>
        <nut-button
          v-if="message"
          type="primary"
          size="small"
          @click="onSendClick"
        >
          发送
        </nut-button>
        <IconFont v-else name="uploader" @tap.stop="onAddTap"></IconFont>
      </view>
      <view v-if="collapseModel" class="w-full">
        <view
          v-if="chooseMode == ChooseMode.表情"
          class="h-500 flex flex-col p-1"
        >
          <view class="flex justify-between text-50">
            <view
              v-for="(emoji, index) in emojisList"
              :class="[{ 'emoji-active': index === emojiIndex }]"
              @tap="emojiIndex = index"
            >
              {{ emoji.title }}
            </view>
          </view>
          <view class="p-1 text-40 flex flex-wrap overflow-y-auto">
            <view
              v-for="emoji in emojisList[emojiIndex].emojis"
              class="w-65 h-65 flex items-end justify-center flex-gap-2"
              @tap="message += emoji"
            >
              {{ emoji }}
            </view>
          </view>
        </view>
        <image
          v-else
          class="w-65 h-65 mt-1"
          :src="`${BASE_URL}/${PICTURE_ICON}`"
          @tap.stop=""
        />
      </view>
    </view>
  </view>
</template>
<style lang="scss">
.chat {
  color: $text-color;
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  .bottom-p-150 {
    padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
  }
  .bottom-p-700 {
    padding-bottom: calc(700rpx + env(safe-area-inset-bottom));
  }
  .reverse {
    flex-direction: row-reverse;
  }
  .bg-i {
    background-color: #ff6b8124;
  }
  &-item {
    display: flex;
    gap: 16rpx;
    margin-bottom: 24rpx;
    image {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }
    &-wrap {
      max-width: 490rpx;
      line-height: 46rpx;
      padding: 16rpx;
      background-color: #00ffff3b;
      border-radius: 12rpx;
      word-break: break-all;
    }
  }
  .cover-input {
    position: fixed;
    height: 100%;
    width: 96%;
  }
  .bottom-fixed {
    width: calc(100% - 32rpx);
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 16rpx;
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-shadow: rgba(0, 0, 0, 0.25) 32rpx 25rpx 50rpx 8rpx;
    flex-direction: column;
  }
  .nut-collapse {
    width: 100%;
  }
  .nut-collapse-item .nut-collapse-item__title {
    padding: 0 16rpx 16rpx 16rpx;
  }
  .nut-collapse-item
    .nut-collapse__item-wrapper
    .nut-collapse__item-wrapper__content,
  .nut-collapse-item
    .nut-collapse__item-wrapper
    .nut-collapse__item-extraWrapper__extraRender,
  .nut-collapse-item
    .nut-collapse__item-extraWrapper
    .nut-collapse__item-wrapper__content,
  .nut-collapse-item
    .nut-collapse__item-extraWrapper
    .nut-collapse__item-extraWrapper__extraRender {
    padding: 16rpx;
  }
  .emoji-active {
    border-bottom: 1rpx red solid;
  }
}
</style>
