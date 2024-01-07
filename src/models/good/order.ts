import type { GoodType } from "./good";
import type { AddressType } from "../user/address";

export interface OrderType {
  id: number;
  code: string;
  addressId: number;
  goodId: number;
  userId: number;
  status: number;
  createTime: Date;
  good: GoodType;
  user: {
    id: number;
    name: string;
    email?: string;
    loginName: string;
    createTime: string;
    avatarUrl?: string;
    roleId: number;
  };
  address: AddressType;
}
