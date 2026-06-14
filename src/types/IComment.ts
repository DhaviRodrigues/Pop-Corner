export type CommentStatus = 'Pendente' | 'Aprovado' | 'Recusado' | 'Arquivado';

export interface IComment {
  id: string;
  author: string;
  rating: number;
  movie: string;
  cinema: string;
  date: string;
  text: string;
  status: CommentStatus;
}