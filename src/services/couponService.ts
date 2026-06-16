import { db } from "@/config/firebase";
import { addDoc, collection, serverTimestamp, getDocs, doc, getDoc, updateDoc, deleteDoc, runTransaction, setDoc } from "firebase/firestore";
import { UpdateResult } from "@/services/userservice";
import {Coupon} from "@/models/coupon"

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

export async function validateRedeemedCoupon(codigoCupom: string): Promise<ServiceResult<{ nome_cupom: string }>> {
  try {
    const docRef = doc(db, 'cupons_resgatados', codigoCupom.trim().toUpperCase());
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        valid: false,
        error: 'Não encontramos nenhum cupom com este código no sistema Pop-Corner.'
      };
    }

    const dadosCupom = docSnap.data();

    if (dadosCupom.status === 'USADO') {
      return {
        valid: false,
        error: `O cupom "${dadosCupom.nome_cupom || 'Resgatado'}" já foi utilizado anteriormente.`
      };
    }

    if (
      dadosCupom.status === 'Ativo' || 
      dadosCupom.status === 'ATIVO' || 
      dadosCupom.status === 'DISPONIVEL' || 
      dadosCupom.status === 'DISPONÍVEL'
    ) {
      await updateDoc(docRef, { 
        status: 'USADO',
        validadoEm: serverTimestamp()
      });

      // Atualiza o cupom na subcoleção do usuário
      if (dadosCupom.userId && dadosCupom.couponDocId) {
        try {
          const userCouponRef = doc(db, `user_coupons/${dadosCupom.userId}/coupons`, dadosCupom.couponDocId);
          await updateDoc(userCouponRef, {
            status: 'USADO'
          });
        } catch (err) {
          console.error("Erro ao atualizar cupom na subcoleção do usuário:", err);
        }
      }

      return {
        valid: true,
        data: {
          nome_cupom: dadosCupom.nome_cupom || 'Desconto'
        }
      };
    }

    return {
      valid: false,
      error: 'O cupom está num estado inválido para resgate.'
    };

  } catch (error) {
    console.error("Erro ao validar cupom no service:", error);
    return {
      valid: false,
      error: 'Falha ao comunicar com o servidor. Tente novamente.'
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

export async function purchaseCoupon(userId: string, couponData: any, userPipokas: number): Promise<UpdateResult> {
  try {
    const coupon = Coupon.fromFirestore(couponData.id, couponData);
    console.log("DEBUG COUPON DATA:", {
      tipo: coupon.getTipoCupom(),
      nome: coupon.getNomeCupom()
    });
    
    if (userPipokas < coupon.getValorPipokas()) {
      return { valid: false, error: "Pipokas insuficientes!" };
    }

    const dataVencimento = coupon.calcularDataVencimentoUso(new Date());
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { pipoka: userPipokas - coupon.getValorPipokas() });

    const couponRef = collection(db, `user_coupons/${userId}/coupons`);
    const tipoCupom = coupon.getTipoCupom();

    // 1. Gera o código único inato (ex: PPC-4839-A1B9)
    const randomChars = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueCode = `PPC-${randomChars()}-${randomChars()}`;

    // 2. Salva na subcoleção de cupons do usuário
    const docRef = await addDoc(couponRef, {
      type: tipoCupom,
      title: coupon.getNomeCupom(),
      circleText: coupon.getValorBeneficio()?.toString(),
      description: coupon.getDescricaoProduto(),
      status: "Ativo",
      validationCode: uniqueCode,
      urlIcone: coupon.getUrlIcone(),
      validity: dataVencimento.toLocaleDateString('pt-BR'),
      addedAt: serverTimestamp()
    });

    // 3. Salva na coleção global de cupons resgatados para permitir a validação pelo admin
    const globalResgateRef = doc(db, 'cupons_resgatados', uniqueCode);
    await setDoc(globalResgateRef, {
      userId: userId,
      couponDocId: docRef.id,
      nome_cupom: coupon.getNomeCupom(),
      status: "Ativo",
      resgatadoEm: serverTimestamp(),
      validadoEm: null
    });

    return { valid: true, error: "" };
  } catch (error) {
    console.error("Erro crítico na compra:", error);
    return { valid: false, error: `Erro na troca: ${error instanceof Error ? error.message : 'Dados do cupom inválidos.'}` };
  }
}