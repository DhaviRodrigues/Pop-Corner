import { WatchlistEntry } from '@/models/userWatchlist';

export interface IUser {
  id: string | number;
  name: string;
  email: string;
  profile_picture: string;
  favorite_genres: string[];
  pipoka: number;
  watchlist: WatchlistEntry[];
}