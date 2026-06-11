import { db } from "@/config/firebase";
import { addDoc, collection, serverTimestamp, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

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

export interface ServiceResult<T = any> {
  valid: boolean;
  data?: T;
  error?: string;
}

export async function fetchCoupons(): Promise<ServiceResult<any[]>> {
  try {
    const querySnapshot = await getDocs(collection(db, "cupons"));
    const couponsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      valid: true,
      data: couponsData
    };
  } catch (error) {
    console.error("Erro ao carregar cupons do Firebase:", error);
    return {
      valid: false,
      error: "Não foi possível carregar os cupons.",
      data: []
    };
  }
}

export async function getCoupon(couponId: string): Promise<ServiceResult<any>> {
  try {
    const docRef = doc(db, "cupons", couponId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return {
        valid: false,
        error: "Cupom não encontrado."
      };
    }
    
    return {
      valid: true,
      data: {
        id: docSnap.id,
        ...docSnap.data()
      }
    };
  } catch (error) {
    console.error("Erro ao buscar cupom:", error);
    return {
      valid: false,
      error: "Não foi possível buscar o cupom."
    };
  }
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

export async function updateCoupon(couponId: string, payload: Partial<CouponPayload>): Promise<ServiceResult> {
  try {
    const docRef = doc(db, "cupons", couponId);
    await updateDoc(docRef, {
      ...payload,
      atualizadoEm: serverTimestamp()
    });
    
    return {
      valid: true
    };
  } catch (error) {
    console.error("Erro ao atualizar cupom:", error);
    return {
      valid: false,
      error: "Não foi possível atualizar o cupom."
    };
  }
}

export async function deleteCoupon(couponId: string): Promise<ServiceResult> {
  try {
    await deleteDoc(doc(db, "cupons", couponId));
    
    return {
      valid: true
    };
  } catch (error) {
    console.error("Erro ao deletar cupom:", error);
    return {
      valid: false,
      error: "Não foi possível deletar o cupom."
    };
  }
}
