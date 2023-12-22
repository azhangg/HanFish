import Taro from "@tarojs/taro";
import { startSocketTask } from "@/utils/socket";
import { useAccount } from "@/hooks/useAccount";
import { getChatMessagesUserUnreadReq } from "@/apis/chatMessage";
import { useStore } from "@/stores";
import { storeToRefs } from "pinia";

const { getAccessToken, requestUserInfo } = useAccount();

const { addChatMessageRow, updateTabBarBadge } = useStore();

const { chatMessages } = storeToRefs(useStore());

const loginEventHandler = (_) => {
  const openId = getAccessToken();
  setTimeout(() => {
    if (openId) {
      requestUserInfo();
      startSocketTask();
      getChatMessagesUserUnreadReq((res) => {
        const { data } = res.data;
        if (data.length > 0) addChatMessageRow(data);
      });
    }
  }, 1200);
};

const unReadChatsUpdateHandler = () => {
  updateTabBarBadge();
};

const ChatMessageReadHandler = (e) => {
  const { targetId, isReadIds } = e[0];
  const targetIndex = chatMessages.value.findIndex(
    (c) => c.targetInfo.id === Number(targetId)
  );

  if (targetIndex >= 0) {
    isReadIds.forEach((id) => {
      const msgIndex = chatMessages.value[targetIndex].chatMessages.findIndex(
        (cm) => cm.id === Number(id)
      );
      if (msgIndex >= 0)
        chatMessages.value[targetIndex].chatMessages[msgIndex].isRead = true;
    });

    Taro.setStorageSync("chatMessages", chatMessages.value);
  }
};

const SendMessageHandler = (e) => {
  const { targetInfo, chatMessages } = e[0];
  if (Taro.useRouter().path == "/package/chats/chat/chat") {
    //不包含在eventCenter里,是单独滴
    Taro.eventCenter.trigger("readSendChatMessage");
  }
  addChatMessageRow([{ targetInfo, chatMessages }]);
};

const events: { [key: string]: any } = {
  login: loginEventHandler,
  unReadChatsUpdate: unReadChatsUpdateHandler,
  ChatMessageRead: ChatMessageReadHandler,
  SendMessage: SendMessageHandler,
};
//应用事件
Taro.eventCenter.on("login", loginEventHandler);
Taro.eventCenter.on("unReadChatsUpdate", unReadChatsUpdateHandler);
//服务器事件
Taro.eventCenter.on("ChatMessageRead", ChatMessageReadHandler);
Taro.eventCenter.on("SendMessage", SendMessageHandler);

export const useEventCenter = () => {
  return {
    events,
  };
};
