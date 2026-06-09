import { db } from "@/config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export interface CouponPayload {
  nome: string;
  tipo: string;
  valorPipokas: number;
  valorBeneficios: string;
  urlIcone: string;
  // opcional: pode ser string no formato dd/mm/yyyy ou um objeto Date (preferível para consultas)
  dataExpiracao?: string | Date;
  tempoValidade: string;
  limitada: boolean;
  temporaria: boolean;
  observacoes: string;
  qtdCupons?: number;
}

export interface CouponCreateResult {
  valid: boolean;
  id?: string;
  error?: string;
}

export async function createCoupon(
  payload: CouponPayload
): Promise<CouponCreateResult> {
  try {
    const docRef = await addDoc(collection(db, "cupons"), {
      ...payload,
      criadoEm: serverTimestamp(),
    });

    return {
      valid: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Erro ao criar cupom no Firestore:", error);
    return {
      valid: false,
      error: "Não foi possível salvar o cupom no Firebase.",
    };
  }
}
