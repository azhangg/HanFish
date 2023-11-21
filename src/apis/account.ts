import { httpGet } from "@/utils/request";

export const getOpenidReq = (
  data: { jsCode: string; userName?: string; avatarUrl?: string },
  callBack: (res) => void
) => httpGet("/Account/Jscode2session", data, callBack);

export const loginReq = (
  data: { userName: string; password: string },
  callBack: (res) => void
) => httpGet("/Account/ClientLogin", data, callBack);

export const getUserInfoReq = (callBack: (res) => void) =>
  httpGet("/Account/ClientLogin", {}, callBack);
