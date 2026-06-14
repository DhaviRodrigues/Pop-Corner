const SCRIPT_URL = process.env.EXPO_PUBLIC_SCRIPT_URL;;

export const sendVerificationEmail = async (email: string, code: string) => {
        if (!SCRIPT_URL) {
            console.error("URL do Script não configurada no .env");
            return false;
        }
  
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo: code })
    });
    return true;
};