import { Box } from "@/components/Box";
import { ButtonGenre } from "@/components/ButtonGenre";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { ValidationPopup } from "@/components/ValidationPopup";
import { useAuth } from '@/contexts/UserContext'; // EVOLUÇÃO: Alterado de useUser para useAuth conforme sua implementação
import { useUserRegistration } from '@/contexts/UserRegistrationContext';
import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Text, View } from "react-native";

import { registerUser } from "@/services/authservice";

const { height } = Dimensions.get('window');

const genres = ['AÇÃO', 'DRAMA', 'COMÉDIA', 'TERROR', 'FICÇÃO CIENTÍFICA', 'SUSPENSE', 'ROMANCE', 'FAROESTE', 'MUSICAL'];

export default function Genre(){
    const router = useRouter();
    // Recupera os dados (nome, email, senha) que o usuário digitou nas telas anteriores do fluxo. O context evita ter que ficar passando isso por params na rota.
    const { data, resetData } = useUserRegistration();
    const { refreshUser } = useAuth();
    
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [validationMessage, setValidationMessage] = useState("");
    const [showValidationPopup, setShowValidationPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Função que gerencia o estado das seleções.
    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev => 
            // Pega o estado anterior (prev). Se o gênero clicado já estiver lá, usa o filter pra criar um array novo sem ele (desmarca).
            // Se não estiver, usa o spread operator (...) pra copiar os que já estavam e adiciona o novo no final (marca).
            prev.includes(genre) 
                ? prev.filter(g => g !== genre) 
                : [...prev, genre]
        );
    };

    const handleContinue = async () => {
        // Validação no front-end mesmo pra poupar chamada desnecessária na API.
        if (selectedGenres.length < 2) {
            setValidationMessage("Selecione no mínimo 2 gêneros.");
            setShowValidationPopup(true);
            return;
        }

        // Ativa o loading pra travar a tela e impedir que o usuário clique 2 vezes no botão e cadastre duplicado.
        setIsLoading(true);
        
        try {
            const result = await registerUser(
                data.name,
                data.email,
                data.password,
                selectedGenres,
                data.profilePhotoUri,
                data.profilePhotoFileName
            );

            if (result.valid) {
                // Sincroniza reativamente o estado global do usuário recém-criado
                await refreshUser();

                resetData(); // Limpa o context de registro já que acabamos de usar os dados
                setIsLoading(false);
                router.push('/home');               
                return;
            }

            // Se caiu aqui, o service retornou algum erro tratado (ex: e-mail já existe).
            setValidationMessage(result.error || "Falha ao concluir o cadastro.");
            setShowValidationPopup(true);
        } catch (error) {
            console.error("Erro inesperado no fluxo de cadastro de gêneros:", error);
            setValidationMessage("Ocorreu um erro inesperado no servidor.");
            setShowValidationPopup(true);
        } finally {
            setIsLoading(false);
        }
    };

    const closeValidationPopup = () => {
        setShowValidationPopup(false);
    };

    return(
        <View style={miscStyle.background}>
            <Image source={require('@/screenAssets/logo/full-logo.png')} style={logoStyle.logoM} height={height * 1} />
            <View style={miscStyle.center}> 
                <Box vw={0.80} padTop={0}>
                    <View style={miscStyle.formContainer}>
                        <Text style={textStyle.text}>Selecione os seus gêneros favoritos</Text>
                        <View style={miscStyle.genresContainer}>
                            {/* Renderiza um botão para cada string dentro do array de genres. Passa a função de toggle e verifica se a string atual está no array de selecionados para pintar o botão. */}
                            {genres.map(genre => (
                                <ButtonGenre 
                                    key={genre}
                                    title={genre}
                                    selected={selectedGenres.includes(genre)}
                                    onToggle={() => toggleGenre(genre)}
                                />
                            ))}
                        </View>
                        <View style={{ marginTop: height * 0.03, marginBottom: height * 0.01, width: '100%' }}>
                            <Text style={textStyle.message}>*Selecione no mínimo 2 gêneros</Text>
                        </View>
                        {/* Se estiver carregando, troca o botão de Continuar por um spinner de loading. Feedback visual importante pra operações assíncronas. */}
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#FFD60A" style={{ marginVertical: height * 0.02 }} />
                        ) : (
                            <ButtonY title="Continuar" onPress={handleContinue} />
                        )}
                        <ButtonVoltar title="Voltar" onPress={() => router.push('/register')} />
                    </View>
                </Box>
            </View>
            {/* Componente isolado pra gerenciar modais/alertas. Ele fica escondido até o estado showValidationPopup virar true */}
            <ValidationPopup
                visible={showValidationPopup}
                message={validationMessage}
                onClose={closeValidationPopup}
            />
        </View>
    )
}