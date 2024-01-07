import type { customRequestCallBack } from "@/utils/request";

import { httpGet, httpPost } from "@/utils/request";

export const getGoodAppraisesReq = (callBack: customRequestCallBack) =>
  httpGet("/GoodAppraise/GetGoodAppraises", {}, callBack);

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
