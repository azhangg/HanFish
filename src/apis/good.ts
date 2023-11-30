import { httpGet, httpPost } from "@/utils/request";

export const getGoodsReq = (
  data: { page: number; count: number; search: string; categoryId: number },
  callBack: (res) => void
) => httpGet("/Good/GetGoodToPagination", data, callBack);

export const addGoodReq = (
  data: {
    description: string;
    imgUrls: string[];
    price: number;
    tags: string[];
    categoryId: number;
    userId: 0;
  },
  callBack: (res) => void
) => httpPost("/Good/AddGood", data, callBack);

export const modifyGoodPriceReq = (
  data: {
    id: number;
    price: number;
  },
  callBack: (res) => void
) => httpPost("/Good/UpdateGood", data, callBack);

export const modifyGoodStatusReq = (
  data: {
    id: number;
    status: number;
  },
  callBack: (res) => void
) => httpPost("/Good/UpdateGood", data, callBack);

export const deleteGoodPriceReq = (id: number, callBack: (res) => void) =>
  httpPost("/Good/DeleteGood", { id }, callBack);
