import { db } from "@/config/firebase";
import { doc, setDoc, collection, updateDoc, increment, DocumentReference, GeoPoint, Timestamp, addDoc, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { Cinema } from "@/models/cinema";
import { Session } from "@/models/session";

export interface CinemaResult {
  valid: boolean;
  error: string;
  id?: string;
}

export interface CinemaServiceResult {
  valid: boolean;
  error: string;
}

export async function registerCinema(cinema: Cinema): Promise<CinemaResult> {
  try {
    const cinemaDocRef = doc(collection(db, "cinemas"));
    const reviewsDocRef = doc(db, "reviews_cinemas", cinemaDocRef.id);

    const firestoreData = {
      nome: cinema.getNome(),
      cidade: cinema.getCidade(),
      endereco: cinema.getEndereco(),
      url_imagem: cinema.getUrlImagem(),
      coordinates: new GeoPoint(cinema.getLatitude(), cinema.getLongitude()),
      created_at: Timestamp.now(),
      filmesEmCartaz: cinema.getFilmesEmCartaz(),
      sessoes: cinema.getSessoes().map(s => ({ id_filme: s.getIdFilme(), data: s.getData(), horario: s.getHorario() })),
      avaliacao: 0,
      is_parceiro: cinema.getIsParceiro(),
      reviews_ref: reviewsDocRef,
      qnt_avaliacoes: cinema.getQntAvaliacoes()
    };

    await setDoc(cinemaDocRef, firestoreData);

    await setDoc(reviewsDocRef, {
      cinemaId: cinemaDocRef.id,
      initializedAt: Timestamp.now()
    });

    return { valid: true, error: "", id: cinemaDocRef.id };
  } catch (error) {
    return { valid: false, error: "Erro ao cadastrar." };
  }
}

export async function saveOrUpdateCinema(dadosCrus: any, editId?: string): Promise<boolean> {
  try {
    const sessoesInstanciadas = (dadosCrus.sessoes || []).map((s: any) =>
      Session.createSessao({
        idFilme: s.idFilme || s.id_filme,
        data: s.data,
        horario: s.horario,
      })
    );

    const cinemaInstancia = Cinema.createCinema({
      nome: dadosCrus.nome,
      cidade: dadosCrus.cidade,
      endereco: dadosCrus.endereco,
      latitude: dadosCrus.latitude,
      longitude: dadosCrus.longitude,
      urlImagem: dadosCrus.urlImagem || dadosCrus.url_imagem,
      filmesEmCartaz: dadosCrus.filmesEmCartaz,
      sessoes: sessoesInstanciadas,
      isParceiro: dadosCrus.isParceiro ?? dadosCrus.is_parceiro,
    });

    if (editId) {
      const docRef = doc(db, "cinemas", editId);
      const docSnap = await getDoc(docRef);
      const dadosAtuais = docSnap.exists() ? docSnap.data() : {};
      
      const updatePayload = {
        nome: cinemaInstancia.getNome(),
        cidade: cinemaInstancia.getCidade(),
        endereco: cinemaInstancia.getEndereco(),
        url_imagem: cinemaInstancia.getUrlImagem(),
        coordinates: new GeoPoint(cinemaInstancia.getLatitude(), cinemaInstancia.getLongitude()),
        filmesEmCartaz: cinemaInstancia.getFilmesEmCartaz(),
        sessoes: cinemaInstancia.getSessoes().map(sessao => ({
          id_filme: sessao.getIdFilme(),
          data: sessao.getData(),
          horario: sessao.getHorario()
        })),
        is_parceiro: cinemaInstancia.getIsParceiro(),
        avaliacao: dadosAtuais.avaliacao || 0,
        comentarios: dadosAtuais.comentarios || [],
      };
      
      await updateDoc(docRef, updatePayload);
      return true;
    } else {
      const resultado = await registerCinema(cinemaInstancia);
      return resultado.valid;
    }
  } catch (error) {
    console.error("Erro no cinemaService ao instanciar/salvar dados:", error);
    throw error; 
  }
}

export async function getAllCinemas(): Promise<any[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "cinemas"));
    
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      
      // Mapeia os dados brutos estendendo fallbacks seguros para a listagem
      return {
        id: docSnap.id,
        nome: data.nome || data.name || "Cinema sem nome",
        latitude: data.latitude ?? data.coordinates?.latitude,
        longitude: data.longitude ?? data.coordinates?.longitude,
        imagem: data.imagem || data.url_imagem || data.urlImagem || null,
        avaliacao: data.avaliacao || data.rating || 0,
        isParceiro: data.isParceiro || data.is_parceiro || false,
        comentarios: data.comentarios || data.comments || [],
        filmesEmCartaz: data.filmesEmCartaz || data.moviesInTheaters || []
      };
    });
  } catch (error) {
    console.error("Erro na camada de serviço ao buscar todos os cinemas:", error);
    return [];
  }
}

export async function getCinemaById(id: string): Promise<any | null> {
  try {
    const docRef = doc(db, "cinemas", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    let viewComments: any[] = [];

    const reviewsCollectionRef = collection(db, "reviews_cinemas", id, "reviews");
    const reviewsSnap = await getDocs(reviewsCollectionRef);

    for (const reviewDoc of reviewsSnap.docs) {
        const c = reviewDoc.data();
        let currentProfilePic = "";
        
        if (c.user_ref) {
          const userSnap = await getDoc(c.user_ref) as any;
          if (userSnap.exists()) {
            currentProfilePic = userSnap.data().profile_picture || "";
          }
        }
      
      viewComments.push({
        id: reviewDoc.id,
        user: c.author || "Usuário",
        rating: c.rating || 0,
        comment: c.text || "",
        createdAt: c.createdAt ? c.createdAt.toDate().toISOString() : new Date().toISOString(),
        profilePic: currentProfilePic
      });
    }

    return {
      id: snap.id,
      ...data,
      comentarios: viewComments
    };
  } catch (error) {
    console.error("Erro ao buscar cinema:", error);
    return null;
  }
}

export async function deleteCinema(id: string, adminPassword?: string): Promise<CinemaServiceResult> {
  try {
    // Caso precise validar a senha passada por parâmetro no futuro:
    if (adminPassword && adminPassword.trim() === "") {
      return { valid: false, error: "Senha de confirmação em branco." };
    }

    const docRef = doc(db, "cinemas", id);
    await deleteDoc(docRef);

    return { valid: true, error: "" };
  } catch (error) {
    console.error("Erro ao deletar cinema no service:", error);
    return { valid: false, error: "Erro ao excluir o cinema da base de dados." };
  }
}

/**
 * Atualiza o array de comentários e recalcula a nota média de avaliação do cinema.
 */
export async function updateCinemaReviews(
  id: string, 
  updatedComments: any[], 
  newAverage: number
): Promise<CinemaServiceResult> {
  try {
    const docRef = doc(db, "cinemas", id);
    
    await updateDoc(docRef, {
      comentarios: updatedComments,
      avaliacao: newAverage
    });

    return { valid: true, error: "" };
  } catch (error) {
    console.error("Erro ao atualizar avaliações do cinema no service:", error);
    return { valid: false, error: "Não foi possível salvar sua avaliação no banco de dados." };
  }
}
