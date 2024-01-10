import Taro from "@tarojs/taro";

const updateManager = Taro.getUpdateManager();

updateManager.onCheckForUpdate(function (res) {
  console.log(res.hasUpdate);
});

updateManager.onUpdateReady(function () {
  Taro.showModal({
    title: "更新提示",
    content: "新版本已经准备好，是否重启应用？",
    success: function (res) {
      if (res.confirm) {
        updateManager.applyUpdate();
      }
    },
  });
});

updateManager.onUpdateFailed(function () {
  Taro.showToast({
    title: "更新失败",
    icon: "none",
  });
});
