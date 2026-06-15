import { IMoviePayload } from "@/types/IMoviePayload"; 
import { IUser } from "@/types/IUser";        

export class Recomendador {
  private catalogo: IMoviePayload[];

  constructor(filmes: IMoviePayload[]) {
    this.catalogo = filmes;
  }

  public gerarParaUsuario(usuario: IUser): IMoviePayload[] {
    const filmesRecomendados = this.catalogo.filter(filme => {
      if (!filme.tags || !usuario.favorite_genres) return false;

      return filme.tags.some((tag: string) => usuario.favorite_genres.includes(tag));
    });

    if (filmesRecomendados.length === 0) {
      return this.catalogo.slice(0, 10);
    }

    return filmesRecomendados;
  }
}