import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Dimensions, FlatList, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/UserContext';
import { BackButton } from '@/components/BackButton';
import { TitleBar } from '@/components/TitleBar';
import { DropdownY } from '@/components/DropdownY';
import { miscStyle } from '@/styles/misc';
import { COLORS } from '@/constants/colors';
import { fetchWatchlistMoviesForView, WatchlistFetchResult } from '@/services/userservice'; 

const { height, width: width } = Dimensions.get('window');

export default function WatchlistScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [watchlistMovies, setWatchlistMovies] = useState<WatchlistFetchResult[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [sortCriterion, setSortCriterion] = useState<string>('addition');

  useEffect(() => {
  const loadWatchlistData = async () => {
    if (!user?.uid) return; 

    try {
      setLoadingMovies(true);

      const moviesData = await fetchWatchlistMoviesForView(user.uid); 
      setWatchlistMovies(moviesData);
      
    } catch (error) {
      console.error("Erro ao carregar lista de filmes na View:", error);
    } finally {
      setLoadingMovies(false);
    }
  };

  loadWatchlistData();
}, [user]);

  const sortedMoviesWithAdd = useMemo(() => {
    let result = [...watchlistMovies];
    
    const favoriteGenres = (user as any)?.getGenerosFavoritos?.() || (user as any)?.favoriteGenres || [];

    result.sort((a, b) => {
      if (sortCriterion === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      
      if (sortCriterion === 'release') {
        const dateA = new Date(a.releaseDate).getTime();
        const dateB = new Date(b.releaseDate).getTime();
        return dateB - dateA;
      }

      if (sortCriterion === 'genres') {
        const matchA = a.genres.filter((g: string) => favoriteGenres.includes(g)).length;
        const matchB = b.genres.filter((g: string) => favoriteGenres.includes(g)).length;
        return matchB - matchA;
      }

      const timeA = typeof a.addedAt === 'string' ? new Date(a.addedAt).getTime() : Number(a.addedAt);
      const timeB = typeof b.addedAt === 'string' ? new Date(b.addedAt).getTime() : Number(b.addedAt);
      return timeB - timeA;
    });

    return [...result, { id: 'add-movie', image: null, isAddButton: true } as any];
  }, [watchlistMovies, sortCriterion, user]);

  const cardWidth = width * 0.42;
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
            source={require('@/screenAssets/icons/button-add.png')}
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
        <View style={{ position: 'relative', width: '100%', zIndex: 10 }}>
          <TitleBar title="Watchlist" compact />
          <View style={{ position: 'absolute', left: 10, top: Platform.OS === 'android' ? 25 : 15, width: 60 }}>
            <BackButton onPress={() => router.push('/profile')} />
          </View>
        </View>
        <View style={{ width: '100%', alignItems: 'center', paddingTop: height * 0.02, zIndex: 50 }}>
          <View style={{ 
            alignSelf: 'flex-end', 
            paddingRight: height * 0.016, 
            marginBottom: height * 0.005, 
            zIndex: 9999,
            elevation: 11
          }}>
            <DropdownY selectedValue={sortCriterion} onValueChange={setSortCriterion} />
          </View>

          {loadingMovies ? (
            <ActivityIndicator size="large" color={COLORS.gold} style={{ marginTop: height * 0.04 }} />
          ) : (
            <View style={{ width: '100%', zIndex: 1, elevation: 1 }}>
              <FlatList
                data={sortedMoviesWithAdd}
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
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}