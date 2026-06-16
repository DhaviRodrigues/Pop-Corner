import { auth, db } from "@/config/firebase";
import { AuthError, deleteUser, signOut } from "firebase/auth";
import { 
  doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, 
  query, addDoc, getDocs, collection, where
} from "firebase/firestore";
import { getMovieById } from "@/services/movieservice";
import { User } from "@/models/user";
import { IUser } from "@/types/IUser";

export interface UpdateResult { valid: boolean; error: string; }
export interface AdminVerificationResult { valid: boolean; isAdmin: boolean; error?: string; }
export interface AdminUserResult { id: string; name: string; email: string; }
export interface WatchlistFetchResult { id: string; image: string | null; title: string; genres: string[]; releaseDate: any; addedAt: string | number; }

export async function fetchUserData(): Promise<User | null> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const userDocRef = doc(db, 'users', currentUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as IUser;
      const watchlistPath = typeof userData.watchlist === 'string' ? userData.watchlist : `watchlist/${currentUser.uid}/filmes`;
      const couponsPath = typeof userData.coupons === 'string' ? userData.coupons : `user_coupons/${currentUser.uid}/coupons`;

      return new User(
        userData.name || '',
        userData.email || '',
        userData.profile_picture || '',
        userData.favorite_genres || [],
        userData.pipoka || 0,
        watchlistPath,
        couponsPath,
        currentUser.uid
      );
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
}


export async function verifyAdmin(): Promise<AdminVerificationResult> {
  try {
    if (!auth.currentUser) {
      return { valid: false, isAdmin: false, error: "Usuário não autenticado" };
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return { valid: false, isAdmin: false, error: "Perfil do usuário não encontrado" };
    }

    const data = snap.data();
    const isAdmin = data.isAdm === true || data.isAdmin === true;

    return { valid: true, isAdmin };
  } catch (error) {
    console.error("Erro ao verificar admin:", error);
    return { valid: false, isAdmin: false, error: "Erro ao verificar permissões de administrador" };
  }
}

export async function fetchAllAdmins(): Promise<AdminUserResult[]> {
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

export async function addAdmin(email: string): Promise<void> {

  const cleanEmail = email?.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!cleanEmail) {
    throw new Error("Por favor, insira um e-mail.");
  }

  if (!emailRegex.test(cleanEmail)) {
    throw new Error("O formato do e-mail é inválido.");
  }

  try {
    const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Nenhum usuário cadastrado com este e-mail foi encontrado.");
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, 'users', userDoc.id);

    await updateDoc(userRef, {
      isAdmin: true,
      isAdm: true
    });
  } catch (error: any) {
    console.error("Erro ao adicionar admin no service:", error);
    throw new Error(error.message || "Erro ao tentar promover usuário a administrador.");
  }
}

export async function removeAdmin(
  targetUserId: string, 
  targetUserEmail: string, 
  currentUserEmail?: string
): Promise<void> {
  if (targetUserEmail === currentUserEmail) {
    throw new Error("Ação bloqueada: Você não pode remover seus próprios privilégios de administrador.");
  }

  if (!targetUserId) {
    throw new Error("ID do usuário é obrigatório para remoção.");
  }

  try {
    const userRef = doc(db, 'users', targetUserId);
    
    await updateDoc(userRef, {
      isAdmin: false,
      isAdm: false
    });
  } catch (error) {
    console.error("Erro ao remover admin no service:", error);
    throw new Error("Não foi possível remover os privilégios de administrador deste usuário.");
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
      watchlist: `watchlist/${userId}/filmes`,
      coupons: `user_coupons/${userId}/coupons`,
    });

    const initDocRefWatchlist = doc(collection(db, `watchlist/${userId}/filmes`), 'init');
    await setDoc(initDocRefWatchlist, { created_at: serverTimestamp(), isPlaceholder: true });

    const initDocRefCoupons = doc(collection(db, `user_coupons/${userId}/coupons`), 'init');
    await setDoc(initDocRefCoupons, { created_at: serverTimestamp(), isPlaceholder: true });

    return { valid: true, error: '' };
  } catch (error) {
    console.error('Erro ao criar documento do usuário:', error);
    return { valid: false, error: 'Erro ao criar perfil.' };
  }
}

export async function updateUserProfileField(fieldsOb: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, fieldsOb);
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar campo do perfil no userservice:", error);
    return { success: false, error: "Erro interno ao atualizar os dados cadastrais." };
  }
}

export async function updateUserWatchlist(userId: string, watchlistPath: string): Promise<UpdateResult> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { watchlist: watchlistPath }); 
    return { valid: true, error: '' };
  } catch (error) {
    console.error('Erro ao atualizar caminho da watchlist:', error);
    return { valid: false, error: 'Erro ao atualizar referência da watchlist.' };
  }
}

export async function updateUserName(newName: string): Promise<UpdateResult> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { valid: false, error: "Usuário não autenticado" };
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, {
      name: newName.trim()
    });

    return { valid: true, error: "" };
  } catch (error) {
    const authError = error as AuthError;
    console.error("Erro ao atualizar nome do usuário:", authError);
    return { valid: false, error: "Erro ao atualizar nome do usuário" };
  }
}

export async function deleteUserProfile(): Promise<UpdateResult> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { valid: false, error: "Usuário não autenticado" };
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      try {
        await deleteUser(currentUser);
      } catch (e) {}
      await signOut(auth);
      return { valid: true, error: "" };
    }

    const userData = userSnapshot.data();

    const deletedRef = doc(db, 'deleted_users', currentUser.uid);
    await setDoc(deletedRef, {
      ...userData,
      deletedAt: serverTimestamp(),
      deletedByUid: currentUser.uid,
    });

    await deleteDoc(userDocRef);
    await deleteUser(currentUser);
    await signOut(auth);

    return { valid: true, error: "" };
  } catch (error) {
    return { valid: false, error: "Erro ao desativar/excluir perfil do usuário" };
  }
}
export async function addMovieToWatchlist(userId: string, idFilme: string): Promise<UpdateResult> {
  if (!userId) return { valid: false, error: "Usuário não identificado." };
  
  try {
    const watchlistPath = `watchlist/${userId}/filmes`; 
    const colRef = collection(db, watchlistPath);

    const duplicatedQuery = query(colRef, where("idFilme", "==", idFilme));
    const checkSnapshot = await getDocs(duplicatedQuery);
    
    if (!checkSnapshot.empty) {
      return { valid: false, error: "Este filme já está na sua watchlist." };
    }

    await addDoc(colRef, { 
      idFilme: idFilme, 
      addedAt: serverTimestamp() 
    });

    return { valid: true, error: '' };
  } catch (error) {
    console.error("Erro ao adicionar filme no service:", error);
    return { valid: false, error: "Erro ao adicionar filme à watchlist." };
  }
}

export async function fetchWatchlistMoviesForView(userId: string): Promise<WatchlistFetchResult[]> {
  if (!userId) return [];

  try {
    const snapshot = await getDocs(collection(db, `watchlist/${userId}/filmes`));
    const validDocs = snapshot.docs.filter(doc => doc.id !== 'init');

    const moviesList = await Promise.all(validDocs.map(async (d) => {
      const data = d.data();
      const rawAddedAt = data.addedAt?.toDate?.() ? data.addedAt.toDate().toISOString() : data.addedAt || '';
      
      try {
        const movieDataFromService = await getMovieById(data.idFilme);
        if (movieDataFromService) {
          return {
            id: data.idFilme,
            image: movieDataFromService.image ?? null,
            title: movieDataFromService.title ?? '',
            genres: movieDataFromService.genres ?? movieDataFromService.generos ?? [],
            releaseDate: movieDataFromService.releaseDate ?? 0,
            addedAt: rawAddedAt,
            missing: false
          };
        }
      } catch (err) {
        console.warn(`Erro ao buscar metadados do filme ${data.idFilme}`);
      }
      
      return { id: data.idFilme, image: null, title: 'Filme Indisponível', genres: [], releaseDate: 0, addedAt: rawAddedAt, missing: true };
    }));
    return moviesList.filter(m => !m.missing && m.image) as WatchlistFetchResult[];
  } catch (e) {
    console.error("Erro ao buscar watchlist para a View:", e);
    return [];
  }
}
export async function removeMovieFromWatchlist(userId: string, idFilme: string): Promise<UpdateResult> {
  try {
    const colRef = collection(db, `watchlist/${userId}/filmes`);
    const q = query(colRef, where("idFilme", "==", idFilme));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return { valid: false, error: "Filme não encontrado." };
    await deleteDoc(snapshot.docs[0].ref);
    return { valid: true, error: '' };
  } catch (error) {
    console.error("Erro ao remover filme:", error);
    return { valid: false, error: "Erro ao remover filme." };
  }
}

export const checkIfMovieInWatchlist = async (userId: string, movieId: string) => {
  try {

    const colRef = collection(db, `watchlist/${userId}/filmes`);
    const q = query(colRef, where("idFilme", "==", movieId));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Erro ao verificar watchlist:", error);
    return false;
  }
};

export async function fetchUserCoupons(userId: string) {
  try {
    const colRef = collection(db, `user_coupons/${userId}/coupons`);
    const snapshot = await getDocs(colRef);

    return snapshot.docs
      .filter(doc => doc.id !== 'init')
      .map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Erro ao buscar cupons:", e);
    return [];
  }
}

export async function addCouponToUser(userId: string, couponData: any) {
  try {
    const colRef = collection(db, `user_coupons/${userId}/coupons`);
    await addDoc(colRef, {
      ...couponData,
      addedAt: serverTimestamp()
    });
    return { valid: true, error: '' };
  } catch (error) {
    return { valid: false, error: 'Erro ao resgatar cupom.' };
  }
}