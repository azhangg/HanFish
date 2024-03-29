<script setup lang="ts">
import type {
  ChatMessageType,
  TargetInfoType,
} from "@/models/message/chatMessage";
import type { OrderType } from "@/models/good/order";
import type { PostType } from "@/models/post/post";
import type { PostCommentType } from "@/models/post/postComment";

import { onBeforeMount, onMounted, onUnmounted, ref, computed } from "vue";
import Taro from "@tarojs/taro";
import { useStore } from "@/stores";
import {
  getChatMessagesReq,
  readMessageReq,
  addChatMessageReq,
  withDrawMessageReq,
  refuseMessageReq,
} from "@/apis/chatMessage";
import { getUserLikePostIdsReq } from "@/apis/postLike";
import { getUserCollectPostIdsReq } from "@/apis/postCollect";
import { BASE_URL, PICTURE_ICON } from "@/utils/config";
import moment from "moment";
import { IconFont } from "@nutui/icons-vue-taro";
import { nextTick } from "@tarojs/runtime";
import { storeToRefs } from "pinia";
import { goPage, msg } from "@/utils/common";
import emojiJson from "@/assets/emoji.json";

enum ChooseMode {
  表情,
  其它,
}

const UPLOADURL = `${BASE_URL}/api/Files/UploadFile`;

const { readyChatMessages } = storeToRefs(useStore());

const { userInfo, accessToken, addChatMessageRow, readChatMessage } =
  useStore();

const REQUEST_HEADER = {
  Authorization: `Bearer ${accessToken}`,
};

let userId = 0;

let targetInfo: TargetInfoType = {
  id: 0,
  name: "",
  loginName: "",
  avatarUrl: "",
  roleId: 0,
};

let x = 0;

let y = 0;

let oldesttFlag = false;

const uploadFileRef = ref();

const fileList = ref<any[]>([]);

const previewImgSrc = ref<{ src: string }[]>([]);

const focusLock = ref(false);

const collapseModel = ref(false);

const previewVisible = ref(false);

const withdrawVisible = ref(false);

const message = ref("");

const messageRow = ref<ChatMessageType>({
  id: 0,
  content: "",
  senderId: 0,
  receiverId: 0,
  type: 1,
  typeName: "",
  isRead: false,
  refusherIds: [],
  createTime: new Date(),
});

const overlayVisible = ref(false);

const emojiIndex = ref(0);

const collects = ref<number[]>([]);

const likes = ref<number[]>([]);

const emojisList = ref<{ title: string; emojis: string[] }[]>([]);

const chooseMode = ref(ChooseMode.其它);

const chatMessageList = computed<ChatMessageType[]>(() => {
  const result =
    readyChatMessages.value.find((rcm) => rcm.targetInfo.id === userId)
      ?.chatMessages ?? [];
  return result.filter((r) => !r.refusherIds.includes(userInfo.id));
});

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
  emojisList.value = emojiJson;
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

const communityMessage = (jsonContent: string) => {
  const content: {
    postInfo: PostType;
    comment: PostCommentType;
    receiveComment?: PostCommentType;
  } = JSON.parse(jsonContent);
  return content;
};

const getChatMessageFormDataBase = (targetId: number, time: string) => {
  getChatMessagesReq(targetId, time, (res) => {
    const { data } = res.data;
    if (data) {
      addChatMessageRow([data]);
      oldesttFlag = data.chatMessages.length === 0;
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

const orderStatus = (status: number) => {
  switch (status) {
    case 1:
      return "待付款";
    case 2:
      return "待发货";
    case 3:
      return "待收货";
    case 4:
      return "待评价";
    case 5:
      return "已完成";
    case 6:
      return "已取消";
    default:
      return "";
  }
};

const readMsg = () => {
  const unReadMsgIds = chatMessageList.value
    .filter((cm) => cm.receiverId === userInfo.id && !cm.isRead && cm.type != 3)
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
    focusLock.value = true;
    Taro.pageScrollTo({
      selector: "#bottom",
      offsetTop: 0,
      duration: 500,
      fail: (res) => {
        console.log("滚动失败", res);
      },
    });
    setTimeout(() => {
      focusLock.value = false;
    }, 500);
  });

const readSendChatMessageHandler = () => {
  scrollToBottom();
  setTimeout(() => {
    readMsg();
  }, 1000);
};

const orderContentParse = (content: string): OrderType => {
  return JSON.parse(content);
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
  if (message.value.trim())
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
  else msg("不能包含空格");
};

const onUploadSuccess = (res) => {
  const result = JSON.parse(res.data.data);
  const { isSuccess, data, message } = result;
  if (isSuccess) {
    addChatMessageReq(
      {
        senderId: userInfo.id,
        receiverId: userId,
        content: data[0],
        type: 2,
      },
      (res) => {
        const { isSuccess, data } = res.data;
        if (isSuccess) {
          addChatMessageRow([{ targetInfo, chatMessages: [data] }]);
          scrollToBottom();
        }
      }
    );
  } else {
    msg(message ?? "上传失败");
  }
};

const onUploadFailure = () => {
  if (fileList.value.length > 1) fileList.value.shift();
};

const onChoosePictureTap = () => {
  uploadFileRef.value.chooseImage();
};

const onMessageLongPress = (message: ChatMessageType, e) => {
  const { touches } = e;
  x = Math.floor(touches[0].clientX);
  y = Math.floor(touches[0].clientY);
  if (y < 100) y += 50;
  else y -= 50;
  messageRow.value = message;
  withdrawVisible.value =
    moment(messageRow.value.createTime).add(2, "m").valueOf() >
      moment().valueOf() && message.type != 5;
  overlayVisible.value = true;
};

const onPictureTap = (url: string) => {
  const src = `${BASE_URL}/${url}`;
  if (previewImgSrc.value.length > 0) previewImgSrc.value[0].src = src;
  else previewImgSrc.value.push({ src: src });
  previewVisible.value = true;
};

const onWithdrawTap = () => {
  withDrawMessageReq(messageRow.value.id, (res) => {
    const { isSuccess } = res.data;
    if (isSuccess) {
      messageRow.value.type = 4;
      addChatMessageRow([{ targetInfo, chatMessages: [messageRow.value] }]);
      overlayVisible.value = false;
    }
  });
};

const onDeleteMessageTap = () => {
  refuseMessageReq(messageRow.value.id, (res) => {
    const { isSuccess } = res.data;
    if (isSuccess) {
      messageRow.value.refusherIds.push(userInfo.id);
      addChatMessageRow([{ targetInfo, chatMessages: [messageRow.value] }]);
      overlayVisible.value = false;
      msg("删除成功");
    }
  });
};

const onMessageOfOrderTap = (orderInfo: string) => {
  const { id } = JSON.parse(orderInfo);
  if (id) goPage(`/package/user/deals/detail?orderId=${id}`);
};

const CommunityMessageTap = async (content: string) => {
  const data = communityMessage(content);
  await getUserLikePostIdsReq((res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      likes.value = data;
    }
  });
  await getUserCollectPostIdsReq((res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      collects.value = data;
    }
  });
  goPage(
    `/package/post/detail/detail?id=${
      data.postInfo.id
    }&isCollect=${collects.value.includes(
      data.postInfo.id
    )}&isLike=${likes.value.includes(data.postInfo.id)}`
  );
};

Taro.usePullDownRefresh(() => {
  if (chatMessageList.value.length > 0 && !oldesttFlag) {
    getChatMessageFormDataBase(
      userId,
      chatMessageList.value[0].createTime.toString()
    );
  }
  setTimeout(() => {
    Taro.stopPullDownRefresh();
  }, 1000);
});

onBeforeMount(() => {
  getTargetId();
  getTargetInfo();
});

onMounted(() => {
  focusLock.value = true;
  getChatMessageFormDataBase(userId, "");
  getEmojiList();
  Taro.eventCenter.on("readSendChatMessage", readSendChatMessageHandler);
  scrollToBottom();
  setTimeout(() => {
    readMsg();
    focusLock.value = false;
  }, 1000);
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
      <view v-if="message.type === 4" class="flex justify-center mb-2">
        <text class="bg-#9a9a9a33 p-1 rounded-1 text-25">
          {{
            `${
              message.senderId === userInfo.id ? "您" : targetInfo.name
            }撤回了一条消息`
          }}
        </text>
      </view>
      <view
        v-else
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
          v-if="message.type === 1"
          :class="[
            'chat-item-wrap',
            { 'bg-i': message.senderId === userInfo.id },
          ]"
          user-select
          @longpress="onMessageLongPress(message, $event)"
        >
          <view>
            {{ message.content }}
          </view>
        </view>
        <image
          v-else-if="message.type === 2"
          class="messagee-picture"
          :src="`${BASE_URL}/${message.content}`"
          @longpress="onMessageLongPress(message, $event)"
          @tap="onPictureTap(message.content)"
        />
        <view
          v-else-if="message.type === 3"
          class="flex flex-gap-2 p-2 bg-#cec63a2b rounded-2"
          @tap="onMessageOfOrderTap(message.content)"
        >
          <image
            style="height: 150rpx; width: 150rpx; border-radius: 8rpx"
            :src="`${BASE_URL}/${
              orderContentParse(message.content)?.good?.imgUrls[0] ?? ''
            }`"
          />
          <view class="flex w-240 flex-col flex-gap-1 justify-between">
            <view class="text-ellipsis line-clamp-2">
              {{ orderContentParse(message.content).good.description }}
            </view>
            <view class="text-36 c-red font-bold">
              {{ orderStatus(orderContentParse(message.content).status) }}
            </view>
          </view>
        </view>
        <view
          v-if="message.senderId === userInfo.id && message.type != 4"
          :class="['flex', 'items-end', message.isRead ? 'c-#908989' : 'c-red']"
        >
          {{ message.isRead ? "已读" : "未读" }}
        </view>
        <view
          v-else-if="message.type === 5"
          class="flex flex-col flex-gap-2"
          @tap="CommunityMessageTap(message.content)"
        >
          <view class="flex w-500 pl-2 pr-2 flex-gap-2 items-center rounded-1">
            <image
              v-if="communityMessage(message.content).comment.avatarUrl"
              style="height: 50rpx; width: 50rpx; border-radius: 25rpx"
              :src="`${BASE_URL}/${
                communityMessage(message.content).comment.avatarUrl
              }`"
            />
            <view class="line-clamp-3">
              {{ communityMessage(message.content).comment.userName }}
            </view>
          </view>
          <view class="w-500 p2 bg-black/5 rounded-1">
            <view class="line-clamp-3">
              {{ `${communityMessage(message.content).postInfo.text}` }}
            </view>
          </view>
          <view class="flex flex-wrap flex-gap-2 w-500 pl-2 pr-2 rounded-1">
            <nut-tag
              v-if="communityMessage(message.content).receiveComment"
              type="success"
            >
              回复
            </nut-tag>
            <nut-tag v-else type="warning"> 评论 </nut-tag>
            <text
              v-if="communityMessage(message.content).receiveComment"
              class="p-1 bg-black/5 rounded-2 text-24"
            >
              我：{{
                communityMessage(message.content).receiveComment?.comment ?? ""
              }}
            </text>
            ：{{ communityMessage(message.content).comment.comment }}
          </view>
        </view>
      </view>
    </view>
    <view id="bottom"></view>
    <view
      v-if="collapseModel"
      class="cover-input"
      @tap="onInputCoverTap"
    ></view>
    <view v-if="targetInfo.id != 0" class="bottom-fixed">
      <nut-uploader
        ref="uploadFileRef"
        class="upload"
        :url="UPLOADURL"
        :is-preview="false"
        v-model:file-list="fileList"
        name="formFile"
        :headers="REQUEST_HEADER"
        maximum="2"
        :multiple="false"
        @success="onUploadSuccess"
        @failure="onUploadFailure"
      ></nut-uploader>
      <view class="w-full flex justify-between items-center flex-gap-2">
        <input
          class="bg-#F5F3F2 c-#696a6d p-2 flex-1 rounded-3"
          v-model="message"
          :cursor-spacing="15"
          :disabled="focusLock"
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
              class="w-80 h-80 flex items-end justify-center flex-gap-2"
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
          @tap.stop="onChoosePictureTap"
        />
      </view>
    </view>
    <nut-popup
      :style="{
        left: `${x}px`,
        top: `${y}px`,
      }"
      :overlay-style="{
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }"
      v-model:visible="overlayVisible"
    >
      <view
        class="flex flex-col bg-#f5e0bd flex-gap-2 rounded-1 justify-center p-2"
      >
        <view v-if="withdrawVisible" class="text-#827171" @tap="onWithdrawTap">
          撤回
        </view>
        <view class="text-red" @tap="onDeleteMessageTap">删除</view>
      </view>
    </nut-popup>
    <nut-image-preview
      :show="previewVisible"
      :images="previewImgSrc"
      :show-index="false"
      @close="previewVisible = false"
    />
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
    .messagee-picture {
      border-radius: 8rpx !important;
      height: 260rpx;
      width: 260rpx;
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
    .upload {
      position: fixed;
      bottom: 190rpx;
      left: 16rpx;
      pointer-events: none;
      .nut-uploader__upload {
        visibility: hidden;
      }
      .nut-uploader__preview {
        pointer-events: auto;
      }
      .nut-uploader__preview {
        display: none;
      }
    }
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
