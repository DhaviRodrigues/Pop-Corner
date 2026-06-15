import React, { useState, useCallback } from 'react';
import { Dimensions, ScrollView, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from 'expo-router';
import { BoxDark } from "@/components/BoxDark";
import { BoxDarkSelection } from "@/components/BoxDarkSelection";
import { LogoutButton } from "@/components/LogoutButton";
import { MyCoupons } from "@/components/MyCoupons";
import BottomNavbar from "@/components/Navbar";
import { ProfileIcon } from "@/components/ProfileIcon";
import { UserPipoka } from "@/components/UserPipoka";
import { MovieCard } from '@/components/MovieCard';
import { ButtonY } from '@/components/ButtonY';
import { useAuth } from "@/contexts/UserContext";
import { fetchUserData, fetchWatchlistMoviesForView, WatchlistFetchResult } from '@/services/userservice';
import { miscStyle } from "@/styles/misc";
import { profileStyle } from "@/styles/profile";
import { textStyle } from "@/styles/text";
import { COLORS } from '@/constants/colors';

const { height, width: SCREEN_WIDTH } = Dimensions.get('window');
const cardWidth = SCREEN_WIDTH * 0.42;
const cardHeight = cardWidth * 1.5;

interface ProfileMovie {
    id: string;
    image: string;
}

const cardSpacing = height * 0.015;

export default function Profile() {
    const { user, setUser, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [recentMovies, setRecentMovies] = useState<ProfileMovie[]>([]);

    useFocusEffect(
        useCallback(() => {
            if (authLoading) return;

            const syncProfileAndWatchlist = async () => {
                try {
                    const updatedUser = await fetchUserData();
                    if (updatedUser) {
                        setUser(updatedUser);
                        
                        const userId = (updatedUser as any).id || (updatedUser as any).uid;
                        const fetchedMovies = await fetchWatchlistMoviesForView(userId);
                        
                        // Filtra nulos e garante que a imagem seja tratada como string
                        const validMovies = fetchedMovies
                            .filter((m): m is (WatchlistFetchResult & { image: string }) => m.image !== null)
                            .map(m => ({ 
                                id: m.id, 
                                image: m.image
                            }));
                                        
                        setRecentMovies(validMovies);
                    } else {
                        setUser(null);
                        setRecentMovies([]);
                    }
                } catch (error) {
                    console.error("Erro ao sincronizar perfil:", error);
                } finally {
                    setIsLoading(false);
                }
            };

        syncProfileAndWatchlist();
    }, [authLoading])
);

    const handleEditProfile = () => router.push('/updateProfile');
    const handleChangePassword = () => router.push({ pathname: '/passwordConfirmation', params: { from: 'profile' } });

    const handleLogout = async () => {
        try {
            if (user && logout) await logout();
        } catch (error) {
            console.warn('Erro ao deslogar:', error);
        } finally {
            if (setUser) setUser(null);
            router.replace('/');
        }
    };

    const renderMovieCard = ({ item }: { item: any }) => <MovieCard movie={item} />;
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
                <MyCoupons onPress={() => router.push('/userCoupons')}/>
                
                <BoxDark vw={0.75} padTop={height * 0.02}>
                    <Text style={profileStyle.configTitle}>Configurações</Text>
                    <BoxDarkSelection
                        iconSource={require('@/screenAssets/icons/profile-icon.png')}
                        title="Editar Perfil"
                        description="Alterar Nome, Gêneros Preferidos, Foto de Perfil"
                        onPress={handleEditProfile}
                    />

                    <BoxDarkSelection
                        iconSource={require('@/screenAssets/icons/password-icon.png')}
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

                        <View style={{ width: SCREEN_WIDTH, alignSelf: 'center', minHeight: height * 0.15, justifyContent: 'center', alignItems: 'center' }}>
                            {isLoading ? (
                                <ActivityIndicator size="small" color={COLORS.gold} />
                            ) : recentMovies.length === 0 ? (
                                <View style={{ alignItems: 'center', paddingHorizontal: height * 0.02 }}>
                                    <Text style={[textStyle.profileName, { 
                                        fontSize: height * 0.018, 
                                        marginBottom: height * 0.02, 
                                        textAlign: 'center',
                                        width: SCREEN_WIDTH * 0.75 
                                    }]}>
                                        Descubra e salve novos filmes na sua watchlist
                                    </Text>
                                    
                                    <TouchableOpacity 
                                        style={{
                                            width: cardWidth,
                                            height: cardHeight,
                                            borderWidth: height * 0.006,
                                            borderColor: COLORS.gold,
                                            borderRadius: height * 0.012,
                                            backgroundColor: 'transparent',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            overflow: 'hidden',
                                        }}
                                        activeOpacity={0.8}
                                        onPress={() => router.push('/movies')}
                                    >
                                        <Image
                                            source={require('@/screenAssets/icons/button-add.png')}
                                            style={{ width: height * 0.06, height: height * 0.06 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <FlatList
                                    data={recentMovies}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderMovieCard}
                                    ItemSeparatorComponent={() => <View style={{ width: height * 0.035 }} />}
                                    contentContainerStyle={{
                                        paddingHorizontal: cardSpacing * 2,
                                        alignItems: 'center',
                                        flexGrow: 1,
                                        justifyContent: recentMovies.length === 1 ? 'center' : 'flex-start',
                                    }}
                                    style={{ width: '100%' }}
                                />
                            )}
                        </View>
                        <View style={{ height: height * 0.030 }} />
                    </BoxDark>
                    
                    {recentMovies.length > 0 && (
                        <View style={{ marginTop: -30, alignItems: 'center', zIndex: 10 }}>
                            <ButtonY title="Ver mais" onPress={() => {router.push('/watchlist');}} w={160} h={height * 0.055} />
                        </View>
                    )}
                </View>

            </View>
        </ScrollView>
        <BottomNavbar />
    </View>
    );
}