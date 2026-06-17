import { db } from "@/config/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc, deleteDoc, Timestamp, setDoc, DocumentReference } from "firebase/firestore";
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
export async function registerMovie(payload: any): Promise<MovieServiceResult> {
  try {
    const tagsArray = payload.tags 
      ? payload.tags.split(',').map((g: string) => g.trim().toUpperCase()) 
      : [];
    const computedYear = payload.year || new Date().getFullYear();

    const movieDocRef = doc(collection(db, "movies"));
    const movieId = movieDocRef.id;
    const reviewsDocRef = doc(db, "reviews_movies", movieId);

    const movieInstance = Movie.createMovie({
      title: payload.title,
      director: payload.director,
      year: computedYear,
      duration: payload.duration,
      classification: payload.classification,
      tags: tagsArray,
      image: payload.image,
      synopsis: payload.synopsis,
      rating: 0,
      ratingCount: 0,
      createdAt: new Date(),
      reviewRef: reviewsDocRef.path
    });

    const firestoreMovieData = {
      title: movieInstance.getTitle(),
      director: movieInstance.getDirector(),
      year: movieInstance.getYear(),
      duration: movieInstance.getDuration(),
      classification: movieInstance.getClassification(),
      tags: movieInstance.getTags(),
      image: movieInstance.getImage(),
      rating: movieInstance.getRating(),
      ratingCount: movieInstance.getRatingCount(),
      synopsis: movieInstance.getSynopsis(),
      created_at: Timestamp.fromDate(movieInstance.getCreatedAt()),
      reviews_ref: reviewsDocRef 
    };

    await setDoc(movieDocRef, firestoreMovieData);

    await setDoc(reviewsDocRef, {
      movieId: movieId,
      initializedAt: Timestamp.now()
    });

    return { valid: true, error: "", id: movieDocRef.id };
  } catch (error) {
    console.error("Erro no registerMovie:", error);
    return { valid: false, error: "Falha ao registrar o filme." };
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

    const data = docSnap.data() as any;

    const reviewsPath = data.review_ref?.path || `reviews_movies/${id}/reviews`;
    const reviewsSnap = await getDocs(collection(db, reviewsPath));
    
    const viewComments = await Promise.all(reviewsSnap.docs.map(async (reviewDoc) => {
      const c = reviewDoc.data() as any;
      let profilePic = "";
      if (c.user_ref) {
        const userSnap = await getDoc(c.user_ref);
        if (userSnap.exists()) {
          const userData = userSnap.data() as any;
          profilePic = userData.profile_picture || "";
        }
      }
      return {
        id: reviewDoc.id,
        user: c.author || "Usuário",
        rating: c.rating || 0,
        comment: c.text || "",
        createdAt: c.createdAt ? c.createdAt.toDate().toISOString() : new Date().toISOString(),
        profilePic
      };
    }));

    // Retorno explícito, sem spread operator para evitar sujeira de dados
    return {
      id: docSnap.id,
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
      reviewRef: data.review_ref?.path || "",
      comentarios: viewComments
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
        reviewRef: ""
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