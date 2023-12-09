import type { customRequestCallBack } from "@/utils/request";
import { httpGet, httpPost } from "@/utils/request";

export const getPostCommentsByPostIdReq = (
  id: number,
  callBack: customRequestCallBack
) => httpGet("/PostComment/GetPostCommentListById", { id }, callBack);

export const addPostCommentReq = (
  data: { postId: number; comment: string; imgUrl?: string; pId: number },
  callBack: customRequestCallBack
) => httpPost("/PostComment/AddPostComment", data, callBack);

export const deletePostCommentReq = (
  id: number,
  callBack: customRequestCallBack
) => httpPost("/PostComment/DeletePostComment", { id }, callBack);
