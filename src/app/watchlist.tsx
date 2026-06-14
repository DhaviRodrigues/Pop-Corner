import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, FlatList, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/UserContext';
import { BackButton } from '@/components/BackButton';
import { TitleBar } from '@/components/TitleBar';
import { DropdownY } from '@/components/DropdownY';
import { getMovieById } from '@/services/movieservice'; 
import { miscStyle } from '@/styles/misc';
import { COLORS } from '@/constants/colors';

const { height, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WatchlistScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [watchlistMovies, setWatchlistMovies] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  useEffect(() => {
    const fetchWatchlistMovies = async () => {
      setLoadingMovies(true);
      const userWatchlist = user?.getWatchlist() ?? [];

      const fetchedMovies = await Promise.all(
        userWatchlist.map(async (watchlistItem) => {
          const movieId = watchlistItem.getIdFilme();
          
          try {
            const movieDataFromService = await getMovieById(movieId);
            
            if (movieDataFromService) {
              return {
                id: movieId,
                image: movieDataFromService.image ?? null,
                title: movieDataFromService.title ?? '',
                missing: false,
              };
            }
          } catch (error) {
            console.warn(`Erro ao buscar filme ${movieId} da watchlist:`, error);
          }

          return { id: movieId, image: null, title: '', missing: true };
        })
      );

      const validMovies = fetchedMovies.filter(m => !m.missing && m.image);
      setWatchlistMovies(validMovies);
      setLoadingMovies(false);
    };

    fetchWatchlistMovies();
  }, [user]);

  const moviesWithAdd = [
    ...watchlistMovies,
    { id: 'add-movie', image: null, isAddButton: true }
  ];

  const cardWidth = SCREEN_WIDTH * 0.42;
  const cardHeight = cardWidth * 1.5;

  const renderMovieCard = ({ item }: { item: any }) => {
    if (item.isAddButton) {
      return (
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
            margin: height * 0.01,
          }}
          activeOpacity={0.8}
          onPress={() => router.push('/movies')}
        >
          <Image
            source={require('@/screenAssets/icons/button-add.svg')}
            style={{ width: height * 0.06, height: height * 0.06 }}
          />
        </TouchableOpacity>
      );
    }

    return (
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
          margin: height * 0.01,
        }}
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: '/movieDetails', params: { id: item.id } })}
      >
        <Image 
          source={{ uri: item.image }} 
          style={{ width: '100%', height: '100%' }} 
          resizeMode="cover" 
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={miscStyle.background}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: height * 0.1 }}
      >
        <View style={{ position: 'relative', width: '100%' }}>
          <TitleBar title="Watchlist" compact />
          <View style={{ position: 'absolute', left: 10, top: Platform.OS === 'android' ? 25 : 15, width: 60 }}>
            <BackButton onPress={() => router.push('/profile')} />
          </View>
        </View>

        <View style={{ width: '100%', alignItems: 'center', paddingTop: height * 0.02 }}>
          <View style={{ alignSelf: 'flex-end', paddingRight: height * 0.016, marginBottom: height * 0.02 }}>
            <DropdownY />
          </View>

          {loadingMovies ? (
            <ActivityIndicator size="large" color={COLORS.gold} style={{ marginTop: height * 0.04 }} />
          ) : (
            <>
              <FlatList
                data={moviesWithAdd}
                numColumns={2}
                key={2}
                keyExtractor={(item) => item.id}
                renderItem={renderMovieCard}
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: 'center', marginBottom: height * 0.03 }}
                contentContainerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}