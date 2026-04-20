export type RegisterValidationResult = {
  valid: boolean;
  error: string;
};

const nameRegex = /^[\p{L} ]{3,20}$/u;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export function validateRegister(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): RegisterValidationResult {
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
      error: "Senha e confirmar senha devem ser idênticas",
    };
  }

  return {
    valid: true,
    error: "",
  };
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
