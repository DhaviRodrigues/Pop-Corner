import { BoxDark } from "@/components/BoxDark";
import { BoxDarkSelection } from "@/components/BoxDarkSelection";
import { LogoutButton } from "@/components/LogoutButton";
import { MyCoupons } from "@/components/MyCoupons";
import BottomNavbar from "@/components/Navbar";
import { ProfileIcon } from "@/components/ProfileIcon";
import { UserPipoka } from "@/components/UserPipoka";
import { useUser } from "@/contexts/UserContext";
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { miscStyle } from "@/styles/misc";
import { profileStyle } from "@/styles/profile";
import { textStyle } from "@/styles/text";
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { Dimensions, ScrollView, Text, View} from "react-native";
import { fetchUserData } from "@/services/authentication";

// Pega a altura da tela pra garantir que os espaçamentos (tipo o padTop da BoxDark lá embaixo) fiquem proporcionais em qualquer celular.
const { height } = Dimensions.get('window');

export default function Profile(){
    // Traz o hook do contexto global. É daqui que a gente puxa os dados do usuário logado (nome, email) sem precisar bater na API do BCB inteligencia toda vez que abrir a tela.
    const { user, setUser, logout } = useUser();
    // Hook padrão do Expo Router pra fazer a navegação entre as telas.
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const syncProfile = async () => {
                try {
                    const updatedUser = await fetchUserData();
                    if (updatedUser) {
                        setUser(updatedUser);
                    } else {
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Erro ao sincronizar perfil com fetchUserData:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            syncProfile();
        }, [])
    );

    const handleEditProfile = () => {
        router.push('/updateProfile');
    };

    const handleChangePassword = () => {
        router.push('/passwordConfirmation');
    };

    // Faz logout no Firebase, reseta contexts e redireciona para a tela inicial
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.warn('Erro ao deslogar do Firebase:', error);
        } finally {
            // Reseta os estados do app que guardam dados de usuário
            try {
                if (logout) logout();
                setUser(null);
            } catch (e) {
                console.warn('Erro ao resetar contextos de usuário:', e);
            }

            // Navega para a tela inicial e substitui o histórico para evitar voltar à sessão anterior
            router.replace('/');
        }
    };

    return(
        <View style={miscStyle.background}>
        {/* O ScrollView é essencial aqui porque as configurações podem crescer ou a tela do celular pode ser pequena, evitando que o botão de logout fique inacessível. */}
        <ScrollView showsVerticalScrollIndicator={false} 
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: height * 0.30 }}
        >
            <View style={{ alignItems: 'center', width: '100%' }}> 
                <Text style={textStyle.profileText}>Perfil de Usuário</Text>
                <ProfileIcon/>
                <UserPipoka user={user} />
                <Text style={textStyle.profileName}>{user?.getName()}</Text>
                <Text style={[textStyle.message, { fontFamily: 'Poppins-Light' }]}>{user?.getEmail()}</Text>
                <MyCoupons/>
                <BoxDark vw={0.75} padTop={height * 0.02}>
                    <Text style={profileStyle.configTitle}>Configurações</Text>
                    <BoxDarkSelection
                        iconSource={require('@/screenAssets/icons/profile-icon.svg')}
                        title="Editar Perfil"
                        description="Alterar Nome, Gêneros Preferidos, Foto de Perfil"
                        onPress={handleEditProfile}
                    />

                    <BoxDarkSelection
                        iconSource={require('@/screenAssets/icons/password-icon.svg')}
                        title="Alterar Senha"
                        description="Melhore sua segurança"
                        onPress={handleChangePassword}
                    />

                    {/* Componente isolado de logout recebendo a função vazia temporariamente */}
                    <LogoutButton onPress={handleLogout} />
                </BoxDark>
            </View>
            </ScrollView>
                <BottomNavbar />
            </View>
    )
}