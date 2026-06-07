import { Alert } from 'react-native';

const SCRIPT_URL_PASSWORD_RESET = process.env.EXPO_PUBLIC_UPDATE_PASSWORD_URL;

export const sendPasswordResetEmail = async (email: string) => {
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
      body: JSON.stringify({ email: email })
    });

    const result = await response.text(); 
    console.log(result);

    if (response.ok && result.toLowerCase().includes("sucesso")) {
      return { 
        success: true, 
        message: "Link de redefinição de senha enviado para " + email + ". Por favor, verifique sua caixa de entrada." 
      };
    } else {
      const errorMessage = result.includes("Erro:") 
        ? result.replace('Erro: ', '') 
        : "Falha ao enviar e-mail de redefinição de senha. Resposta inesperada do servidor.";
      
      return { success: false, message: errorMessage };
    }
  } catch (error: any) {
    console.error("Erro ao enviar solicitação de redefinição de senha:", error);
    Alert.alert("Erro de Rede", "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.");
    return { success: false, message: "Erro de conexão de rede." };
  }
};