export type FilterTab = "Pendentes" | "Aprovados" | "Arquivados" | "Feitos";

export type CommentStatus = "Pendente" | "Aprovado" | "Recusado";

export interface Comment {
  id: string;
  author: string;
  rating: number;
  movie: string;
  cinema: string;
  date: string;
  text: string;
  status: CommentStatus;
}
