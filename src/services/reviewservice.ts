import { auth, db } from "@/config/firebase";
import { collection, doc, getDoc, updateDoc, setDoc, Timestamp, DocumentReference, increment } from "firebase/firestore";
import { Movie } from "@/models/movie";
import { Comment } from "@/models/comment";
import { Cinema } from "@/models/cinema";

/**
 * Adiciona uma nova avaliação a um filme específico, recalcula as médias 
 * de nota através do Model e atualiza o banco de dados.
 */
export async function addReviewToMovie(movieId: string, reviewPayload: any): Promise<any | null> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Usuário não autenticado para fazer avaliação.");
    const userId = currentUser.uid;

    const movieDocRef = doc(db, "movies", movieId);
    const movieSnap = await getDoc(movieDocRef);

    if (!movieSnap.exists()) throw new Error("Filme não encontrado para avaliação.");
    const movieData = movieSnap.data();

    const reviewsDocRef = movieData.reviews_ref as DocumentReference;
    const reviewsCollectionRef = collection(reviewsDocRef, "reviews");

    const userReviewDocRef = doc(reviewsCollectionRef, userId);
    const userReviewSnap = await getDoc(userReviewDocRef);

    if (userReviewSnap.exists()) {
      return { valid: false, error: "Você já avaliou este filme. Só é permitida uma avaliação por usuário." };
    }

    const movie = new Movie(
      movieData.title,
      movieData.director,
      movieData.year,
      movieData.duration,
      movieData.classification,
      movieData.tags,
      movieData.image,
      movieData.rating || 0,
      movieData.ratingCount || 0,
      movieData.synopsis,
      movieData.created_at ? movieData.created_at.toDate() : new Date(),
      [] 
    );

    const userRef = doc(db, "users", userId);
    const newComment = new Comment(
      userId,
      reviewPayload.author,
      reviewPayload.rating,
      movieId,
      reviewPayload.cinema || "",
      reviewPayload.date,
      reviewPayload.text,
      reviewPayload.status || 'Aprovado'
    );

    movie.addComment(newComment);
    await setDoc(userReviewDocRef, {
      author: newComment.getAuthor(),
      rating: newComment.getRating(),
      cinema: newComment.getCinema(),
      date: newComment.getDate(),
      text: newComment.getText(),
      status: newComment.getStatus(),
      createdAt: Timestamp.now(),
      user_ref: userRef 
    });

    await updateDoc(movieDocRef, {
      rating: movie.getRating(),
      ratingCount: movie.getRatingCount()
    });

    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      pipoka: increment(250)
    });

    return { 
      valid: true, 
      error: "",
      data: {
        id: movieId,
        title: movie.getTitle(),
        rating: movie.getRating(),
        ratingCount: movie.getRatingCount()
      }
    };

  } catch (error: any) {
    console.error("Erro ao processar avaliação:", error);
    return { valid: false, error: error.message || "Erro interno ao enviar a avaliação." };
  }
}

export async function addReviewToCinema(cinemaId: string, reviewPayload: any) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Usuário não autenticado.");

    const reviewRef = doc(db, "reviews_cinemas", cinemaId, "reviews", currentUser.uid);
    const reviewSnap = await getDoc(reviewRef);
    if (reviewSnap.exists()) {
      throw new Error("Você já avaliou este cinema. Só é permitida uma avaliação por usuário.");
    }

    const cinemaDocRef = doc(db, "cinemas", cinemaId);
    const cinemaSnap = await getDoc(cinemaDocRef);
    if (!cinemaSnap.exists()) throw new Error("Cinema não encontrado.");
    
    const cinemaData = cinemaSnap.data();
    
    const currentRating = cinemaData.avaliacao || 0;
    const currentCount = cinemaData.qnt_avaliacoes || 0;
    
    const newCount = currentCount + 1;
    const newAverage = ((currentRating * currentCount) + reviewPayload.rating) / newCount;

    const newComment = new Comment(
        currentUser.uid, 
        reviewPayload.author, 
        reviewPayload.rating, 
        "", 
        cinemaId, 
        reviewPayload.date, 
        reviewPayload.text, 
        'Aprovado'
    );

    await setDoc(reviewRef, {
      author: newComment.getAuthor(),
      rating: newComment.getRating(),
      text: newComment.getText(),
      createdAt: Timestamp.now(),
      user_ref: doc(db, "users", currentUser.uid)
    });

    await updateDoc(cinemaDocRef, { 
        avaliacao: newAverage,
        qnt_avaliacoes: newCount 
    });
    
    await updateDoc(doc(db, "users", currentUser.uid), { pipoka: increment(250) });

    return { valid: true, error: "" };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}