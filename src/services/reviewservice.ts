import { auth, db } from "@/config/firebase";
import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, setDoc, Timestamp, DocumentReference, increment } from "firebase/firestore";
import { Movie } from "@/models/movie";
import { Comment } from "@/models/comment";

export async function addReviewToMovie(movieId: string, reviewPayload: any) {
  try {
    const movieRef = doc(db, "movies", movieId);
    const movieSnap = await getDoc(movieRef);
    
    if (!movieSnap.exists()) {
      return { valid: false, error: "Filme não encontrado." };
    }

    const data = movieSnap.data() as any;
    const reviewsPath = data.review_ref?.path || `reviews_movies/${movieId}/reviews`;
    await addDoc(collection(db, reviewsPath), {
      author: reviewPayload.author,
      rating: reviewPayload.rating,
      text: reviewPayload.text,
      createdAt: Timestamp.now(),
      status: reviewPayload.status || 'Aprovado',
      user_ref: reviewPayload.user_ref || null
    });

    return { valid: true, error: "" };
  } catch (error) {
    console.error("Erro ao salvar avaliação no Firestore:", error);
    return { valid: false, error: "Erro ao salvar a avaliação." };
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
    
    await updateDoc(doc(db, "users", currentUser.uid), { pipoka: increment(350) });

    return { valid: true, error: "" };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

export async function deleteMovieReview(movieId: string, userId: string): Promise<{ valid: boolean; error: string }> {
  try {
    const movieDocRef = doc(db, "movies", movieId);
    const movieSnap = await getDoc(movieDocRef);
    if (!movieSnap.exists()) throw new Error("Filme não encontrado.");

    const movieData = movieSnap.data();
    const reviewsDocRef = movieData.reviews_ref as DocumentReference;
    const reviewRef = doc(collection(reviewsDocRef, "reviews"), userId);
    
    const reviewSnap = await getDoc(reviewRef);
    if (!reviewSnap.exists()) throw new Error("Avaliação não encontrada.");
    
    const reviewRating = reviewSnap.data().rating || 0;

    await deleteDoc(reviewRef);

    const currentRating = movieData.avaliacao || 0;
    const currentCount = movieData.qnt_avaliacoes || 0;
    
    let newCount = currentCount - 1;
    let newAverage = 0;
    if (newCount > 0) {
      newAverage = ((currentRating * currentCount) - reviewRating) / newCount;
    }

    await updateDoc(movieDocRef, {
      avaliacao: newAverage,
      qnt_avaliacoes: newCount
    });

    return { valid: true, error: "" };
  } catch (error: any) {
    console.error("Erro ao deletar avaliação do filme:", error);
    return { valid: false, error: error.message || "Erro ao deletar comentário." };
  }
}

export async function deleteCinemaReview(cinemaId: string, userId: string): Promise<{ valid: boolean; error: string }> {
  try {
    const cinemaDocRef = doc(db, "cinemas", cinemaId);
    const cinemaSnap = await getDoc(cinemaDocRef);
    if (!cinemaSnap.exists()) throw new Error("Cinema não encontrado.");

    const cinemaData = cinemaSnap.data();
    const reviewRef = doc(db, "cinemas", cinemaId, "reviews", userId);
    
    const reviewSnap = await getDoc(reviewRef);
    if (!reviewSnap.exists()) throw new Error("Avaliação não encontrada.");
    
    const reviewRating = reviewSnap.data().rating || 0;

    // Remove o documento da avaliação
    await deleteDoc(reviewRef);

    // Recalcula a média e quantidade do cinema
    const currentRating = cinemaData.avaliacao || 0;
    const currentCount = cinemaData.qnt_avaliacoes || 0;
    
    let newCount = currentCount - 1;
    let newAverage = 0;
    if (newCount > 0) {
      newAverage = ((currentRating * currentCount) - reviewRating) / newCount;
    }

    await updateDoc(cinemaDocRef, {
      avaliacao: newAverage,
      qnt_avaliacoes: newCount
    });

    return { valid: true, error: "" };
  } catch (error: any) {
    console.error("Erro ao deletar avaliação do cinema:", error);
    return { valid: false, error: error.message || "Erro ao deletar comentário." };
  }
}