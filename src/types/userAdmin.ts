export class UserAdmin {
  constructor(
    public id: number,
    private name: string,
    private email: string,
    private profile_picture: string,
    private favorite_genres: string[],
    private pipoka: number,
    private isAdmin: boolean
  ) {}

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getGenres(): string[] {
    return this.favorite_genres;
  }

  getProfilePicture(): string {
    return this.profile_picture;
  }

  getPipoka(): number {
    return this.pipoka;
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }

  static createUserAdmin(payload: {
    id: number;
    name: string;
    email: string;
    profile_picture: string;
    favorite_genres: string[];
    pipoka: number;
    isAdmin: boolean;
  }): UserAdmin {
    return new UserAdmin(
      payload.id,
      payload.name,
      payload.email,
      payload.profile_picture,
      payload.favorite_genres,
      payload.pipoka,
      payload.isAdmin
    );
  }
}
