import { User } from './user';

export class UserAdmin extends User {
  private isAdmin: boolean;

  constructor(
    id: number,
    name: string,
    email: string,
    profile_picture: string,
    favorite_genres: string[],
    pipoka: number,
    isAdmin: boolean
  ) {
    super(id, name, email, profile_picture, favorite_genres, pipoka);
    this.isAdmin = isAdmin;
  }

  public getIsAdmin(): boolean {
    return this.isAdmin;
  }

  public static createUserAdmin(payload: {
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

  /**
   * Validação de Regra de Negócio de Domínio para adicionar admin
   */
  public static validateAdminEmail(email: string): string {
    const cleanEmail = email?.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      throw new Error("Por favor, insira um e-mail.");
    }

    if (!emailRegex.test(cleanEmail)) {
      throw new Error("O formato do e-mail é inválido.");
    }

    return cleanEmail;
  }

  /**
   * Validação de Regra de Negócio de Domínio para remover admin
   */
  public static validateAdminRemoval(targetUserId: string, targetUserEmail: string, currentUserEmail?: string): void {
    if (targetUserEmail === currentUserEmail) {
      throw new Error("Ação bloqueada: Você não pode remover seus próprios privilégios de administrador.");
    }

    if (!targetUserId) {
      throw new Error("ID do usuário é obrigatório para remoção.");
    }
  }
}