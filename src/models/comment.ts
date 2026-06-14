import { IComment, CommentStatus } from '@/types/IComment';

export class Comment implements IComment {
  constructor(
    public id: string,
    public author: string,
    public rating: number,
    public movie: string,
    public cinema: string,
    public date: string,
    public text: string,
    public status: CommentStatus = 'Pendente'
  ) {}

  getId(): string { return this.id; }
  getAuthor(): string { return this.author; }
  getRating(): number { return this.rating; }
  getMovie(): string { return this.movie; }
  getCinema(): string { return this.cinema; }
  getDate(): string { return this.date; }
  getText(): string { return this.text; }
  getStatus(): CommentStatus { return this.status; }

  updateStatus(newStatus: CommentStatus): void {
    this.status = newStatus;
  }

  static createComment(payload: IComment): Comment {
    if (!payload.author.trim() || !payload.text.trim()) {
      throw new Error("Instanciação de Comentário recusada: Autor e Texto são obrigatórios.");
    }
    if (payload.rating < 0 || payload.rating > 5) {
      throw new Error("Avaliação inválida. Deve ser um valor entre 0 e 5.");
    }

    return new Comment(
      payload.id,
      payload.author.trim(),
      payload.rating,
      payload.movie,
      payload.cinema,
      payload.date,
      payload.text.trim(),
      payload.status || 'Pendente'
    );
  }
}