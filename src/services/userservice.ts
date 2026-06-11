import { auth, db } from "@/config/firebase";
import { AuthError, deleteUser, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

export interface UpdateResult {
  valid: boolean;
  error: string;
}

export interface AdminVerificationResult {
  valid: boolean;
  isAdmin: boolean;
  error?: string;
}

export async function verifyAdmin(): Promise<AdminVerificationResult> {
  try {
    if (!auth.currentUser) {
      return {
        valid: false,
        isAdmin: false,
        error: "Usuário não autenticado"
      };
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return {
        valid: false,
        isAdmin: false,
        error: "Perfil do usuário não encontrado"
      };
    }

    const data = snap.data();
    const isAdmin = data.isAdm === true || data.isAdmin === true;

    return {
      valid: true,
      isAdmin
    };
  } catch (error) {
    console.error("Erro ao verificar admin:", error);
    return {
      valid: false,
      isAdmin: false,
      error: "Erro ao verificar permissões de administrador"
    };
  }
}

export async function createUserProfile(
  userId: string,
  name: string,
  email: string,
  favoriteGenres: string[]
): Promise<UpdateResult> {
  try {
    await setDoc(doc(db, 'users', userId), {
      name: name.trim(),
      email: email.trim(),
      favorite_genres: favoriteGenres,
      profile_picture: '',
      pipoka: 0,
      uid: userId,
    });

    return { valid: true, error: '' };
  } catch (error) {
    console.error('Erro ao criar documento do usuário:', error);
    return { valid: false, error: 'Erro ao criar perfil do usuário.' };
  }
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

    const userDocRef = doc(db, 'users', currentUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      try {
        await deleteUser(currentUser);
      } catch (e) {
      }
      await signOut(auth);
      return {
        valid: true,
        error: ""
      };
    }

    const userData = userSnapshot.data();

    const deletedRef = doc(db, 'deleted_users', currentUser.uid);
    await setDoc(deletedRef, {
      ...userData,
      deletedAt: serverTimestamp(),
      deletedByUid: currentUser.uid,
    });

    await deleteDoc(userDocRef);

    // Deleta auth user
    await deleteUser(currentUser);

    await signOut(auth);

    return {
      valid: true,
      error: ""
    };
  } catch (error) {
    const authError = error as AuthError;
    return {
      valid: false,
      error: "Erro ao desativar/excluir perfil do usuário"
    };
  }
}
