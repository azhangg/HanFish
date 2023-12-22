import type { customRequestCallBack } from "@/utils/request";
import { httpGet, httpPost } from "@/utils/request";

export const getChatMessagesReq = (
  targetId: number,
  time: string,
  callBack: customRequestCallBack
) =>
  httpGet(
    "/ChatMessage/GetChatMessages",
    {
      targetId,
      time,
    },
    callBack
  );

export const getChatMessagesUserUnreadReq = (callBack: customRequestCallBack) =>
  httpGet("/ChatMessage/GetChatMessagesUserUnRead", {}, callBack);

export const addChatMessageReq = (
  data: { senderId: number; receiverId: number; content: string; type: number },
  callBack: customRequestCallBack
) => httpPost("/ChatMessage/AddChatMessages", data, callBack);

export const refuseMessageReq = (id: number, callBack: customRequestCallBack) =>
  httpPost("/ChatMessage/RefuseMessage", { id }, callBack);

export const withDrawMessageReq = (
  id: number,
  callBack: customRequestCallBack
) => httpPost("/ChatMessage/WithDrawMessage", { id }, callBack);

export const readMessageReq = (
  messageIds: number[],
  callBack: customRequestCallBack
) => httpPost("/ChatMessage/ReadMessage", { messageIds }, callBack);
