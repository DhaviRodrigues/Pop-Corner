import { auth, db } from "@/config/firebase";
import { AuthError, deleteUser, signOut } from "firebase/auth";
import { doc, getDoc, query, getDocs, collection, setDoc, updateDoc, deleteDoc, serverTimestamp, where } from "firebase/firestore";
import { WatchlistEntry } from '@/types/userWatchlist';

export interface UpdateResult {
  valid: boolean;
  error: string;
}

export interface AdminVerificationResult {
  valid: boolean;
  isAdmin: boolean;
  error?: string;
}

export interface AdminUserResult {
  id: string;
  name: string;
  email: string;
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

export async function updateUserWatchlist(userId: string, watchlist: WatchlistEntry[]): Promise<UpdateResult> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const watchlistData = watchlist.map(item => item.toFirestore());
    await setDoc(userDocRef, { watchlist: watchlistData }, { merge: true });
    return { valid: true, error: '' };
  } catch (error) {
    console.error('Erro ao atualizar watchlist do usuário:', error);
    return { valid: false, error: 'Erro ao atualizar watchlist do usuário.' };
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

export async function fetchAllAdminsService(): Promise<AdminUserResult[]> {
  try {
    const q = query(collection(db, 'users'), where('isAdmin', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((document) => ({
      id: document.id,
      name: document.data().name || 'Sem nome',
      email: document.data().email,
    }));
  } catch (error) {
    console.error("Erro ao buscar administradores:", error);
    throw new Error("Não foi possível carregar a lista de administradores.");
  }
}

export async function addAdminService(emailToSearch: string): Promise<void> {
  const q = query(collection(db, 'users'), where('email', '==', emailToSearch));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Nenhum usuário cadastrado com este e-mail.");
  }

  const userDoc = querySnapshot.docs[0];
  
  if (userDoc.data().isAdmin) {
    throw new Error("Este usuário já possui privilégios de administrador.");
  }

  await updateDoc(doc(db, 'users', userDoc.id), { isAdmin: true });
}

export async function removeAdminService(targetUserId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', targetUserId), { isAdmin: false });
  } catch (error) {
    console.error("Erro no serviço ao remover admin:", error);
    throw new Error("Erro no servidor ao tentar remover os privilégios do usuário.");
  }
}
