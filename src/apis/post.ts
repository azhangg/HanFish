import type { customRequestCallBack } from "@/utils/request";
import { httpGet, httpPost } from "@/utils/request";

export const addPostReq = (
  data: { text: string; imgUrls: string[] },
  callBack: customRequestCallBack
) => httpPost("/Post/AddPost", data, callBack);

export const getPostReq = (
  data: { page: number; count: number; search: string },
  callBack: customRequestCallBack
) => httpGet("/Post/GetPostListToPagination", { ...data, status: 1 }, callBack);

export const deletePostReq = (id: number, callBack: customRequestCallBack) =>
  httpPost("/Post/DeletePost", { id }, callBack);

export const getPostByIdReq = (
  postId: number,
  callBack: customRequestCallBack
) => httpGet("/Post/GetPostById", { postId }, callBack);

export const getPostsByUserIdReq = (
  userId: number,
  callBack: customRequestCallBack
) => httpGet("/Post/GetPostListByUserId", { userId }, callBack);

export const getUserCollectedPostsReq = (
  userId: number,
  callBack: customRequestCallBack
) => httpGet("/Post/GetCollectedPostsByUserId", { userId }, callBack);

export const getUserLikedPostsReq = (
  userId: number,
  callBack: customRequestCallBack
) => httpGet("/Post/GetLikedPostsByUserId", { userId }, callBack);

export const getUserCommentedPostsReq = (
  userId: number,
  callBack: customRequestCallBack
) => httpGet("/Post/GetCommentedPostsByUserId", { userId }, callBack);
