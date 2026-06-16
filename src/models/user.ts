import { IUser } from '@/types/IUser';

export class User implements IUser {
  constructor(
    public name: string,
    public email: string,
    public profile_picture: string,
    public favorite_genres: string[],
    public pipoka: number,
    public watchlist: string, 
    public coupons: string,
    public uid: string,
  ) {}
  
  getId(): string { return this.uid; }
  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
  getGenres(): string[] { return this.favorite_genres; }
  getProfilePicture(): string { return this.profile_picture; }
  getPipoka(): number { return this.pipoka; }
  getWatchlistPath(): string { return this.watchlist; }
  getCouponsPath(): string { return this.coupons; }

  setName(newName: string): void {
    this.name = newName;
  }
}
