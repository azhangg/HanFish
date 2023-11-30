import Taro from "@tarojs/taro";
import { BASE_URL } from "./config";
import { useStore } from "@/stores";
import { storeToRefs } from "pinia";

const { accessToken } = storeToRefs(useStore());

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
    header: { Authorization: `Bearer ${accessToken.value}` },
    success: success,
    fail: (err) => {
      Taro.showToast({
        title: err.errMsg,
        icon: "none",
        duration: 3000,
      });
    },
  });

export const uploadFiles = (
  url: string,
  filePath: string,
  fileName: string,
  formData: any,
  success: (res) => void
) =>
  Taro.uploadFile({
    url: `${BASE_URL}/api${url}`,
    filePath: filePath,
    name: fileName,
    formData: formData,
    timeout: 10000,
    header: {
      Authorization: `Bearer ${accessToken.value}`,
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
    success: success,
    fail: (err) => {
      Taro.showToast({
        title: err.errMsg,
        icon: "none",
        duration: 3000,
      });
    },
  });

export const httpGet = (url: string, data: any, callBack: (res) => void) =>
  BasicRequest("GET", url, data, callBack);

export const httpPost = (url: string, data: any, callBack: (res) => void) =>
  BasicRequest("POST", url, data, callBack);

export const httpDelete = (url: string, data: any, callBack: (res) => void) =>
  BasicRequest("DELETE", url, data, callBack);
