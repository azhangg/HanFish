import type { customRequestCallBack } from "@/utils/request";
import { httpGet, httpPost } from "@/utils/request";

export const addPostLikeReq = (
  postId: number,
  callBack: customRequestCallBack
) => httpPost("/PostLike/AddPostLike", { postId }, callBack);

export const deletePostLikeReq = (
  postId: number,
  callBack: customRequestCallBack
) => httpPost("/PostLike/DeletePostLike", { postId }, callBack);

export const getUserLikePostIdsReq = (
  callBack: customRequestCallBack,
  userId?: number
) =>
  userId
    ? httpGet("/PostLike/GetUserLikePostIds", { userId }, callBack)
    : httpGet("/PostLike/GetUserLikePostIds", {}, callBack);

export const getUserLikePostListReq = (callBack: customRequestCallBack) =>
  httpGet("/PostLike/GetUserLikePostList", {}, callBack);

export const getUsersLikeCountReq = (
  userId: number,
  callBack: customRequestCallBack
) => httpGet("/PostLike/GetUsersLikeCount", { userId }, callBack);
