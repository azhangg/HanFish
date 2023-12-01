import type { customRequestCallBack } from "@/utils/request";
import { httpGet, httpPost } from "@/utils/request";

export const getGoodsReq = (
  data: { page: number; count: number; search: string; categoryId: number },
  callBack: customRequestCallBack
) => httpGet("/Good/GetGoodToPagination", data, callBack);

export const getGoodByIdReq = (id: number, callBack: customRequestCallBack) =>
  httpGet("/Good/GetGoodById", { id }, callBack);

export const addGoodReq = (
  data: {
    description: string;
    imgUrls: string[];
    price: number;
    tags: string[];
    categoryId: number;
    userId: 0;
  },
  callBack: customRequestCallBack
) => httpPost("/Good/AddGood", data, callBack);

export const modifyGoodPriceReq = (
  data: {
    id: number;
    price: number;
  },
  callBack: customRequestCallBack
) => httpPost("/Good/UpdateGood", data, callBack);

export const modifyGoodStatusReq = (
  data: {
    id: number;
    status: number;
  },
  callBack: customRequestCallBack
) => httpPost("/Good/UpdateGood", data, callBack);

export const deleteGoodPriceReq = (id: number, callBack: (res) => void) =>
  httpPost("/Good/DeleteGood", { id }, callBack);
