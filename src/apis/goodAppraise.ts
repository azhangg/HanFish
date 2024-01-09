import type { customRequestCallBack } from "@/utils/request";

import { httpGet, httpPost } from "@/utils/request";

export const getGoodAppraisesReq = (
  userId: number,
  callBack: customRequestCallBack
) => httpGet("/GoodAppraise/GetGoodAppraises", { userId }, callBack);

export const addGoodAppraiseReq = (
  data: {
    rate: number;
    goodId: number;
    userId: number;
    sellerId: number;
    comment?: string;
    commentImgUrl?: string;
  },
  callBack: customRequestCallBack
) => httpPost("/GoodAppraise/AddGoodAppraise", data, callBack);
