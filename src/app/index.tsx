import { Box } from "@/components/Box";
import { ButtonB } from "@/components/ButtonB";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { ValidationPopup } from "@/components/ValidationPopup";
import { useUser } from "@/contexts/UserContext";
import { fetchUserData, loginUser } from "@/services/auth";
import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { validateLogin } from "@/validation/login";
import { Link, useRouter } from 'expo-router';
import { useState } from "react";
import { ActivityIndicator, useWindowDimensions, Image, Text, TouchableOpacity, View } from "react-native";



export default function Index(){
    const { height } = useWindowDimensions();

    // Hook do expo-router para gerenciar o redirecionamento programático após o login dar certo
    const router = useRouter();
    // Trazendo a função do contexto global para salvar as informações do usuário logado na memória do app
    const { setUser } = useUser();
    
    // Estados básicos de controle de formulário e de feedback visual
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validationMessage, setValidationMessage] = useState("");
    const [showValidationPopup, setShowValidationPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin() {
        // Validação no front-end antes de qualquer coisa para não mandar requisição inútil pra API se os campos estiverem vazios
        const validation = validateLogin(email, password);
        if (!validation.valid) {
            setValidationMessage(validation.error);
            setShowValidationPopup(true);
            return;
        }

        // Trava o botão de submit com o spinner para evitar duplo clique
        setIsLoading(true);
        const result = await loginUser(email, password);

        if (result.valid) {
            // Após validar as credenciais, é necessário buscar o resto dos dados do perfil para manter o app sincronizado
            const userData = await fetchUserData();
            if (userData) {
                setUser(userData);
            }

            setShowValidationPopup(false);
            setValidationMessage("");
            setIsLoading(false);
            
            // Redireciona direto pra tela inicial já logado
            router.push('/home');
            return;
        }

        // Se cair aqui, o login falhou na API (senha incorreta, etc). Mostra a mensagem que o backend devolveu.
        setValidationMessage(result.error);
        setShowValidationPopup(true);
        setIsLoading(false);
    }

    function closeValidationPopup() {
        setShowValidationPopup(false);
    }

    return(
        <View style={miscStyle.background}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={logoStyle.logoB}/>
            <View style={miscStyle.center}> 
                <Box vw={0.80} padTop={0}> 
                    <Image 
                        source={require('@/screenAssets/popcorn-collor.png')} 
                        style={miscStyle.popcorn}
                    />
                    <View style={miscStyle.formContainer}>
                        <Input
                            icon={require('@/screenAssets/icons/email-icon.png')}
                            text="Email:"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Input
                            icon={require('@/screenAssets/icons/password-icon.png')}
                            text="Senha:"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                        />
                        {/* A propriedade asChild no Link do Expo Router é necessária para passar o comportamento de navegação direto para o TouchableOpacity filho sem criar uma view extra que quebre o layout */}
                        <Link href="/passwordRecovery" asChild>
                            <TouchableOpacity style={miscStyle.esqueceuSenhaContainer}>
                                <Text style={textStyle.underlineText}>Esqueceu a Senha?</Text>
                            </TouchableOpacity>
                        </Link>
                        {/* Renderização condicional: exibe o loading enquanto a requisição acontece, se não, exibe o botão normal */}
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#FFD60A" style={{ marginVertical: height * 0.02 }} />
                        ) : (
                            <ButtonY title="Entrar" onPress={handleLogin} />
                        )}
                        <View style={{ marginTop: height * 0.005, marginBottom: height * 0.000, width: '100%' }}>
                            <Text style={textStyle.message}>Ainda não possui uma conta?</Text>
                        </View>
                        <ButtonB title="Cadastre-se" onPress={() => router.push('/register')} />
                    </View>
                </Box>
            </View>
            <ValidationPopup
                visible={showValidationPopup}
                message={validationMessage}
                onClose={closeValidationPopup}
            />
        </View>
    )
}