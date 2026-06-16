import { DocumentReference } from 'firebase/firestore';
export interface IUser {
  name: string;
  email: string;
  profile_picture: string;
  favorite_genres: string[];
  pipoka: number;
  watchlist: DocumentReference | string; 
  coupons: DocumentReference | string;
  uid: string;
}