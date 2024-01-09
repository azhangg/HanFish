export default interface GoodCardProps {
  id: number;
  imgUrl: string;
  tags: string[];
  description: string;
  price: number;
  status: string;
  user: {
    id: number | string;
    avatarUrl?: string;
    name: string;
  };
}
