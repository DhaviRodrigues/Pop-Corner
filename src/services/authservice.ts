import { auth, db } from "@/config/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { 
  AuthError, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  EmailAuthProvider, 
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import { UserService } from "@/services/userservice";
import { uploadUserPhoto } from '@/services/storage';

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

export interface IAuthService {
  sendVerificationEmail(email: string, code: string): Promise<boolean>;
  registerUser(name: string, email: string, password: string, favoriteGenres: string[], profilePhotoUri?: string, profilePhotoFileName?: string): Promise<AuthResult>;
  initiateRegistration(email: string, code: string): Promise<boolean>;
  loginUser(email: string, password: string): Promise<AuthResult>;
  loginUserAdmin(email: string, password: string): Promise<AuthResult>;
  getCurrentUserEmail(): string | null;
  validateLogin(email: string, password: string): Promise<{ valid: boolean; error?: string }>;
  changeCurrentUserPassword(password: string): Promise<ServiceResult>;
  resend2FACode(email: string): Promise<ServiceResult>;
  verify2FACode(email: string, typedCode: string): Promise<ServiceResult>;
  sendPasswordResetEmail(email: string): Promise<AuthServiceResult>;
  logoutUser(): Promise<void>;
}

export class AuthService {
  
  private static readonly SCRIPT_URL = process.env.EXPO_PUBLIC_SCRIPT_URL;
  private static readonly SCRIPT_URL_PASSWORD_RESET = process.env.EXPO_PUBLIC_UPDATE_PASSWORD_URL;

  public static async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    if (!AuthService.SCRIPT_URL) {
      console.error("URL do Script não configurada no .env");
      return false;
    }

    try {
      await fetch(AuthService.SCRIPT_URL, {
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
  }

  public static async registerUser(
    name: string,
    email: string,
    password: string,
    favoriteGenres: string[],
    profilePhotoUri?: string,
    profilePhotoFileName?: string
  ): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const createResult = await UserService.createUserProfile(user.uid, name, email, favoriteGenres);
      
      if (!createResult.valid) {
        try {
          await user.delete(); 
        } catch (deleteError) {
          console.error("Não foi possível reverter a criação do usuário no Auth:", deleteError);
        }
        throw new Error(createResult.error);
      }

      if (profilePhotoUri) {
        try {
          const uploadResult = await uploadUserPhoto(profilePhotoUri, 'perfil_foto', user.uid, profilePhotoFileName);
          if (uploadResult.success && uploadResult.signedUrl) {
            await updateDoc(doc(db, 'users', user.uid), { profile_picture: uploadResult.signedUrl });
          }
        } catch (photoError) {
          console.warn("Falha no upload da foto (não fatal):", photoError);
        }
      }

      return { valid: true, error: "", uid: user.uid };
    } catch (error: any) {
      console.error("Erro detalhado no registro:", error);
      return {
        valid: false,
        error: AuthService.getRegisterErrorMessage(error.code)
      };
    }
  }

  public static async initiateRegistration(email: string, code: string): Promise<boolean> {
    try {
      const cleanEmail = email.trim().toLowerCase();

      await setDoc(doc(db, "temp_codes", cleanEmail), {
        code: code,
        createdAt: serverTimestamp()
      });

      return await AuthService.sendVerificationEmail(cleanEmail, code);
    } catch (error) {
      console.error("Erro no processo de infraestrutura em initiateRegistration:", error);
      return false;
    }
  }

  public static async loginUser(email: string, password: string): Promise<AuthResult> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { valid: true, error: "" };
    } catch (error) {
      const authError = error as AuthError;
      return {
        valid: false,
        error: AuthService.getLoginErrorMessage(authError.code)
      };
    }
  }

  public static async loginUserAdmin(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        await signOut(auth);
        return { valid: false, error: 'Conta de administrador não encontrada.' };
      }

      const userData = userSnapshot.data();
      const isUserAdmin = userData?.isAdm === true || userData?.isAdmin === true;

      if (!isUserAdmin) {
        await signOut(auth);
        return { valid: false, error: 'Acesso negado. Esta conta não possui privilégios de administrador.' };
      }

      return { valid: true, error: "", uid: firebaseUser.uid };
    } catch (error) {
      const authError = error as any;
      return {
        valid: false,
        error: AuthService.getLoginErrorMessage(authError.code)
      };
    }
  }

  public static getCurrentUserEmail(): string | null {
    return auth.currentUser?.email ?? null;
  }

  public static async validateLogin(email: string, password: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { valid: false, error: "Usuário não está autenticado no momento." };
      }

      if (!email || !password) {
        return { valid: false, error: "E-mail e senha são obrigatórios para a validação." };
      }

      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);

      return { valid: true };
    } catch (error: any) {
      console.error("Erro durante a validação de senha no authservice:", error);

      let errorMessage = "Ocorreu um erro ao validar sua senha. Tente novamente.";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Senha incorreta. Por favor, verifique os dados digitados.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Muitas tentativas malsucedidas. Tente novamente mais tarde.";
      }

      return { valid: false, error: errorMessage };
    }
  }

  public static async changeCurrentUserPassword(password: string): Promise<ServiceResult> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        return { valid: false, error: "Usuário não autenticado ou sessão expirada. Faça login novamente." };
      }

      await updatePassword(currentUser, password);
      return { valid: true, error: "" };
    } catch (error: any) {
      console.error("Erro na camada de serviço ao atualizar senha:", error);
      
      if (error.code === 'auth/requires-recent-login') {
        return { valid: false, error: "Esta operação requer uma autenticação recente. Faça login novamente." };
      }
      
      return { valid: false, error: "Não foi possível atualizar a senha na base de dados. Tente novamente." };
    }
  }

  public static async resend2FACode(email: string): Promise<ServiceResult> {
    try {
      const newCode = Math.floor(10000 + Math.random() * 90000).toString(); 

      await setDoc(doc(db, "temp_codes", email.toLowerCase()), {
        code: newCode,
        createdAt: serverTimestamp()
      });
      
      const enviado = await AuthService.sendVerificationEmail(email, newCode);

      if (!enviado) {
        return { valid: false, error: "Erro ao reenviar e-mail. Tente novamente." };
      }

      return { valid: true, error: "" };
    } catch (error) {
      console.error("Erro no service ao reenviar 2FA:", error);
      return { valid: false, error: "Não foi possível processar a requisição de reenvio." };
    }
  }

  public static async verify2FACode(email: string, typedCode: string): Promise<ServiceResult> {
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

  public static async sendPasswordResetEmail(email: string): Promise<AuthServiceResult> {
    if (!AuthService.SCRIPT_URL_PASSWORD_RESET) {
      console.error("URL do Script de Redefinição de Senha não configurada no .env");
      return { success: false, message: "Configuração do aplicativo incompleta." };
    }

    try {
      const response = await fetch(AuthService.SCRIPT_URL_PASSWORD_RESET, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        redirect: 'follow',
        body: JSON.stringify({ email: email })
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

  public static async logoutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao realizar logout no authService:", error);
      throw error;
    }
  }
  
  public static getLoginErrorMessage(errorCode: string): string {
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

  public static getRegisterErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Este email já está registrado";
      case "auth/weak-password":
        return "Senha muito fraca";
      case "auth/invalid-email":
        return "Email inválido";
      default:
        return "Erro ao realizar o cadastro. Por favor, tente novamente.";
    }
  }

  public static getPasswordRecoveryErrorMessage(errorCode: string): string {
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
}