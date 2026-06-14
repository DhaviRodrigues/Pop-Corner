import { Comment } from '@/models/comment';
import { IMoviePayload } from '@/types/IMoviePayload';

export class Movie {
  private comments: Comment[];

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
    comments: Comment[] = []
  ) {
    this.comments = comments;
  }

  // Getters básicos
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
  
  // Retorna apenas comentários aprovados para exibição pública na UI
  getApprovedComments(): Comment[] {
    return this.comments.filter(comment => comment.getStatus() === 'Aprovado');
  }

  // Retorna a lista completa de comentários (Moderação de conteúdo)
  getAllComments(): Comment[] {
    return this.comments;
  }

  /**
   * Regra de Negócio Centralizada:
   * Adiciona um comentário ao filme e atualiza a média matemática de avaliações (rating)
   * de forma estritamente reativa, sem risco de corrupção ou data leakage.
   */
  addComment(newComment: Comment): void {
    this.comments.push(newComment);
    
    // Atualiza os metadados numéricos caso o comentário tenha nota válida
    const totalRatingSum = (this.rating * this.ratingCount) + newComment.getRating();
    this.ratingCount += 1;
    this.rating = parseFloat((totalRatingSum / this.ratingCount).toFixed(1));
  }

  /**
   * Fábrica Estática para validação estrutural do Filme antes de instanciar
   */
  static createMovie(payload: IMoviePayload): Movie {
    if (!payload.title.trim() || !payload.synopsis.trim()) {
      throw new Error("Classe Movie recusou a criação: Título e Sinopse são obrigatórios.");
    }
    if (payload.year < 1888 || payload.year > new Date().getFullYear() + 5) {
      throw new Error("Ano de lançamento inválido.");
    }

    return new Movie(
      payload.title.trim(),
      payload.director.trim() || "Diretor Desconhecido",
      payload.year,
      payload.duration,
      payload.classification,
      payload.tags || [],
      payload.image.trim() || "https://placehold.co/600x400?text=Sem+Cartaz",
      payload.rating || 0,
      payload.ratingCount || 0,
      payload.synopsis.trim(),
      payload.createdAt || new Date(),
      payload.comments || []
    );
  }
}