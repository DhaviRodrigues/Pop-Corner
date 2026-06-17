import { db } from "@/config/firebase";
import { 
  doc, setDoc, collection, updateDoc, GeoPoint, 
  Timestamp, getDocs, deleteDoc, getDoc 
} from "firebase/firestore";
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

export interface ICinemaCommentResult {
  id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
  profilePic: string;
}

export interface ICinemaCardResult {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  imagem: string | null;
  avaliacao: number;
  isParceiro: boolean;
  comentarios: any[];
  filmesEmCartaz: string[];
}

export interface ICinemaDetailsResult {
  id: string;
  nome: string;
  cidade: string;
  endereco: string;
  url_imagem: string;
  coordinates: GeoPoint;
  filmesEmCartaz: string[];
  sessoes: Array<{ id_filme: string; data: string; horario: string }>;
  avaliacao: number;
  is_parceiro: boolean;
  reviews_ref: any;
  qnt_avaliacoes: number;
  comentarios: ICinemaCommentResult[];
}

export interface ICinemaService {
  registerCinema(cinema: Cinema): Promise<CinemaResult>;
  saveOrUpdateCinema(dadosCrus: any, editId?: string): Promise<boolean>;
  getAllCinemas(): Promise<ICinemaCardResult[]>;
  getCinemaById(id: string): Promise<ICinemaDetailsResult | null>;
  deleteCinema(id: string, adminPassword?: string): Promise<CinemaServiceResult>;
  updateCinemaReviews(id: string, updatedComments: any[], newAverage: number): Promise<CinemaServiceResult>;
}

export class CinemaService {

  public static async registerCinema(cinema: Cinema): Promise<CinemaResult> {
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
        sessoes: cinema.getSessoes().map(s => ({ 
          id_filme: s.getIdFilme(), 
          data: s.getData(), 
          horario: s.getHorario() 
        })),
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
      console.error("Erro ao registrar cinema:", error);
      return { valid: false, error: "Erro ao cadastrar o estabelecimento." };
    }
  }

  public static async saveOrUpdateCinema(dadosCrus: any, editId?: string): Promise<boolean> {
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
        urlImagem: dadosCrus.urlImagem,
        filmesEmCartaz: dadosCrus.filmesEmCartaz,
        sessoes: sessoesInstanciadas,
        isParceiro: dadosCrus.isParceiro,
        qnt_avaliacoes: dadosCrus.qnt_avaliacoes || 0,
        avaliacao: dadosCrus.avaliacao || 0,
        comentarios: dadosCrus.comentarios || []
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
        const resultado = await CinemaService.registerCinema(cinemaInstancia);
        return resultado.valid;
      }
    } catch (error) {
      console.error("Erro no CinemaService ao instanciar/salvar dados:", error);
      throw error; 
    }
  }

  public static async getAllCinemas(): Promise<ICinemaCardResult[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "cinemas"));
      
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        
        return {
          id: docSnap.id,
          nome: data.nome || data.name || "Cinema sem nome",
          latitude: data.coordinates?.latitude ?? data.latitude ?? 0,
          longitude: data.coordinates?.longitude ?? data.longitude ?? 0,
          imagem: data.url_imagem || data.imagem || data.urlImagem || null,
          avaliacao: data.avaliacao || data.rating || 0,
          isParceiro: data.is_parceiro || data.isParceiro || false,
          comentarios: data.comentarios || data.comments || [],
          filmesEmCartaz: data.filmesEmCartaz || data.moviesInTheaters || []
        };
      });
    } catch (error) {
      console.error("Erro na camada de serviço ao buscar todos os cinemas:", error);
      return [];
    }
  }

  public static async getCinemaById(id: string): Promise<ICinemaDetailsResult | null> {
    try {
      const docRef = doc(db, "cinemas", id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;

      const data = snap.data() as any;

      const reviewsCollectionRef = collection(db, "reviews_cinemas", id, "reviews");
      const reviewsSnap = await getDocs(reviewsCollectionRef);

      // Otimização de Performance: Resolução paralela assíncrona das imagens de perfil
      const viewComments: ICinemaCommentResult[] = await Promise.all(
        reviewsSnap.docs.map(async (reviewDoc) => {
          const c = reviewDoc.data();
          let currentProfilePic = "";
          
          if (c.user_ref) {
            try {
              const userSnap = await getDoc(c.user_ref);
              if (userSnap.exists()) {
                const userData = userSnap.data() as any;
                currentProfilePic = userData.profile_picture || "";
              }
            } catch (err) {
              console.warn(`Não foi possível carregar a imagem de perfil do usuário avaliador.`);
            }
          }
        
          return {
            id: reviewDoc.id,
            user: c.author || "Usuário",
            rating: c.rating || 0,
            comment: c.text || "",
            createdAt: c.createdAt ? c.createdAt.toDate().toISOString() : new Date().toISOString(),
            profilePic: currentProfilePic
          };
        })
      );

      return {
        id: snap.id,
        nome: data.nome || "",
        cidade: data.cidade || "",
        endereco: data.endereco || "",
        url_imagem: data.url_imagem || "",
        coordinates: data.coordinates,
        filmesEmCartaz: data.filmesEmCartaz || [],
        sessoes: data.sessoes || [],
        avaliacao: data.avaliacao || 0,
        is_parceiro: data.is_parceiro || false,
        reviews_ref: data.reviews_ref || null,
        qnt_avaliacoes: data.qnt_avaliacoes || 0,
        comentarios: viewComments
      };
    } catch (error) {
      console.error("Erro ao buscar detalhamento do cinema:", error);
      return null;
    }
  }

  public static async deleteCinema(id: string, adminPassword?: string): Promise<CinemaServiceResult> {
    try {
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

  public static async updateCinemaReviews(
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
}