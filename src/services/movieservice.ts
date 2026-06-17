import { db } from "@/config/firebase";
import { 
  collection, getDocs, query, orderBy, doc, 
  getDoc, deleteDoc, Timestamp, setDoc 
} from "firebase/firestore";
import { Movie } from "@/models/movie";

export interface MovieServiceResult {
  valid: boolean;
  error: string;
  id?: string;
}

export interface IMovieCommentsResult {
  id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
  profilePic: string;
}

export interface IMovieDetailsResult {
  id: string;
  title: string;
  director: string;
  year: number;
  duration: string;
  classification: string;
  tags: string[];
  image: string;
  rating: number;
  ratingCount: number;
  synopsis: string;
  reviewRef: string;
  comentarios: IMovieCommentsResult[];
}

export interface HomeMoviesResult {
  sucesso: boolean;
  recomendados: any[];
  descobrir: any[];
  erro?: string;
}

export interface IMovieCardResult {
  id: string;
  title: string;
  director: string;
  year: number;
  duration: string;
  classification: string;
  tags: string[];
  image: string;
  rating: number;
  ratingCount: number;
  synopsis: string;
  scoreRecomendacao?: number;
}

export interface IMovieService {
  registerMovie(payload: any): Promise<MovieServiceResult>;
  getMovieById(id: string): Promise<IMovieDetailsResult | null>;
  deleteMovie(id: string, adminPassword?: string): Promise<MovieServiceResult>;
  getAllMovies(): Promise<IMovieCardResult[]>;
  getAllMoviesWithRecommendations(favoriteGenres: string[]): Promise<IMovieCardResult[]>;
  getHomeMovies(favoriteGenres: string[]): Promise<HomeMoviesResult>;
}

export class MovieService {

  public static async registerMovie(payload: any): Promise<MovieServiceResult> {
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

  public static async getMovieById(id: string): Promise<IMovieDetailsResult | null> {
    try {
      const docRef = doc(db, "movies", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data() as any;

      let reviewsCollectionRef;
      if (data.reviews_ref) {
        reviewsCollectionRef = collection(data.reviews_ref, "reviews");
      } else {
        reviewsCollectionRef = collection(db, "reviews_movies", id, "reviews");
      }

      const reviewsSnap = await getDocs(reviewsCollectionRef);
      
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
        reviewRef: data.reviews_ref?.path || "",
        comentarios: viewComments
      };
    } catch (error) {
      console.error("Erro ao buscar filme por ID:", error);
      return null;
    }
  }

  public static async deleteMovie(id: string, adminPassword?: string): Promise<MovieServiceResult> {
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

  public static async getAllMovies(): Promise<IMovieCardResult[]> {
    try {
      const q = query(collection(db, "movies"), orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();

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

  public static async getHomeMovies(favoriteGenres: string[]): Promise<HomeMoviesResult> {
    try {
      const todosOsFilmes = await MovieService.getAllMovies(); 

      if (!todosOsFilmes || todosOsFilmes.length === 0) {
        return { sucesso: true, recomendados: [], descobrir: [] };
      }

      let recomendados = todosOsFilmes.filter((movie: any) => {
        const generosFilme = movie.genero || movie.genres || movie.tags || [];
        const upperGenerosFilme = generosFilme.map((g: string) => g.trim().toUpperCase());
        const upperFavoriteGenres = favoriteGenres.map((g: string) => g.trim().toUpperCase());
        
        return upperGenerosFilme.some((g: string) => upperFavoriteGenres.includes(g));
      });

      if (recomendados.length === 0) {
        recomendados = todosOsFilmes.slice(0, 5);
      }

      const recomendadosIds = recomendados.map(m => m.id);

      const descobrir = todosOsFilmes.filter((movie) => !recomendadosIds.includes(movie.id));

      return {
        sucesso: true,
        recomendados: recomendados,
        descobrir: descobrir.length > 0 ? descobrir : todosOsFilmes
      };
    } catch (error: any) {
      console.error("Erro interno no MovieService ao processar filmes da Home:", error);
      return {
        sucesso: false,
        recomendados: [],
        descobrir: [],
        erro: error.message || "Erro ao processar catálogo de filmes."
      };
    }
  }
}