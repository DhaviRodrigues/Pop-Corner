import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOVIES, Movie } from '@/data/mockFilmes';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY';
import { Input } from '@/components/Input';
import { style } from '@/styles/style'; 

function DynamicStars({ rating }: { rating: number }) {
  const fill1 = Math.max(0, Math.min(1, rating - 0));
  const fill2 = Math.max(0, Math.min(1, rating - 1));
  const fill3 = Math.max(0, Math.min(1, rating - 2));
  const fill4 = Math.max(0, Math.min(1, rating - 3));
  const fill5 = Math.max(0, Math.min(1, rating - 4));

  return (
    <View style={style.filmesStarsWrapper}>
      {[fill1, fill2, fill3, fill4, fill5].map((fill, index) => (
        <View key={index} style={style.filmesSingleStarContainer}>
          <Text style={style.filmesStarBackground}>★</Text>
          <View style={[style.filmesStarOverlay, { width: `${fill * 100}%` }]}>
            <Text style={style.filmesStarForeground}>★</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function FilmesScreen() {
  const router = useRouter();

  const renderMovie: ListRenderItem<Movie> = ({ item }) => (
    <View style={style.filmesCard}>
      <Image source={{ uri: item.image }} style={style.filmesPoster} resizeMode="cover" />
      
      <Text style={style.filmesMovieTitle} numberOfLines={1}>{item.title}</Text>
      
      <View style={style.filmesRatingContainer}>
        {/* Ajuste: exibindo o número diretamente */}
        <Text style={style.filmesRatingLabel}>Avaliação: {item.rating.toFixed(1)}</Text>
        <DynamicStars rating={item.rating} />
      </View>
      
      <View style={style.filmesTagRow}>
        {item.tags.map((tag, index) => (
          <View key={index} style={tag === 'AÇÃO' ? style.filmesTagYellow : style.filmesTagRed}>
            <Text style={style.filmesTagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={style.filmesDetailsButton}
        onPress={() => router.push({
          pathname: '/filme-details' as any,
          params: { id: item.id } 
        })}
      >
        <Text style={style.filmesDetailsButtonText}>Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={style.filmesContainer}>
      <View style={style.filmesHeader}>
        <Image 
          source={require('@/screenAssets/logo/full-logo.png')}
          style={style.filmesLogo} 
        />
        
        <View style={style.filmesSearchContainer}>
          <View style={style.filmesInputWrapper}>
             <Input 
               icon={require('@/screenAssets/icons/search.png')} 
               text="Buscar um filme" 
             />
          </View>
        </View>
      </View>

      <FlatList
        data={MOVIES}
        renderItem={renderMovie}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={style.filmesRow}
        contentContainerStyle={style.filmesListContent}
        ListFooterComponent={
          <View style={style.filmesFooterBtn}>
            <ButtonY title="Ver mais" />
          </View>
        }
      />

      <BottomNavbar />
    </SafeAreaView>
  );
}