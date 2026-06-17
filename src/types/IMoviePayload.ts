import { Comment } from '@/models/comment';

export interface IMoviePayload {
  title: string;
  director: string;
  year: number;
  duration: string; // Ex: "120 min" ou "2h"
  classification: string;
  tags: string[]; // Gêneros do filme compatíveis com as preferências do User
  image: string;
  rating?: number;
  ratingCount?: number;
  synopsis: string;
  createdAt?: Date;
  reviewRef?: string;
}