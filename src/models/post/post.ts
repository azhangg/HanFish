export interface PostType {
  id: number;
  text: string;
  status: string;
  imgUrls: string[];
  createTime: Date;
  publisherId: number;
  comments: number;
  likes: number;
  collects: number;
  isLike: boolean;
  isCollect: boolean;
  publisher: {
    id: number;
    name: string;
    email: string | null;
    loginName: string;
    createTime: Date;
    avatarUrl?: string;
    roleId: number;
  };
}
