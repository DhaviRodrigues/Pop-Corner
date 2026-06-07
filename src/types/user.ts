import { auth, db } from "@/config/firebase";
import { AuthError, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { WatchlistEntry } from '@/types/watchlist';

export interface AuthResult {
  valid: boolean;
  error: string;
  uid?: string;
}

export interface LoginValidationResult {
  valid: boolean;
  error: string;
}

export interface RegisterValidationResult {
  valid: boolean;
  error: string;
}

export class User {
  constructor(
    public id: number,
    private name: string,
    private email: string,
    private profile_picture: string,
    private favorite_genres: string[],
    private pipoka: number,
    private watchlist: WatchlistEntry[] = []
  ) {}

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getGenres(): string[] {
    return this.favorite_genres;
  }

  getProfilePicture(): string {
    return this.profile_picture;
  }

  getPipoka(): number {
    return this.pipoka;
  }

  getWatchlist(): WatchlistEntry[] {
    return this.watchlist;
  }

  addMovieWatchlist(idFilme: string): void {
    const idLimpo = (idFilme || '').toString().trim();

    const jaExiste = this.watchlist.some(w => w.getIdFilme() === idLimpo);
    if (jaExiste) {
      throw new Error(`O filme com ID "${idLimpo}" já está na watchlist.`);
    }

    const novoItem = WatchlistEntry.createEntry({ idFilme: idLimpo });
    this.watchlist.push(novoItem);
  }

  removeMovieWatchlist(idFilme: string): void {
    const idLimpo = (idFilme || '').toString().trim();
    if (!idLimpo) {
      throw new Error('O ID do filme é obrigatório para remover da watchlist.');
    }

    const indice = this.watchlist.findIndex(w => w.getIdFilme() === idLimpo);
    if (indice === -1) {
      throw new Error(`O filme com ID "${idLimpo}" não está na watchlist.`);
    }

    this.watchlist.splice(indice, 1);
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  }

  static validateLogin(email: string, password: string): LoginValidationResult {
    if (!email || email.trim() === "" || !password || password.trim() === "") {
      return {
        valid: false,
        error: "Todos os campos precisam ser preenchidos"
      };
    }

    return {
      valid: true,
      error: ""
    };
  }

  static getLoginErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/user-not-found":
        return "Usuário não encontrado";
      case "auth/wrong-password":
        return "Senha incorreta";
      case "auth/invalid-email":
        return "Email inválido";
      case "auth/too-many-requests":
        return "Muitas tentativas de login. Tente novamente mais tarde";
      case "auth/invalid-credential":
        return "Email ou senha incorretos";
      default:
        return "Erro ao realizar login. Tente novamente";
    }
  }

  static validateRegister(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): RegisterValidationResult {
    const nameRegex = /^[\p{L} ]{3,20}$/u;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!name?.trim() || !email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
      return {
        valid: false,
        error: "Todos os campos precisam ser preenchidos",
      };
    }

    if (!nameRegex.test(name.trim())) {
      return {
        valid: false,
        error: "Nome deve conter de 3 a 20 caracteres, contendo apenas letras, espaços e acentos",
      };
    }

    if (!emailRegex.test(email.trim())) {
      return {
        valid: false,
        error: "Email inválido. Use um endereço com domínio válido",
      };
    }

    if (!passwordRegex.test(password)) {
      return {
        valid: false,
        error: "Senha deve ter 8 ou mais caracteres, incluir letras maiúsculas e números",
      };
    }

    if (password !== confirmPassword) {
      return {
        valid: false,
        error: "As senhas devem ser idênticas",
      };
    }

    return {
      valid: true,
      error: "",
    };
  }

  static getRegisterErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Este email já está registrado";
      case "auth/weak-password":
        return "Senha muito fraca";
      case "auth/invalid-email":
        return "Email inválido";
      default:
        return "Erro ao registrar usuário. Tente novamente";
    }
  }

  // ========== Static Authentication Methods ==========
  static async loginUser(email: string, password: string): Promise<AuthResult> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return {
        valid: true,
        error: ""
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        valid: false,
        error: User.getLoginErrorMessage(authError.code)
      };
    }
  }

  static async registerUser(
    name: string,
    email: string,
    password: string,
    favoriteGenres: string[]
  ): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        favorite_genres: favoriteGenres,
        profile_picture: '',
        pipoka: 0,
        uid: user.uid,
      });

      return {
        valid: true,
        error: "",
        uid: user.uid,
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        valid: false,
        error: User.getRegisterErrorMessage(authError.code)
      };
    }
  }

  static async fetchUserData(): Promise<User | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return null;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
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
          console.warn('Erro ao converter watchlist do Firestore:', e);
          watchlistArr = [];
        }

        return new User(
          0,
          userData.name,
          userData.email,
          userData.profile_picture,
          userData.favorite_genres,
          userData.pipoka,
          watchlistArr
        );
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return null;
    }
  }

  static createUser(payload: {
    id: number;
    name: string;
    email: string;
    password: string;
    profile_picture: string;
    favorite_genres: string[];
    pipoka: number;
  }): User {
    return new User(
      payload.id,
      payload.name,
      payload.email,
      payload.profile_picture,
      payload.favorite_genres,
      payload.pipoka
    );
  }
}
