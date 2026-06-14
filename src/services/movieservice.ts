import { db } from "@/config/firebase";
import { collection, getDocs, query, orderBy, addDoc, doc, getDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { Movie } from "@/models/movie";
import { Comment } from "@/models/comment";

export interface MovieServiceResult {
  valid: boolean;
  error: string;
  id?: string;
}

/**
 * Cadastra um filme isolado na base de dados do Firestore.
 */
export async function registerMovie(movie: Movie): Promise<MovieServiceResult> {
  try {
    const firestoreMovieData = {
      title: movie.getTitle(),
      director: movie.getDirector(),
      year: movie.getYear(),
      duration: movie.getDuration(),
      classification: movie.getClassification(),
      tags: movie.getTags(),
      image: movie.getImage(),
      rating: movie.getRating(),
      ratingCount: movie.getRatingCount(),
      synopsis: movie.getSynopsis(),
      created_at: Timestamp.fromDate(movie.getCreatedAt()),
      
      comments: movie.getAllComments().map(comment => ({
        id: comment.getId(),
        author: comment.getAuthor(),
        rating: comment.getRating(),
        movie: comment.getMovie(),
        cinema: comment.getCinema(),
        date: comment.getDate(),
        text: comment.getText(),
        status: comment.getStatus()
      }))
    };

    const docRef = await addDoc(collection(db, "movies"), firestoreMovieData);

    return { valid: true, error: "", id: docRef.id };
  } catch (error) {
    console.error("Erro na camada de serviço ao cadastrar filme:", error);
    return { valid: false, error: "Falha ao registrar o filme no banco de dados." };
  }
}

/**
 * Busca um filme pelo ID e o reconstrói utilizando as regras do Model Movie.
 */
export async function getMovieById(id: string): Promise<any | null> {
  try {
    const docRef = doc(db, "movies", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();

    const instancedComments = (data.comments || []).map((c: any) => 
      Comment.createComment({
        id: c.id,
        author: c.author || c.user || "Usuário",
        rating: c.rating,
        movie: c.movie || id,
        cinema: c.cinema || "",
        date: c.date || c.createdAt,
        text: c.text || c.comment,
        status: c.status || 'Aprovado'
      })
    );

    const movieModel = Movie.createMovie({
      title: data.title,
      director: data.director,
      year: data.year,
      duration: data.duration,
      classification: data.classification,
      tags: data.tags,
      image: data.image,
      rating: data.rating,
      ratingCount: data.ratingCount,
      synopsis: data.synopsis,
      createdAt: data.created_at ? data.created_at.toDate() : new Date(),
      comments: instancedComments
    });

    return {
      id: docSnap.id,
      title: movieModel.getTitle(),
      director: movieModel.getDirector(),
      year: movieModel.getYear(),
      duration: movieModel.getDuration(),
      classification: movieModel.getClassification(),
      tags: movieModel.getTags(),
      image: movieModel.getImage(),
      rating: movieModel.getRating(),
      ratingCount: movieModel.getRatingCount(),
      synopsis: movieModel.getSynopsis(),
      comentarios: movieModel.getAllComments().map(c => ({
        id: c.getId(),
        user: c.getAuthor(),
        rating: c.getRating(),
        comment: c.getText(),
        createdAt: c.getDate()
      }))
    };
  } catch (error) {
    console.error("Erro ao buscar filme por ID:", error);
    return null;
  }
}

/**
 * Remove um filme do banco de dados (Apenas para administradores)
 */
export async function deleteMovie(id: string, adminPassword?: string): Promise<MovieServiceResult> {
  try {
    if (adminPassword && adminPassword.trim() === "") {
      return { valid: false, error: "Senha de confirmação inválida." };
    }

    const docRef = doc(db, "movies", id);
    await deleteDoc(docRef);

    return { valid: true, error: "" };
  } catch (error) {
    console.error("Erro ao deletar filme no service:", error);
    return { valid: false, error: "Erro ao excluir o filme da base de dados." };
  }
}

export async function getAllMovies(): Promise<any[]> {
  try {
    // Alinhado com a coleção "movies" padrão do seu projeto
    const q = query(collection(db, "movies"), orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();

      // Reconstrói usando o factory do Model para garantir integridade das propriedades
      const movieModel = Movie.createMovie({
        title: data.title,
        director: data.director,
        year: data.year,
        duration: data.duration,
        classification: data.classification,
        tags: data.tags,
        image: data.image,
        rating: data.rating || 0,
        ratingCount: data.ratingCount || 0,
        synopsis: data.synopsis,
        createdAt: data.created_at ? data.created_at.toDate() : new Date(),
        comments: [] // Não precisamos carregar a árvore inteira de comentários na listagem da Home
      });

      // Retorna o objeto plano mapeado no padrão exato que a UI/MovieCard consome
      return {
        id: docSnap.id,
        title: movieModel.getTitle(),
        director: movieModel.getDirector(),
        year: movieModel.getYear(),
        duration: movieModel.getDuration(),
        classification: movieModel.getClassification(),
        tags: movieModel.getTags(),
        image: movieModel.getImage(),
        rating: movieModel.getRating(),
        ratingCount: movieModel.getRatingCount(),
        synopsis: movieModel.getSynopsis()
      };
    });
  } catch (error) {
    console.error("Erro na camada de serviço ao buscar listagem de filmes:", error);
    return [];
  }
}