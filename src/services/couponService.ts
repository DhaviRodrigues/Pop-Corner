import { db } from "@/config/firebase";
import { addDoc, collection, serverTimestamp, getDocs, doc, getDoc, updateDoc, deleteDoc, increment, runTransaction} from "firebase/firestore";
import { UpdateResult } from "@/services/userservice";
import {Coupon} from "@/models/coupon"

export interface CouponPayload {
  nome: string;
  tipo: string;
  valorPipokas: number;
  valorBeneficios: string;
  urlIcone: string;
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
    const docRef = doc(db, 'cupons_resgatados', codigoCupom.trim());
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

    if (dadosCupom.status === 'DISPONIVEL' || dadosCupom.status === 'DISPONÍVEL') {
      await updateDoc(docRef, { 
        status: 'USADO',
        validadoEm: serverTimestamp()
      });

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
    const couponRef = doc(db, "cupons", couponData.id);
    const userRef = doc(db, 'users', userId);
    
    if (userPipokas < coupon.getValorPipokas()) return { valid: false, error: "Pipokas insuficientes!" };

    const randomChars = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueCode = `PPC-${randomChars()}-${randomChars()}`;
    const dataVencimento = coupon.calcularDataVencimentoUso(new Date());

   await runTransaction(db, async (transaction) => {
      const couponDoc = await transaction.get(couponRef);
      if (!couponDoc.exists()) throw new Error("Cupom não encontrado.");
      
      const data = couponDoc.data();
      if (data.limitada === true) {
        if (data.quantidade_disponivel !== null && data.quantidade_disponivel <= 0) {
          throw new Error("Cupom esgotado!");
        }
        transaction.update(couponRef, {
          quantidade_disponivel: increment(-1)
        });
      }

      // 1. Decremento Atômico
      transaction.update(couponRef, { quantidade_disponivel: increment(-1) });
      
      // 2. Débito de Pipokas
      transaction.update(userRef, { pipoka: userPipokas - coupon.getValorPipokas() });

      // 3. Registro no usuário
      const userCouponRef = doc(collection(db, `user_coupons/${userId}/coupons`));
      transaction.set(userCouponRef, {
        type: coupon.getTipoCupom(),
        title: coupon.getNomeCupom(),
        circleText: coupon.getValorBeneficio()?.toString(),
        description: coupon.getDescricaoProduto(),
        status: "Ativo",
        validationCode: uniqueCode,
        urlIcone: coupon.getUrlIcone(),
        validity: dataVencimento.toLocaleDateString('pt-BR'),
        addedAt: serverTimestamp()
      });

      // 4. Registro Global para Validação
      transaction.set(doc(db, 'cupons_resgatados', uniqueCode), {
        userId: userId,
        couponDocId: userCouponRef.id,
        nome_cupom: coupon.getNomeCupom(),
        status: "Ativo",
        resgatadoEm: serverTimestamp(),
        validadoEm: null
      });
    });

    return { valid: true, error: "" };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : "Erro na troca" };
  }
}