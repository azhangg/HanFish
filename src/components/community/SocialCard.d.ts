export default interface SocialCard {
  id: number | string;
  text: string;
  imageUrls: string[];
  comments: number;
  likes: number;
  collects: number;
  isLike: boolean;
  isCollect: boolean;
  createTime: string | Date;
  user: {
    id: number | string;
    name: string;
    avatarUrl?: string;
  };
}
