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
