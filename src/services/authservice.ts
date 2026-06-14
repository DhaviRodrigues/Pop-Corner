import { auth, db } from "@/config/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

import { 
  AuthError, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { createUserProfile, verifyAdmin } from "@/services/userservice";
import { uploadUserPhoto } from '@/services/storage'; // Centralizado aqui na camada de infraestrutura

export interface AuthResult {
  valid: boolean;
  error: string;
  uid?: string;
}

export interface AuthServiceResult {
  success: boolean;
  message: string;
}

export interface ServiceResult {
  valid: boolean;
  error: string;
}

const SCRIPT_URL = process.env.EXPO_PUBLIC_SCRIPT_URL;
const SCRIPT_URL_PASSWORD_RESET = process.env.EXPO_PUBLIC_UPDATE_PASSWORD_URL;

/**
 * Envia o cadastro 2FA via e-mail usando um endpoint externo
 */
export const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  if (!SCRIPT_URL) {
    console.error("URL do Script não configurada no .env");
    return false;
  }

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo: code })
    });
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail de verificação 2FA:", error);
    return false;
  }
};

export async function registerUser(
  name: string,
  email: string,
  password: string,
  favoriteGenres: string[],
  profilePhotoUri?: string,
  profilePhotoFileName?: string
): Promise<AuthResult> {
  try {
    // Cria a credencial de acesso na camada do Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Delega a criação do documento base do banco de dados para o userService
    const createResult = await createUserProfile(user.uid, name, email, favoriteGenres);
    if (!createResult.valid) {
      return {
        valid: false,
        error: createResult.error
      };
    }

    // Processa o upload da imagem de perfil se ela foi capturada no fluxo
    if (profilePhotoUri) {
      const uploadResult = await uploadUserPhoto(
        profilePhotoUri,
        'perfil_foto',
        user.uid,
        profilePhotoFileName
      );

      // Se o upload gerou uma URL assinada com sucesso, atualiza o documento no Firestore
      if (uploadResult.success && uploadResult.signedUrl) {
        await updateDoc(doc(db, 'users', user.uid), {
          profile_picture: uploadResult.signedUrl,
        });
      } else if (!uploadResult.success) {
        console.warn("Usuário criado, mas ocorreu uma falha ao subir a foto de perfil:", uploadResult.error);
      }
    }

    return {
      valid: true,
      error: "",
      uid: user.uid,
    };
  } catch (error) {
    const authError = error as AuthError;
    return {
      valid: false,
      error: getRegisterErrorMessage(authError.code)
    };
  }
}

export async function initiateRegistration(email: string, code: string): Promise<boolean> {
  try {
    const cleanEmail = email.trim().toLowerCase();

    await setDoc(doc(db, "temp_codes", cleanEmail), {
      code: code,
      createdAt: serverTimestamp()
    });

    const enviado = await sendVerificationEmail(cleanEmail, code);
    return enviado;
  } catch (error) {
    console.error("Erro no processo de infraestrutura em initiateRegistration:", error);
    return false;
  }
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

export async function loginUserAdmin(email: string, password: string): Promise<AuthResult> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      await signOut(auth);
      return {
        valid: false,
        error: 'Conta de administrador não encontrada.'
      };
    }

    const userData = userSnapshot.data();
    const isUserAdmin = userData?.isAdm === true || userData?.isAdmin === true;

    if (!isUserAdmin) {
      await signOut(auth);
      return {
        valid: false,
        error: 'Acesso negado. Esta conta não possui privilégios de administrador.'
      };
    }

    return {
      valid: true,
      error: "",
      uid: firebaseUser.uid
    };
  } catch (error) {
    const authError = error as any;
    return {
      valid: false,
      error: getLoginErrorMessage(authError.code)
    };
  }
}

export async function resend2FACode(email: string): Promise<ServiceResult> {
  try {
    const newCode = Math.floor(10000 + Math.random() * 90000).toString(); 

    await setDoc(doc(db, "temp_codes", email.toLowerCase()), {
      code: newCode,
      createdAt: serverTimestamp()
    });
    
    const enviado = await sendVerificationEmail(email, newCode);

    if (!enviado) {
      return { valid: false, error: "Erro ao reenviar e-mail. Tente novamente." };
    }

    return { valid: true, error: "" };
  } catch (error) {
    console.error("Erro no service ao reenviar 2FA:", error);
    return { valid: false, error: "Não foi possível processar a requisição de reenvio." };
  }
}

export async function verify2FACode(email: string, typedCode: string): Promise<ServiceResult> {
  try {
    const docRef = doc(db, "temp_codes", email.toLowerCase());
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return { valid: false, error: "Código não encontrado. Tente reenviar." };
    }

    const { code, createdAt } = snap.data();
    const now = Date.now();
    const createdTime = createdAt?.toMillis() || 0;

    if (code !== typedCode) {
      return { valid: false, error: "Código incorreto." };
    }

    if ((now - createdTime) >= 600000) {
      return { valid: false, error: "Este código expirou." };
    }

    return { valid: true, error: "" };
  } catch (error) {
    console.error("Erro no service ao verificar 2FA:", error);
    return { valid: false, error: "Falha de comunicação com o servidor de segurança." };
  }
}

export async function sendPasswordResetEmail(email: string): Promise<AuthServiceResult> {
  if (!SCRIPT_URL_PASSWORD_RESET) {
    console.error("URL do Script de Redefinição de Senha não configurada no .env");
    return { success: false, message: "Configuração do aplicativo incompleta." };
  }

  try {
    const response = await fetch(SCRIPT_URL_PASSWORD_RESET, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ email: email.trim() })
    });

    const result = await response.text(); 

    if (response.ok && result.toLowerCase().includes("sucesso")) {
      return { 
        success: true, 
        message: `Link de redefinição de senha enviado para ${email}. Por favor, verifique sua caixa de entrada.` 
      };
    } else {
      const errorMessage = result.includes("Erro:") 
        ? result.replace('Erro: ', '') 
        : "Falha ao enviar e-mail de redefinição de senha. Resposta inesperada do servidor.";
      
      return { success: false, message: errorMessage };
    }
  } catch (error: any) {
    console.error("Erro ao enviar solicitação de redefinição de senha no authService:", error);
    return { success: false, message: "Erro de conexão de rede ou falha no servidor." };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao realizar logout no authService:", error);
    throw error;
  }
}

export function getLoginErrorMessage(errorCode: string): string {
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

export function getRegisterErrorMessage(errorCode: string): string {
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

export function getPasswordRecoveryErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/user-not-found":
      return "Usuário com este email não encontrado";
    case "auth/invalid-email":
      return "Email inválido";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente mais tarde";
    default:
      return "Erro ao enviar email de recuperação. Tente novamente";
  }
}