import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOVIES, Movie } from '@/data/mockFilmes';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY';
import { Input } from '@/components/Input';

function DynamicStars({ rating }: { rating: string }) {
  const numRating = parseFloat(rating.replace(',', '.'));

  const fill1 = Math.max(0, Math.min(1, numRating - 0));
  const fill2 = Math.max(0, Math.min(1, numRating - 1));
  const fill3 = Math.max(0, Math.min(1, numRating - 2));
  const fill4 = Math.max(0, Math.min(1, numRating - 3));
  const fill5 = Math.max(0, Math.min(1, numRating - 4));

  return (
    <View style={styles.starsWrapper}>
      {/* Estrela 1 */}
      <View style={styles.singleStarContainer}>
        <Text style={styles.starBackground}>★</Text>
        <View style={[styles.starOverlay, { width: `${fill1 * 100}%` }]}>
          <Text style={styles.starForeground}>★</Text>
        </View>
      </View>

      {/* Estrela 2 */}
      <View style={styles.singleStarContainer}>
        <Text style={styles.starBackground}>★</Text>
        <View style={[styles.starOverlay, { width: `${fill2 * 100}%` }]}>
          <Text style={styles.starForeground}>★</Text>
        </View>
      </View>

      {/* Estrela 3 */}
      <View style={styles.singleStarContainer}>
        <Text style={styles.starBackground}>★</Text>
        <View style={[styles.starOverlay, { width: `${fill3 * 100}%` }]}>
          <Text style={styles.starForeground}>★</Text>
        </View>
      </View>

      {/* Estrela 4 */}
      <View style={styles.singleStarContainer}>
        <Text style={styles.starBackground}>★</Text>
        <View style={[styles.starOverlay, { width: `${fill4 * 100}%` }]}>
          <Text style={styles.starForeground}>★</Text>
        </View>
      </View>

      {/* Estrela 5 */}
      <View style={styles.singleStarContainer}>
        <Text style={styles.starBackground}>★</Text>
        <View style={[styles.starOverlay, { width: `${fill5 * 100}%` }]}>
          <Text style={styles.starForeground}>★</Text>
        </View>
      </View>
    </View>
  );
}

export default function FilmesScreen() {
  const router = useRouter();

  const renderMovie: ListRenderItem<Movie> = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.poster} resizeMode="cover" />
      
      <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
      
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Avaliação: {item.rating}</Text>
        <DynamicStars rating={item.rating} />
      </View>
      
      <View style={styles.tagRow}>
        {item.tags.map((tag, index) => (
          <View key={index} style={tag === 'AÇÃO' ? styles.tagYellow : styles.tagRed}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.detailsButton}
        onPress={() => router.push({
          pathname: '/filme-details' as any,
          params: { id: item.id }
        })}
      >
        <Text style={styles.detailsButtonText}>Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('@/screenAssets/logo/full-logo.png')}
          style={styles.logo} 
        />
        
        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
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
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.footerBtn}>
            <ButtonY title="Ver mais" />
          </View>
        }
      />

      <BottomNavbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#B22300' // Fundo principal da tela
  },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    alignItems: 'center' 
  },
  logo: { 
    width: 160, 
    height: 60, 
    resizeMode: 'contain', 
    marginBottom: 15 
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    marginBottom: 10 
  },
  inputWrapper: { 
    flex: 1, 
  },
  listContent: { 
    paddingHorizontal: 15, 
    paddingBottom: 180 
  },
  row: { 
    justifyContent: 'space-between' 
  },
  card: { 
    backgroundColor: '#2A0800', 
    width: '48%', 
    borderRadius: 15, 
    padding: 8, 
    marginVertical: 10, 
    borderWidth: 4, 
    borderColor: '#FE481B',
    alignItems: 'center' 
  },
  poster: { 
    width: '100%', 
    height: 200, 
    borderRadius: 10 
  },
  movieTitle: { 
    color: '#FFFEB2', 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginTop: 10,
    textAlign: 'center'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ratingLabel: { 
    color: '#FFFEB2', 
    fontSize: 9, 
    fontWeight: 'bold' 
  },
  tagRow: { 
    flexDirection: 'row', 
    gap: 5, 
    marginBottom: 10 
  },
  tagYellow: { 
    backgroundColor: '#FFFEB2', 
    borderRadius: 16, 
    paddingHorizontal: 10, 
    paddingVertical: 3 
  },
  tagRed: { 
    backgroundColor: '#B22300', 
    borderRadius: 16, 
    paddingHorizontal: 10, 
    paddingVertical: 3 
  },
  tagText: { 
    fontSize: 8, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  detailsButton: { 
    backgroundColor: '#B22300', 
    width: '60%', 
    paddingVertical: 8, 
    borderRadius: 10 
  },
  detailsButtonText: { 
    color: '#FFFEB2', 
    textAlign: 'center', 
    fontSize: 11, 
    fontWeight: 'bold' 
  },
  footerBtn: { 
    alignItems: 'center', 
    marginVertical: 20 
  },
  starsWrapper: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginLeft: 3,
    gap: 1, 
  },
  singleStarContainer: {
    position: 'relative',
  },
  starBackground: {
    color: '#4A2010', 
    fontSize: 11, 
  },
  starOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden', 
  },
  starForeground: {
    color: '#FFFEB2', 
    fontSize: 11,
  },
});