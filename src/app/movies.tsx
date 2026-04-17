import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOVIES, Movie } from '@/data/mockFilmes';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY';
import { Input } from '@/components/Input';
import { movieStyle} from '@/styles/movie';
import { miscStyle } from '@/styles/misc';
import { textStyle } from '@/styles/text';
import { logoStyle } from '@/styles/logo';


function DynamicStars({ rating }: { rating: number }) {
  const fill1 = Math.max(0, Math.min(1, rating - 0));
  const fill2 = Math.max(0, Math.min(1, rating - 1));
  const fill3 = Math.max(0, Math.min(1, rating - 2));
  const fill4 = Math.max(0, Math.min(1, rating - 3));
  const fill5 = Math.max(0, Math.min(1, rating - 4));

  return (
    <View style={movieStyle.filmesStarsWrapper}>
      {[fill1, fill2, fill3, fill4, fill5].map((fill, index) => (
        <View key={index} style={movieStyle.filmesSingleStarContainer}>
          <Text style={movieStyle.filmesStarBackground}>★</Text>
          <View style={[movieStyle.filmesStarOverlay, { width: `${fill * 100}%` }]}>
            <Text style={movieStyle.filmesStarForeground}>★</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function MoviesScreen() {
  const router = useRouter();

  const renderMovie: ListRenderItem<Movie> = ({ item }) => (
    <View style={movieStyle.filmesCard}>
      <Image source={{ uri: item.image }} style={movieStyle.filmesPoster} resizeMode="cover" />
      
      <Text style={textStyle.filmesMovieTitle} numberOfLines={1}>{item.title}</Text>
      
      <View style={movieStyle.filmesRatingContainer}>
        {/* Ajuste: exibindo o número diretamente */}
        <Text style={movieStyle.filmesRatingLabel}>Avaliação: {item.rating.toFixed(1)}</Text>
        <DynamicStars rating={item.rating} />
      </View>
      
      <View style={movieStyle.filmesTagRow}>
        {item.tags.map((tag, index) => (
          <View key={index} style={tag === 'AÇÃO' ? movieStyle.filmesTagYellow : movieStyle.filmesTagRed}>
            <Text style={textStyle.filmesTagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={movieStyle.filmesDetailsButton}
        onPress={() => router.push({
          pathname: '/filme-details' as any,
          params: { id: item.id } 
        })}
      >
        <Text style={textStyle.filmesDetailsButtonText}>Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={movieStyle.filmesContainer}>
      <View style={movieStyle.filmesHeader}>
        <Image 
          source={require('@/screenAssets/logo/full-logo.png')}
          style={movieStyle.filmesLogo} 
        />
        
        <View style={movieStyle.filmesSearchContainer}>
          <View style={movieStyle.filmesInputWrapper}>
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
        columnWrapperStyle={movieStyle.filmesRow}
        contentContainerStyle={movieStyle.filmesListContent}
        ListFooterComponent={
          <View style={movieStyle.filmesFooterBtn}>
            <ButtonY title="Ver mais" />
          </View>
        }
      />
      <BottomNavbar />
    </SafeAreaView>
  );
}