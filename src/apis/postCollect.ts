import type { customRequestCallBack } from "@/utils/request";
import { httpGet, httpPost } from "@/utils/request";

export const addPostCollectReq = (
  postId: number,
  callBack: customRequestCallBack
) => httpPost("/PostCollect/AddPostCollect", { postId }, callBack);

export const deletePostCollectReq = (
  postId: number,
  callBack: customRequestCallBack
) => httpPost("/PostCollect/DeletePostCollect", { postId }, callBack);

export const getUserCollectPostIdsReq = (
  callBack: customRequestCallBack,
  userId?: number
) =>
  userId
    ? httpGet("/PostCollect/GetUserCollectPostIds", { userId }, callBack)
    : httpGet("/PostCollect/GetUserCollectPostIds", {}, callBack);

export const getUserCollectPostListReq = (callBack: customRequestCallBack) =>
  httpGet("/PostCollect/GetUserCollectPostList", {}, callBack);
