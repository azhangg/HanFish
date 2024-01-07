import type { customRequestCallBack } from "@/utils/request";

import { httpGet, httpPost } from "@/utils/request";

export const getOrderByIdReq = (id: number, callBack: customRequestCallBack) =>
  httpGet("/Order/GetOrderById", { id }, callBack);

export const getOrdersByUserIdReq = (callBack: customRequestCallBack) =>
  httpGet("/Order/GetOrdersByUserId", {}, callBack);

export const addOrderReq = (
  data: {
    goodId: number;
    userId: number;
    addressId: number;
  },
  callBack: customRequestCallBack
) => httpPost("/Order/AddOrder", data, callBack);

export const updateOrderReq = (
  data: {
    id: number;
    addressId: number;
  },
  callBack: customRequestCallBack
) => httpPost("/Order/UpdateOrder", data, callBack);

export const deleteOrderReq = (id: number, callBack: customRequestCallBack) =>
  httpPost("/Order/DeleteOrder", { id }, callBack);

export const orderDeliveryReq = (id: number, callBack: customRequestCallBack) =>
  httpPost("/Order/OrderDelivery", { id }, callBack);

export const receiveOrderReq = (id: number, callBack: customRequestCallBack) =>
  httpPost("/Order/ReceiveOrder", { id }, callBack);

export const payOrderReq = (id: number, callBack: customRequestCallBack) =>
  httpPost("/Order/PayOrder", { id }, callBack);

export const cancelOrderReq = (id: number, callBack: customRequestCallBack) =>
  httpPost("/Order/CancelOrder", { id }, callBack);
