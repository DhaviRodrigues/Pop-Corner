import { IMoviePayload } from '@/types/IMoviePayload';

export class Movie {
  constructor(
    private title: string,
    private director: string,
    private year: number,
    private duration: string,
    private classification: string,
    private tags: string[],
    private image: string,
    private rating: number = 0,
    private ratingCount: number = 0,
    private synopsis: string,
    private createdAt: Date = new Date(),
    private reviewRef: string
  ) {}

  getTitle(): string { return this.title; }
  getDirector(): string { return this.director; }
  getYear(): number { return this.year; }
  getDuration(): string { return this.duration; }
  getClassification(): string { return this.classification; }
  getTags(): string[] { return this.tags; }
  getImage(): string { return this.image; }
  getRating(): number { return this.rating; }
  getRatingCount(): number { return this.ratingCount; }
  getSynopsis(): string { return this.synopsis; }
  getCreatedAt(): Date { return this.createdAt; }
  geReviewRef(): string { return this.reviewRef; }

  static createMovie(payload: IMoviePayload): Movie {
    if (!payload.title || !payload.title.trim()) {
        throw new Error("Título é obrigatório.");
    }
    
    return new Movie(
      payload.title.trim(),
      payload.director ? payload.director.trim() : "Diretor Desconhecido",
      payload.year,
      payload.duration || "",
      payload.classification || "",
      payload.tags || [],
      payload.image ? payload.image.trim() : "",
      payload.rating || 0,
      payload.ratingCount || 0,
      payload.synopsis ? payload.synopsis.trim() : "",
      payload.createdAt || new Date(),
      payload.reviewRef || ""
    );
  }
}