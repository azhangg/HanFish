export interface TargetInfoType {
  id: number;
  name: string;
  loginName: string;
  avatarUrl?: string;
  roleId: number;
}

export interface ChatMessageRowType {
  targetInfo: TargetInfoType;
  chatMessages: ChatMessageType[];
}

export interface ChatMessageType {
  id: number;
  content: string;
  createTime: Date;
  receiverId: number;
  senderId: number;
  type: number;
  typeName: string;
  isRead: boolean;
  good?: any;
  refusherIds: number[];
}
