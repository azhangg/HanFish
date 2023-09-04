export default interface GoodCardProps {
  id: number;
  imgUrl: string;
  tags: string[];
  description: string;
  price: number;
  user: {
    id: number | string;
    avatarUrl?: string;
    name: string;
  };
}
