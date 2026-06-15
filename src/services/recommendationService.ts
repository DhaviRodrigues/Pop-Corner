import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase"; 
import { Recomendador } from "@/models/recommendation";
import { fetchUserData } from "@/services/userservice"; 
import { IMoviePayload } from "@/types/IMoviePayload";

type FilmeComId = IMoviePayload & { id: string };

const shuffleMovies = (movies: FilmeComId[]) => [...movies].sort(() => Math.random() - 0.5);

export async function getHomeMovies() {
  try {
    const usuarioLogado = await fetchUserData();

    const querySnapshot = await getDocs(collection(db, "movies"));
    
    const todosOsFilmes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FilmeComId[]; 

    const recomendador = new Recomendador(todosOsFilmes);
    const usuarioParaFiltro = usuarioLogado || { favorite_genres: [] };
    
    const recomendadosPuros = recomendador.gerarParaUsuario(usuarioParaFiltro as any) as FilmeComId[];

    const descobrirPuros = todosOsFilmes.filter(
      (filme) => !recomendadosPuros.some((rec) => rec.id === filme.id)
    );

    return {
      sucesso: true,
      recomendados: shuffleMovies(recomendadosPuros),
      descobrir: shuffleMovies(descobrirPuros),
      erro: null
    };

  } catch (error) {
    console.error("🚨 ERRO NO SERVIÇO DE RECOMENDAÇÃO:", error);
    return {
      sucesso: false,
      recomendados: [],
      descobrir: [],
      erro: "Não foi possível carregar os filmes."
    };
  }
}