import type { customRequestCallBack } from "@/utils/request";
import { httpGet } from "@/utils/request";

export const getBannerReq = (callBack: customRequestCallBack) =>
  httpGet("/Banner/GetAppliedBannerList", {}, callBack);
