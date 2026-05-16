import { Box } from "@/components/Box";
import { ButtonGenre } from "@/components/ButtonGenre";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { ValidationPopup } from "@/components/ValidationPopup";
import { useUser } from '@/contexts/UserContext';
import { useUserRegistration } from '@/contexts/UserRegistrationContext';
import { fetchUserData, registerUser } from '@/services/authentication';
import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Text, View } from "react-native";

const { height } = Dimensions.get('window');

// Array estático com os gêneros. Como não muda com frequência, fica hardcoded aqui mesmo, mas se a ideia for expandir, o ideal seria puxar do banco depois.
const genres = ['AÇÃO', 'DRAMA', 'COMÉDIA', 'TERROR', 'FICÇÃO CIENTÍFICA', 'SUSPENSE', 'ROMANCE', 'FAROESTE', 'MUSICAL'];

export default function Genre(){
    const router = useRouter();
    // Recupera os dados (nome, email, senha) que o usuário digitou nas telas anteriores do fluxo. O context evita ter que ficar passando isso por params na rota.
    const { data, resetData } = useUserRegistration();
    // Esse setUser é o que vai dizer pro app como um todo que o cara logou e quem ele é.
    const { setUser } = useUser();
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
        
        // Pega tudo que estava salvo no contexto do formulário e junta com a lista de gêneros dessa tela para bater na API do BCB inteligencia.
        const result = await registerUser(
            data.name,
            data.email,
            data.password,
            selectedGenres
        );

        if (result.valid) {
            // Se o cadastro deu bom, já fazemos o fetch pra pegar os dados da sessão/perfil desse novo usuário no banco.
            const userData = await fetchUserData();
            if (userData) {
                // Atualiza o estado global de autenticação. É provável que algum RootLayout esteja ouvindo isso pra liberar o acesso ao resto do app.
                setUser(userData);
            }

            resetData(); // Limpa a sujeira do context de registro já que acabamos de usar os dados.
            setIsLoading(false);
            router.push('/home'); // Usa o Expo Router pra jogar o usuário direto pra home após o sucesso.
            return;
        }

        // Se caiu aqui, a API retornou erro (ex: e-mail já existe). Passamos a string de erro pro popup exibir.
        setValidationMessage(result.error);
        setShowValidationPopup(true);
        setIsLoading(false);
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