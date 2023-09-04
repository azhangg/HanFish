export default {
  entryPagePath: "pages/message/message",
  pages: [
    "pages/home/home",
    "pages/community/community",
    "pages/message/message",
    "pages/user/user",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#999",
    selectedColor: "#ff6b81",
    backgroundColor: "#fff",
    position: "bottom",
    list: [
      {
        pagePath: "pages/home/home",
        text: "首页",
        iconPath: "./assets/icon/home.png",
        selectedIconPath: "./assets/icon/home-selected.png",
      },
      {
        pagePath: "pages/community/community",
        text: "社区",
        iconPath: "./assets/icon/community.png",
        selectedIconPath: "./assets/icon/community-selected.png",
      },
      {
        pagePath: "pages/message/message",
        text: "消息",
        iconPath: "./assets/icon/message.png",
        selectedIconPath: "./assets/icon/message-selected.png",
      },
      {
        pagePath: "pages/user/user",
        text: "我的",
        iconPath: "./assets/icon/user.png",
        selectedIconPath: "./assets/icon/user-selected.png",
      },
    ],
  },
  lazyCodeLoading: "requiredComponents",
};
