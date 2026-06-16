import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase"; 
import { IMoviePayload } from "@/types/IMoviePayload";

type FilmeComId = IMoviePayload & { id: string };

const shuffleMovies = (movies: FilmeComId[]): FilmeComId[] => 
  [...movies].sort(() => Math.random() - 0.5);

function gerarRecomendacoes(catalogo: FilmeComId[], favoriteGenres: string[]): FilmeComId[] {
  const filmesRecomendados = catalogo.filter(filme => {
    if (!filme.tags || !favoriteGenres) return false;
    return filme.tags.some((tag: string) => favoriteGenres.includes(tag));
  });

  if (filmesRecomendados.length === 0) {
    return catalogo.slice(0, 10);
  }

  const recomendadosEmbaralhados = [...filmesRecomendados].sort(() => Math.random() - 0.5);
  return recomendadosEmbaralhados.slice(0, 10);
}

export async function getHomeMovies(favoriteGenres: string[]) {
  try {
    const querySnapshot = await getDocs(collection(db, "movies"));
    const todosOsFilmes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FilmeComId[]; 

    const recomendadosPuros = gerarRecomendacoes(todosOsFilmes, favoriteGenres);

    const descobrirPuros = todosOsFilmes.filter(
      (filme) => !recomendadosPuros.some((rec) => rec.id === filme.id)
    );

    return {
      sucesso: true,
      recomendados: recomendadosPuros,
      descobrir: shuffleMovies(descobrirPuros),
      erro: null
    };

  } catch (error) {
    console.error("Erron no serviço de recomendação:", error);
    return {
      sucesso: false,
      recomendados: [],
      descobrir: [],
      erro: "Não foi possível carregar os filmes."
    };
  }
}