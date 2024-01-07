import type { customRequestCallBack } from "@/utils/request";

import { httpPost, httpGet } from "@/utils/request";

export const getAddressReq = (callBack: customRequestCallBack) =>
  httpGet("/Address/GetAddressByUserId", {}, callBack);

export const addAddressReq = (
  data: { name: string; contactNum: string; deliveryAddress: string },
  callBack: customRequestCallBack
) => httpPost("/Address/AddAddress", data, callBack);

export const updateAddressReq = (
  data: {
    id: number;
    name: string;
    contactNum: string;
    deliveryAddress: string;
  },
  callBack: customRequestCallBack
) => httpPost("/Address/UpdateAddress", data, callBack);

export const deleteAddressReq = (id: number, callBack: customRequestCallBack) =>
  httpPost("/Address/DeleteAddress", { id }, callBack);

export const setDefaultAddressReq = (
  id: number,
  callBack: customRequestCallBack
) => httpPost("/Address/SetDefaultAddress", { id }, callBack);
