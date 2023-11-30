export interface GoodType {
  id: number;
  imgUrls: string[];
  tags: string[];
  description: string;
  price: number;
  createTime: Date;
  user: {
    id: number | string;
    avatarUrl?: string;
    name: string;
  };
}
