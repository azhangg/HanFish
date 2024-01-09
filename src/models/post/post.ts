import type { UserType } from "@/models/user/user";
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

export interface CommentPostType {
  id: number;
  postId: number;
  comment: string;
  imgUrl?: string;
  userId: number;
  userName: string;
  avatarUrl?: string;
  pId: number;
  createTime: Date;
  puser?: UserType;
  post: PostType;
}
