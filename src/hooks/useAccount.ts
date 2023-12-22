import { loginReq, getUserInfoReq } from "@/apis/account";
import Taro from "@tarojs/taro";
import { useStore } from "@/stores";

const getOpenId = () => Taro.getStorageSync("openid");

const getAccessToken = () => {
  var openid = getOpenId();
  if (openid) {
    loginReq({ userName: openid, password: openid }, (res) => {
      const { isSuccess, data } = res.data;
      if (isSuccess) {
        Taro.setStorage({
          key: "token",
          data: data.accessToken,
        });
        useStore().setAccessToken(data.accessToken);
        useStore().setLogin();
      }
    });
  }
  return openid;
};

const requestUserInfo = () => {
  getUserInfoReq((res) => {
    const { id, name, avatarUrl } = res.data.data;
    useStore().setUserInfo({ id, name, avatarUrl });
  });
};

export const useAccount = () => {
  const { accessToken, getUserInfo } = useStore();
  const isLogin = accessToken && getUserInfo;

  return { getAccessToken, requestUserInfo, getOpenId, isLogin };
};
