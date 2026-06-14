import { BoxDark } from "@/components/BoxDark";
import { BoxDarkSelection } from "@/components/BoxDarkSelection";
import { LogoutButton } from "@/components/LogoutButton";
import { MyCoupons } from "@/components/MyCoupons";
import BottomNavbar from "@/components/Navbar";
import { ProfileIcon } from "@/components/ProfileIcon";
import { UserPipoka } from "@/components/UserPipoka";
import { useUser } from "@/contexts/UserContext";
import { User } from '@/types/user';
import { miscStyle } from "@/styles/misc";
import { profileStyle } from "@/styles/profile";
import { textStyle } from "@/styles/text";
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { Dimensions, ScrollView, Text, View, FlatList } from "react-native";
import { MovieCard } from '@/components/MovieCard';
import { MOVIES } from '@/data/mockFilmes';
import { ButtonY } from '@/components/ButtonY';

const { height, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Profile(){
    const { user, setUser, logout } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const syncProfile = async () => {
                try {
                    const updatedUser = await User.fetchUserData();
                    if (updatedUser) {
                        setUser(updatedUser);
                    } else {
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Erro ao sincronizar perfil:", error);
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
        router.push({
            pathname: '/passwordConfirmation',
            params: { from: 'profile' }
        });
    };

    const handleLogout = async () => {
        try {
            if (user) await user.logout();
        } catch (error) {
            console.warn('Erro ao deslogar do Firebase:', error);
        } finally {
            try {
                if (logout) logout();
                setUser(null);
            } catch (e) {
                console.warn('Erro ao resetar contextos:', e);
            }
            router.replace('/');
        }
    };

    // Lista linear simples com apenas os 7 filmes mockados originais
    const movies = MOVIES.slice(0, 7).map(m => ({ id: String(m.id), image: m.image }));
    const cardSpacing = height * 0.015;

    const renderMovieCard = ({ item }: { item: { id: string; image: string } }) => (
        <View style={{ marginRight: cardSpacing }}>
            <MovieCard movie={item} />
        </View>
    );

    return(
        <View style={miscStyle.background}>
        <ScrollView showsVerticalScrollIndicator={false} 
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: height * 0.30 }}
        >
            <View style={{ alignItems: 'center', width: '100%' }}> 
                <Text style={textStyle.profileText}>Perfil de Usuário</Text>
                <ProfileIcon source={user?.getProfilePicture() ? { uri: user.getProfilePicture() } : undefined} />
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

                    <LogoutButton onPress={handleLogout} />
                </BoxDark>

                <View style={{ marginTop: height * 0.042, width: '100%', alignItems: 'center' }}>
                    <BoxDark vw={1.20} padTop={0}>
                        <Text style={[textStyle.profileName, { fontSize: height * 0.024, marginBottom: height * 0.015 }]}>
                            Watchlist
                        </Text>

                        <View style={{ width: SCREEN_WIDTH, alignSelf: 'center' }}>
                            <FlatList
                                data={movies}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                renderItem={renderMovieCard}
                                ItemSeparatorComponent={() => <View style={{ width: height * 0.025 }} />}
                                contentContainerStyle={{
                                    paddingHorizontal: cardSpacing * 2,
                                    alignItems: 'center',
                                }}
                                style={{ width: '100%' }}
                            />
                        </View>
                        <View style={{ height: height * 0.030 }} />
                    </BoxDark>
                    <View style={{ marginTop: -30, alignItems: 'center', zIndex: 10 }}>
                        <ButtonY title="Ver mais" onPress={() => {router.push('/watchlist');}} w={160} h={height * 0.055} />
                    </View>

                </View>
            </View>
        </ScrollView>
        <BottomNavbar />
    </View>
    );
}