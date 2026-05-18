import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Cinema } from "@/types/cinema";

export interface CinemaResult {
  valid: boolean;
  error: string;
  id?: string;
}

export async function registerCinema(cinema: Cinema): Promise<CinemaResult> {
  try {
    const docRef = await addDoc(collection(db, "cinemas"), cinema.toFirestore());
    
    return {
      valid: true,
      error: "",
      id: docRef.id
    };
  } catch (error) {
    console.error("Erro ao cadastrar cinema:", error);
    return {
      valid: false,
      error: "Ocorreu um erro ao salvar o cinema."
    };
  }
}