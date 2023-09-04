export default interface SocialCard {
  id: number | string;
  text: string;
  imageUrl: string | null;
  comments: number;
  likes: number;
  user: {
    id: number | string;
    name: string;
    avatarUrl?: string;
    isCollect: boolean;
  };
}
