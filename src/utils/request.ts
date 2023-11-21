import Taro from "@tarojs/taro";
import { BASE_URL } from "./config";
import { useStore } from "@/stores";

const { accessToken } = useStore();

export const BasicRequest = (
  method: "POST" | "GET" | "DELETE",
  url: string,
  data: any,
  success: (res) => void
) =>
  Taro.request({
    url: `${BASE_URL}/api${url}`,
    method: method,
    data: data,
    timeout: 10000,
    header: { Authorization: `Bearer ${accessToken}` },
    success: success,
    fail: (err) => {
      Taro.showToast({
        title: err.errMsg,
        icon: "none",
      });
    },
  });

export const httpGet = (url: string, data: any, callBack: (res) => void) =>
  BasicRequest("GET", url, data, callBack);

export const httpPost = (url: string, data: any, callBack: (res) => void) =>
  BasicRequest("POST", url, data, callBack);

export const httpDelete = (url: string, data: any, callBack: (res) => void) =>
  BasicRequest("DELETE", url, data, callBack);
