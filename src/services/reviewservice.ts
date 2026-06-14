import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Movie } from "@/models/movie";
import { Comment } from "@/models/comment";

/**
 * Adiciona uma nova avaliação a um filme específico, recalcula as médias 
 * de nota através do Model e atualiza o banco de dados.
 */
export async function addReviewToMovie(movieId: string, reviewPayload: any): Promise<any | null> {
  try {
    const docRef = doc(db, "movies", movieId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Filme não encontrado para avaliação.");

    const data = docSnap.data();

    // Reconstrói o estado dos comentários atuais em memória usando o Model
    const currentComments = (data.comments || []).map((c: any) => 
      new Comment(c.id, c.author, c.rating, c.movie, c.cinema, c.date, c.text, c.status)
    );

    // Reconstrói a entidade do filme com as notas vigentes
    const movie = new Movie(
      data.title,
      data.director,
      data.year,
      data.duration,
      data.classification,
      data.tags,
      data.image,
      data.rating || 0,
      data.ratingCount || 0,
      data.synopsis,
      data.created_at ? data.created_at.toDate() : new Date(),
      currentComments
    );

    // Cria a nova instância do comentário com os dados validados oriundos do formulário
    const newComment = new Comment(
      reviewPayload.id,
      reviewPayload.author,
      reviewPayload.rating,
      movieId,
      "",
      reviewPayload.date,
      reviewPayload.text,
      reviewPayload.status
    );

    movie.addComment(newComment);

    const updatedFirestoreData = {
      rating: movie.getRating(),
      ratingCount: movie.getRatingCount(),
      comments: movie.getAllComments().map(c => ({
        id: c.getId(),
        author: c.getAuthor(),
        rating: c.getRating(),
        movie: c.getMovie(),
        cinema: c.getCinema(),
        date: c.getDate(),
        text: c.getText(),
        status: c.getStatus()
      }))
    };

    await updateDoc(docRef, updatedFirestoreData);

    // Retorna a projeção de dados limpos formatada para o consumo direto da View
    return {
      id: movieId,
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
      comentarios: movie.getAllComments().map(c => ({
        id: c.getId(),
        user: c.getAuthor(),
        profilePic: c.getId() === reviewPayload.id ? reviewPayload.profilePic : "",
        rating: c.getRating(),
        comment: c.getText(),
        createdAt: c.getDate()
      }))
    };

  } catch (error) {
    console.error("Erro na camada de serviço ao processar avaliação:", error);
    return null;
  }
}