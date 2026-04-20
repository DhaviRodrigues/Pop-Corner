export class User {
  constructor(
    public id: number,
    private name: string,
    private email: string,
    private profile_picture: string,
    private favorite_genres: string[],
    private pipoka: number
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

  static createUser(payload: {
    id: number;
    name: string;
    email: string;
    password: string;
    profile_picture: string;
    favorite_genres: string[];
    pipoka: number;
  }): User {
    return new User(
      payload.id,
      payload.name,
      payload.email,
      payload.profile_picture,
      payload.favorite_genres,
      payload.pipoka
    );
  }
}
