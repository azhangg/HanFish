export interface PostCommentType {
  id: number;
  postId: number;
  comment: string;
  imgUrl?: string;
  userId: number;
  userName: string;
  avatarUrl?: string;
  pId: number;
  createTime: Date;
  children: PostCommentType[];
}
