import { User } from './user';
import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  verifyAdmin, 
  fetchAllAdminsService, 
  addAdminService, 
  removeAdminService,
  AdminUserResult 
} from '@/services/userservice';

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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      const adminVerification = await verifyAdmin();

      if (!adminVerification.valid || !adminVerification.isAdmin) {
        await signOut(auth);
        return { 
          valid: false, 
          error: adminVerification.error || 'Acesso negado. Esta conta não possui privilégios de administrador.' 
        };
      }

      return { valid: true, error: "" };
    } catch (error: any) {
      return { valid: false, error: User.getLoginErrorMessage(error.code) };
    }
  }

  static async checkIsAdmin(): Promise<boolean> {
    const result = await verifyAdmin();
    return result.isAdmin;
  }

  static async fetchAllAdmins(): Promise<AdminUserResult[]> {
    return await fetchAllAdminsService();
  }

  static async addAdmin(email: string): Promise<void> {
    const cleanEmail = email?.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      throw new Error("Por favor, insira um e-mail.");
    }

    if (!emailRegex.test(cleanEmail)) {
      throw new Error("O formato do e-mail é inválido.");
    }
    await addAdminService(cleanEmail);
  }

  static async removeAdmin(targetUserId: string, targetUserEmail: string, currentUserEmail?: string): Promise<void> {
    
    if (targetUserEmail === currentUserEmail) {
      throw new Error("Ação bloqueada: Você não pode remover seus próprios privilégios de administrador.");
    }

    if (!targetUserId) {
      throw new Error("ID do usuário é obrigatório para remoção.");
    }
    
    await removeAdminService(targetUserId);
  }
}