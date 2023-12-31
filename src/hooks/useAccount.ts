import { loginReq, getUserInfoReq } from "@/apis/account";
import Taro from "@tarojs/taro";
import { useStore } from "@/stores";

const getOpenId = () => Taro.getStorageSync("openid");

/**
 * @brief 获取访问令牌
 * @param nextFn 需要等待接口完成后执行的函数
 * @return 用户微信openid
 */
const getAccessToken = (nextFn?: () => void) => {
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
        setTimeout(() => {
          nextFn ? nextFn() : null;
        }, 200);
      }
    });
  }
  return openid;
};

const requestUserInfo = (nextFn?: () => void) => {
  getUserInfoReq((res) => {
    const { id, name, avatarUrl } = res.data.data;
    useStore().setUserInfo({ id, name, avatarUrl });
    setTimeout(() => {
      nextFn ? nextFn() : null;
    }, 200);
  });
};

export const useAccount = () => {
  const { accessToken, getUserInfo } = useStore();
  const isLogin = accessToken && getUserInfo;

  return { getAccessToken, requestUserInfo, getOpenId, isLogin };
};
