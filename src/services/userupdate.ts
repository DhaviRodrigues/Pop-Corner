import { auth, db } from "@/config/firebase";
import { AuthError, deleteUser } from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export interface UpdateResult {
  valid: boolean;
  error: string;
}

export async function updateUserName(newName: string): Promise<UpdateResult> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return {
        valid: false,
        error: "Usuário não autenticado"
      };
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, {
      name: newName.trim()
    });

    return {
      valid: true,
      error: ""
    };
  } catch (error) {
    const authError = error as AuthError;
    console.error("Erro ao atualizar nome do usuário:", authError);
    return {
      valid: false,
      error: "Erro ao atualizar nome do usuário"
    };
  }
}

export async function deleteUserProfile(): Promise<UpdateResult> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return {
        valid: false,
        error: "Usuário não autenticado"
      };
    }

    // Deleta documento do usuário no Firestore
    const userDocRef = doc(db, 'users', currentUser.uid);
    await deleteDoc(userDocRef);

    // Deleta usuário do Firebase Auth
    await deleteUser(currentUser);

    return {
      valid: true,
      error: ""
    };
  } catch (error) {
    const authError = error as AuthError;
    console.error("Erro ao deletar perfil do usuário:", authError);
    return {
      valid: false,
      error: "Erro ao deletar perfil do usuário"
    };
  }
}
