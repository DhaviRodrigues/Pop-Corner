import { auth, db } from "@/config/firebase";
import { AuthError, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getLoginErrorMessage} from "@/validation/login";
import { getRegisterErrorMessage } from "@/validation/user_register";
import { User } from "@/types/user";

export interface AuthResult {
  valid: boolean;
  error: string;
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
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
      error: getLoginErrorMessage(authError.code)
    };
  }
}

export async function registerUser(
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
      error: ""
    };
  } catch (error) {
    const authError = error as AuthError;
    return {
      valid: false,
      error: getRegisterErrorMessage(authError.code)
    };
  }
}

export async function fetchUserData(): Promise<User | null> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return new User(
        0,
        userData.name,
        userData.email,
        userData.profile_picture,
        userData.favorite_genres,
        userData.pipoka
      );
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
}
