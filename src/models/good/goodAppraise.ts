import UserType from "@/models/user/user";
import type { GoodType } from "@/models/good/good";

export interface GoodAppraiseType {
  id: number;
  rate: number;
  goodId: number;
  userId: number;
  sellerId: number;
  comment?: string;
  commentImgUrl?: string;
  createTime: Date;
  user: UserType;
  good: GoodType;
}
