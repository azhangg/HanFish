import type { customRequestCallBack } from "@/utils/request";

import { httpGet, httpPost } from "@/utils/request";

export const getUserInfoByUserIdReq = (
  id: number,
  callback: customRequestCallBack
) => httpGet("/User/GetUserInfoByUserId", { id }, callback);

export const updateUserInfoReq = (
  data: {
    id: number;
    name?: string;
    avatarUrl?: string;
  },
  callback: customRequestCallBack
) => httpPost("/User/UpdateClientUser", data, callback);
