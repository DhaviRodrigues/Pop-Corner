import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Dimensions, FlatList, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { BackButton } from '@/components/BackButton';
import { TitleBar } from '@/components/TitleBar';
import { DropdownY } from '@/components/DropdownY';
import { miscStyle } from '@/styles/misc';
import { textStyle } from '@/styles/text';
import { MOVIES } from '@/data/mockFilmes';
import { COLORS } from '@/constants/colors';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

const { height, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WatchlistScreen() {
  const router = useRouter();
  const { user } = useUser();
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
            const movieSnap = await getDoc(doc(db, 'filmes', movieId));
            if (movieSnap.exists()) {
              const data = movieSnap.data();
              return {
                id: movieId,
                image: data.image ?? null,
                title: data.title ?? '',
                missing: false,
              };
            }
          } catch (error) {
            console.warn('Erro ao buscar filme da watchlist:', error);
          }

          const movieData = MOVIES.find((m) => String(m.id) === movieId);
          return {
            id: movieId,
            image: movieData?.image ?? null,
            title: movieData?.title ?? '',
            missing: !movieData,
          };
        })
      );

      setWatchlistMovies(fetchedMovies);
      setLoadingMovies(false);
    };

    fetchWatchlistMovies();
  }, [user]);

  // Only include movies that resolved correctly (no missing/placeholder cards)
  const visibleMovies = watchlistMovies.filter(m => !m.missing && m.image);
  const moviesWithAdd = [
    ...visibleMovies,
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
        {item.image ? (
          <Image 
            source={{ uri: item.image }} 
            style={{ width: '100%', height: '100%' }} 
            resizeMode="cover" 
          />
        ) : (
          <View style={{
            width: '100%',
            height: '100%',
            backgroundColor: COLORS.black,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
          }}>
          </View>
        )}
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
