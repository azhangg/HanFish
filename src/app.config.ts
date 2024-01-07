export default {
  entryPagePath: "pages/home/home",
  pages: [
    "pages/home/home",
    "pages/community/community",
    "pages/message/message",
    "pages/user/user",
  ],
  subpackages: [
    {
      root: "package",
      pages: [
        "login/login",
        "goods/add/add",
        "goods/detail/detail",
        "goods/order/confirm",
        "goods/order/pay",
        "goods/appraise/appraise",
        "post/add/add",
        "post/detail/detail",
        "chats/chat/chat",
        "user/receivingAddress/receivingAddress",
        "user/receivingAddress/add",
        "user/receivingAddress/edit",
        "user/deals/deals",
        "user/deals/detail",
      ],
    },
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
        text: "个人中心",
        iconPath: "./assets/icon/user.png",
        selectedIconPath: "./assets/icon/user-selected.png",
      },
    ],
  },
  lazyCodeLoading: "requiredComponents",
};
