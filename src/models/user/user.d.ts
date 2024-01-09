export default interface User {
  id: number | string;
  avatarUrl?: string;
  name: string;
}

export interface UserType {
  id: number;
  loginName: string;
  name: string;
  roleId: number;
  avatarUrl?: string;
  email?: string;
  createTime: Date;
}
