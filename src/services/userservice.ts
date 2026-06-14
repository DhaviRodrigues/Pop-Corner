import { auth, db } from "@/config/firebase";
import { AuthError, deleteUser, signOut } from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  getDocs, 
  collection, 
  where
} from "firebase/firestore";
import { WatchlistEntry } from '@/models/userWatchlist';
import { getMovieById } from "@/services/movieservice";
import { User } from "@/models/user";
import { IUser } from "@/types/IUser";

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

export interface WatchlistFetchResult {
  id: string;
  image: string | null;
  title: string;
  genres: string[];
  releaseDate: any;
  addedAt: string | number;
}

export async function fetchUserData(): Promise<User | null> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const userDocRef = doc(db, 'users', currentUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as IUser;
      let watchlistArr: WatchlistEntry[] = [];

      try {
        if (Array.isArray(userData.watchlist)) {
          watchlistArr = userData.watchlist.map((w: any) => {
            const idFilme = w.id_filme || w.idFilme || w.id || '';
            const added = w.added_at || w.addedAt || w.dataAdicionado || w.added || '';
            return WatchlistEntry.createEntry({ idFilme: String(idFilme), dataAdicionado: String(added) });
          }).filter(Boolean);
        }
      } catch (e) {
        console.warn('Erro ao converter watchlist do Firestore no Service:', e);
        watchlistArr = [];
      }

      return new User(
        currentUser.uid,
        userData.name || '',
        userData.email || '',
        userData.profile_picture || '',
        userData.favorite_genres || [],
        userData.pipoka || 0,
        watchlistArr
      );
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar e instanciar dados do usuário:", error);
    return null;
  }
}

export async function addMovieToWatchlist(userId: string, idFilme: string): Promise<UpdateResult> {
  try {
    const userInstance = await fetchUserData(); 
    
    if (!userInstance) {
      return { valid: false, error: 'Perfil do usuário não encontrado ou deslogado.' };
    }

    const localResult = userInstance.addMovieToLocalWatchlist(idFilme);
    if (!localResult.valid) return localResult;

    return updateUserWatchlist(userId, userInstance.getWatchlist());
  } catch (error) {
    console.error("Erro ao adicionar filme no service:", error);
    return { valid: false, error: "Erro interno ao processar a requisição." };
  }
}

export async function removeMovieFromWatchlist(userId: string, idFilme: string): Promise<UpdateResult> {
  try {
    const userInstance = await fetchUserData(); 
    
    if (!userInstance) {
      return { valid: false, error: 'Perfil do usuário não encontrado ou deslogado.' };
    }
    const localResult = userInstance.removeMovieFromLocalWatchlist(idFilme);
    if (!localResult.valid) return localResult;
    return updateUserWatchlist(userId, userInstance.getWatchlist());
  } catch (error) {
    console.error("Erro ao remover filme no service:", error);
    return { valid: false, error: "Erro interno ao processar a requisição." };
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
    });

    return { valid: true, error: '' };
  } catch (error) {
    console.error('Erro ao criar documento do usuário:', error);
    return { valid: false, error: 'Erro ao criar perfil do usuário.' };
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
export async function fetchWatchlistMoviesForView(): Promise<WatchlistFetchResult[]> {
  try {
    const userInstance = await fetchUserData();
    if (!userInstance) return [];

    const userWatchlist = userInstance.getWatchlist() ?? [];

    const fetchedMovies = await Promise.all(
      userWatchlist.map(async (watchlistItem, index) => {
        const movieId = watchlistItem.getIdFilme();
        const dataAdicionado = (watchlistItem as any).dataAdicionado || String(index);
        
        try {
          const movieDataFromService = await getMovieById(movieId);
          
          if (movieDataFromService) {
            return {
              id: movieId,
              image: movieDataFromService.image ?? null,
              title: movieDataFromService.title ?? '',
              // Captura e repassa as propriedades necessárias para a ordenação na View
              genres: movieDataFromService.genres ?? movieDataFromService.generos ?? [],
              releaseDate: movieDataFromService.releaseDate?.toDate?.() || movieDataFromService.releaseDate || 0,
              addedAt: dataAdicionado,
              missing: false,
            };
          }
        } catch (error) {
          console.warn(`Erro ao buscar filme ${movieId} no service de Watchlist:`, error);
        }

        // Objeto de fallback caso o filme falhe, mantendo a estrutura do tipo correspondente
        return { 
          id: movieId, 
          image: null, 
          title: '', 
          genres: [], 
          releaseDate: 0, 
          addedAt: String(index), 
          missing: true 
        };
      })
    );

    // Agora o filtro remove os itens inválidos e o TypeScript aceita o cast perfeitamente
    const validMovies = fetchedMovies.filter(m => !m.missing && m.image);
    
    return validMovies as WatchlistFetchResult[];
  } catch (error) {
    console.error("Erro no fluxo do service da watchlist:", error);
    return [];
  }
}