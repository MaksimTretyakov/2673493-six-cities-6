export type User = {
  id: number;
  name: string;
  isPro: boolean;
  avatarUrl: string;
};

export type Review = {
  id: string;
  date: string;
  user: User;
  comment: string;
  rating: number;
};
