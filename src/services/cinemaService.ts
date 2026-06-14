import { db } from "@/config/firebase";
import { collection, addDoc, doc, getDoc, updateDoc, GeoPoint, Timestamp } from "firebase/firestore";
import { Cinema } from "@/models/cinema";
import { Session } from "@/models/session";

export interface CinemaResult {
  valid: boolean;
  error: string;
  id?: string;
}

export async function registerCinema(cinema: Cinema): Promise<CinemaResult> {
  try {
    const firestoreData = {
      nome: cinema.getNome(),
      cidade: cinema.getCidade(),
      endereco: cinema.getEndereco(),
      url_imagem: cinema.getUrlImagem(),
      coordinates: new GeoPoint(cinema.getLatitude(), cinema.getLongitude()),
      created_at: Timestamp.now(),
      nome_search: cinema.getNome().toLowerCase(),
      filmesEmCartaz: cinema.getFilmesEmCartaz(),
      sessoes: cinema.getSessoes().map(sessao => ({
        id_filme: sessao.getIdFilme(),
        data: sessao.getData(),
        horario: sessao.getHorario()
      })),
      avaliacao: cinema.getAvaliacao(),
      comentarios: cinema.getComentarios(),
      is_parceiro: cinema.getIsParceiro()
    };

    const docRef = await addDoc(collection(db, "cinemas"), firestoreData);
    return { valid: true, error: "", id: docRef.id };
  } catch (error) {
    console.error("Erro ao cadastrar cinema:", error);
    return { valid: false, error: "Ocorreu um erro ao salvar o cinema." };
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

export async function getCinemaById(id: string): Promise<any | null> {
  try {
    const docRef = doc(db, "cinemas", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: snap.id,
        ...data,
        coordinates: data.coordinates ? {
          latitude: data.coordinates.latitude,
          longitude: data.coordinates.longitude
        } : null,
        sessoes: (data.sessoes || []).map((s: any) => ({
          idFilme: s.id_filme,
          data: s.data,
          horario: s.horario
        }))
      };
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar cinema por ID no service:", error);
    return null;
  }
}