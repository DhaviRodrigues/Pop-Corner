import { User } from './user';

export class UserAdmin extends User {
  constructor(
    id: number,
    name: string,
    email: string,
    profile_picture: string,
    favorite_genres: string[],
    pipoka: number,
    private isAdmin: boolean
  ) {
    super(id, name, email, profile_picture, favorite_genres, pipoka);
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }

  static createUserAdmin(payload: {
    id: number;
    name: string;
    email: string;
    profile_picture: string;
    favorite_genres: string[];
    pipoka: number;
    isAdmin: boolean;
  }): UserAdmin {
    return new UserAdmin(
      payload.id,
      payload.name,
      payload.email,
      payload.profile_picture,
      payload.favorite_genres,
      payload.pipoka,
      payload.isAdmin
    );
  }

  static async loginUserAdmin(email: string, password: string) {
    const { auth, db } = await import('@/config/firebase');
    const { signInWithEmailAndPassword, signOut } = await import('firebase/auth');
    const { doc, getDoc } = await import('firebase/firestore');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        await signOut(auth);
        return {
          valid: false,
          error: 'Conta de administrador não encontrada.'
        };
      }

      const userData = userSnapshot.data();

      if (!userData?.isAdmin) {
        await signOut(auth);
        return {
          valid: false,
          error: 'Acesso negado. Esta conta não possui privilégios de administrador.'
        };
      }

      return {
        valid: true,
        error: ""
      };
    } catch (error) {
      const authError = error as any;
      return {
        valid: false,
        error: User.getLoginErrorMessage(authError.code)
      };
    }
  }
}
