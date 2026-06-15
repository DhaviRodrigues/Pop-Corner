import { WatchlistEntry } from '@/models/userWatchlist';
import { Coupon } from '@/models/coupon'
export interface IUser {
  name: string;
  email: string;
  profile_picture: string;
  favorite_genres: string[];
  pipoka: number;
  watchlist: WatchlistEntry[];
  coupons: Coupon[];
}