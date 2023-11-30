import { defineStore } from "pinia";
import Taro from "@tarojs/taro";

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
    };
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
  },
});
