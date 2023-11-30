import { httpGet } from "@/utils/request";

export const getGoodCategoriesReq = (callBack: (res) => void) =>
  httpGet("/GoodCategory/GetGoodCategories", {}, callBack);
