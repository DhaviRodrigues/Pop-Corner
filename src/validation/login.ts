export interface LoginValidationResult {
  valid: boolean;
  error: string;
}

export function validateLogin(email: string, password: string): LoginValidationResult {
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
            return "Erro ao fazer login. Tente novamente";
    }
}