import React from 'react';
import { View, ScrollView, Text, Dimensions, FlatList, Image, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BackButton } from '@/components/BackButton';
import { TitleBar } from '@/components/TitleBar';
import { DropdownY } from '@/components/DropdownY';
import { miscStyle } from '@/styles/misc';
import { textStyle } from '@/styles/text';
import { MOVIES } from '@/data/mockFilmes';
import { COLORS } from '@/constants/colors';

const { height, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WatchlistScreen() {
  const router = useRouter();

  const watchlistMovies = MOVIES.slice(0, 7).map(m => ({ id: String(m.id), image: m.image }));
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
          {watchlistMovies.length > 0 ? (
            <>
              <View style={{ alignSelf: 'flex-end', paddingRight: height * 0.016, marginBottom: height * 0.02 }}>
                <DropdownY />
              </View>

              <FlatList
                data={moviesWithAdd}
                numColumns={2}
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
          ) : (
            <View style={{ marginTop: height * 0.1, alignItems: 'center' }}>
              <Text style={[textStyle.message, { fontSize: height * 0.018, marginBottom: height * 0.02, color: COLORS.gold }]}>Sua watchlist está vazia</Text>
              <Text style={[textStyle.message, { fontSize: height * 0.016, color: COLORS.gold }]}>Adicione filmes para acompanhá-los depois</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
