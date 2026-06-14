import { db } from "@/config/firebase";
import { doc, writeBatch, collection, increment, getDoc} from "firebase/firestore";


export const creditarPipokasService = async (
  uid: string,
  quantidade: number,
  descricao: string,
  idItem: string
): Promise<{ valid: boolean; error?: string }> => {
  if (!uid || !idItem) return { valid: false, error: "Dados inválidos para computar pontos." };

  try {
    const travaDocId = `${uid}_${idItem}`;
    const travaRef = doc(db, "avaliacoes_realizadas", travaDocId);

    const travaSnap = await getDoc(travaRef);
    
    if (travaSnap.exists()) {
      return { valid: false, error: "Você já ganhou Pipokas por avaliar este item!" };
    }

    const batch = writeBatch(db);

    const userRef = doc(db, "users", uid);
    batch.update(userRef, {
      pipoka: increment(quantidade)
    });

    const novaTransacaoRef = doc(collection(db, "transacoes_pipokas"));
    batch.set(novaTransacaoRef, {
      id_usuario: uid,
      id_item_avaliado: idItem,
      quantidade: quantidade,
      tipo_transacao: "GANHO",
      descricao: descricao,
      created_at: new Date().toISOString()
    });

    batch.set(travaRef, {
      id_usuario: uid,
      id_item_avaliado: idItem,
      pontuado_em: new Date().toISOString()
    });

    await batch.commit();
    return { valid: true };

  } catch (error) {
    console.error("Erro crítico no serviço de pipokas:", error);
    return { valid: false, error: "Erro interno ao processar seus pontos." };
  }
};

export const comprarCupomService = async (
  uid: string,
  cupomId: string,
  custo: number,
  tituloCupom: string
): Promise<{ valid: boolean; error?: string }> => {
  if (!uid) return { valid: false, error: "Usuário não logado." };

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { valid: false, error: "Conta de usuário não encontrada no banco." };
    }

    const saldoAtual = userSnap.data().pipoka || 0;

    if (saldoAtual < custo) {
      return { valid: false, error: "Você não tem Pipokas suficientes para este cupom." };
    }

    const batch = writeBatch(db);

    batch.update(userRef, { 
      pipoka: saldoAtual - custo 
    });

    const transacaoRef = doc(collection(db, "transacoes_pipokas"));
    batch.set(transacaoRef, {
      id_usuario: uid,
      quantidade: -custo, 
      tipo_transacao: "GASTO",
      descricao: `Resgate do cupom: ${tituloCupom}`,
      created_at: new Date().toISOString()
    });

    const meusCuponsRef = doc(collection(db, `users/${uid}/meus_cupons`));
    batch.set(meusCuponsRef, {
      id_cupom: cupomId,
      titulo: tituloCupom,
      resgatado_em: new Date().toISOString(),
      usado: false 
    });

    await batch.commit();
    return { valid: true };

  } catch (error: any) {
    console.error("Erro na compra do cupom:", error);
    return { valid: false, error: "Falha ao processar a compra do cupom." };
  }
};