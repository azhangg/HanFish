import type { ChatMessageRowType } from "@/models/message/chatMessage";

import { defineStore } from "pinia";
import Taro from "@tarojs/taro";
import moment from "moment";

export const useStore = defineStore("store", {
  state: () => {
    return {
      accessToken: "",
      userInfo: {
        id: 0,
        name: "",
        avatarUrl: "",
      },
      getUserInfo: false,
      chatMessages: new Array<ChatMessageRowType>(),
    };
  },
  getters: {
    readyChatMessages: (state) => {
      const messages = Taro.getStorageSync("chatMessages");
      if (messages) {
        let unReadNum = 0;
        if (messages.length > 0) {
          state.chatMessages = messages.sort((curr, next) => {
            if (curr.chatMessages.length == 0 || next.chatMessages.length == 0)
              return 0;
            else
              return (
                moment(
                  next.chatMessages[next.chatMessages.length - 1]?.createTime
                ).valueOf() -
                moment(
                  curr.chatMessages[curr.chatMessages.length - 1]?.createTime
                ).valueOf()
              );
          });
        }

        state.chatMessages.forEach((item) => {
          if (item.chatMessages.length > 0) {
            item.chatMessages.sort(
              (curr, next) =>
                moment(curr.createTime).valueOf() -
                moment(next.createTime).valueOf()
            );
          }
          item.chatMessages.forEach((msg) => {
            if (!msg.isRead && msg.receiverId === state.userInfo.id)
              unReadNum += 1;
          });
        });
        if (unReadNum > 0) {
          const isTabbarPage = Taro.useRouter().path.startsWith("/pages");
          if (isTabbarPage)
            Taro.setTabBarBadge({
              index: 2,
              text: `${unReadNum}`,
            });
        } else {
          const isTabbarPage = Taro.useRouter().path.startsWith("/pages");
          if (isTabbarPage)
            Taro.removeTabBarBadge({
              index: 2,
            });
        }
      }
      let result: ChatMessageRowType[] = state.chatMessages.map((cms) => {
        return {
          targetInfo: cms.targetInfo,
          chatMessages: cms.chatMessages.filter(
            (cm) => !cm.refusherIds.some((id) => id === state.userInfo.id)
          ),
        };
      });
      return result;
    },
  },
  actions: {
    setLogin() {
      this.$patch((state) => {
        state.getUserInfo = true;
      });
    },
    setUserInfo(data: any) {
      this.$patch((state) => {
        state.userInfo = data;
      });
    },
    setAccessToken(token: string) {
      this.$patch((state) => {
        state.accessToken = token;
      });
    },
    clearUserInfo() {
      this.$patch((state) => {
        state.userInfo = {
          id: 0,
          name: "",
          avatarUrl: "",
        };
      });
    },
    loginOut() {
      this.$patch((state) => {
        state.getUserInfo = false;
        state.accessToken = "";
      });
      this.clearUserInfo();
    },
    addChatMessageRow(msgs: ChatMessageRowType[]) {
      this.$patch((state) => {
        msgs.forEach((item) => {
          const rowindex = state.chatMessages.findIndex(
            (c) => c.targetInfo.id == item.targetInfo.id
          );
          if (rowindex >= 0) {
            item.chatMessages.forEach((msg) => {
              const index = state.chatMessages[rowindex].chatMessages.findIndex(
                (c) => c.id == msg.id
              );
              if (index < 0) {
                state.chatMessages[rowindex].chatMessages.push(msg);
                if (state.chatMessages[rowindex].chatMessages.length > 1)
                  state.chatMessages[rowindex].chatMessages.sort(
                    (curr, next) =>
                      moment(curr.createTime).valueOf() -
                      moment(next.createTime).valueOf()
                  );
              } else {
                state.chatMessages[rowindex].chatMessages[index] = msg;
              }
            });
          } else {
            state.chatMessages.push(item);
          }
        });

        state.chatMessages.sort((curr, next) => {
          if (curr.chatMessages.length == 0 || next.chatMessages.length == 0)
            return 0;
          else
            return (
              moment(next.chatMessages[0].createTime).valueOf() -
              moment(curr.chatMessages[0].createTime).valueOf()
            );
        });

        Taro.setStorageSync("chatMessages", state.chatMessages);
      });
    },
    removeChatMessageRow(targetId: number) {
      this.$patch((state) => {
        const index = state.chatMessages.findIndex(
          (cm) => cm.targetInfo.id === targetId
        );
        if (index >= 0) {
          state.chatMessages.splice(index, 1);
          Taro.setStorageSync("chatMessages", state.chatMessages);
        }
      });
    },
    readChatMessage(targetId: number) {
      this.$patch((state) => {
        const targetIndex = state.chatMessages.findIndex(
          (c) => c.targetInfo.id === Number(targetId)
        );

        if (targetIndex >= 0) {
          const unReadMsgIds = state.chatMessages[targetIndex].chatMessages
            .filter((cm) => !cm.isRead)
            .map((item) => item.id);
          unReadMsgIds.forEach((id) => {
            const msgIndex = state.chatMessages[
              targetIndex
            ].chatMessages.findIndex((m) => m.id === id);
            if (msgIndex >= 0)
              state.chatMessages[targetIndex].chatMessages[msgIndex].isRead =
                true;
          });

          Taro.setStorageSync("chatMessages", state.chatMessages);
        }
      });
    },
    updateTabBarBadge() {
      this.$patch((state) => {
        const messages = state.chatMessages;
        let unReadNum = 0;

        messages.forEach((item) => {
          item.chatMessages.forEach((msg) => {
            if (!msg.isRead && msg.receiverId === state.userInfo.id)
              unReadNum += 1;
          });
        });
        if (unReadNum > 0) {
          const isTabbarPage = Taro.useRouter().path.startsWith("/pages");
          if (isTabbarPage)
            Taro.setTabBarBadge({
              index: 2,
              text: `${unReadNum}`,
            });
        } else {
          const isTabbarPage = Taro.useRouter().path.startsWith("/pages");
          if (isTabbarPage)
            Taro.removeTabBarBadge({
              index: 2,
            });
        }
      });
    },
  },
});
