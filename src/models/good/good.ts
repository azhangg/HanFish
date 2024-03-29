export interface GoodType {
  id: number;
  imgUrls: string[];
  tags: string[];
  description: string;
  price: number;
  createTime: Date;
  userId: number;
  status: string;
  user: {
    id: number;
    avatarUrl?: string;
    name: string;
  };
}
