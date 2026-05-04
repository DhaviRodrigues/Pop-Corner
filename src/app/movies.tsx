import React, { useState, useMemo } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOVIES, Movie } from '@/data/mockFilmes';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY';

// Importando os novos componentes de filtro
import SearchBar from '@/components/SearchBar';
import SortFilterBar from '@/components/SortFilterBar';
import GenreFilter from '@/components/GenreFilter';

import { movieStyle } from '@/styles/movie';
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

  // 1. ESTADOS DA PESQUISA E FILTROS
  const [searchText, setSearchText] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortType, setSortType] = useState('alphabetical');
  const [sortAscending, setSortAscending] = useState(true);
  
  // ---> NOVO ESTADO: Controla a visibilidade dos filtros <---
  const [showFilters, setShowFilters] = useState(false);

  // Extrai dinamicamente todos os gêneros (tags) únicos do seu mock de filmes
  const availableGenres = useMemo(() => {
    const allTags = MOVIES.flatMap(movie => movie.tags);
    return Array.from(new Set(allTags));
  }, []);

  const movieSortOptions = [
    { label: 'Alfabético', value: 'alphabetical' },
    { label: 'Nota', value: 'rating' },
  ];

  // 2. LÓGICA DE FILTRAGEM (useMemo para performance)
  const filteredAndSortedMovies = useMemo(() => {
    let result = MOVIES;

    // Filtro de Texto
    if (searchText) {
      result = result.filter(m => 
        m.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtro de Gêneros
    if (selectedGenres.length > 0) {
      result = result.filter(m => 
        m.tags.some(tag => selectedGenres.includes(tag))
      );
    }

    // Ordenação
    result = [...result].sort((a, b) => {
      let comp = 0;
      if (sortType === 'alphabetical') {
        comp = a.title.localeCompare(b.title);
      } else if (sortType === 'rating') {
        comp = a.rating - b.rating;
      }
      return sortAscending ? comp : -comp;
    });

    return result;
  }, [searchText, selectedGenres, sortType, sortAscending]);

  // Função para marcar/desmarcar um gênero
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const renderMovie: ListRenderItem<Movie> = ({ item }) => (
    <View style={movieStyle.filmesCard}>
      <Image source={{ uri: item.image }} style={movieStyle.filmesPoster} resizeMode="cover" />
      
      <Text style={textStyle.filmesMovieTitle} numberOfLines={1}>{item.title}</Text>
      
      <View style={movieStyle.filmesRatingContainer}>
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
           <SearchBar 
             value={searchText} 
             onChangeText={setSearchText} 
             placeholder="Buscar um filme" 
             // ---> NOVAS PROPRIEDADES DA BARRA DE PESQUISA <---
             onToggleFilters={() => setShowFilters(!showFilters)}
             filtersVisible={showFilters}
           />
        </View>
      </View>

      {showFilters && (
        <View style={{ paddingHorizontal: 16 }}>
          <SortFilterBar 
            options={movieSortOptions}
            activeSort={sortType}
            onSelectSort={setSortType}
            sortAscending={sortAscending}
            onToggleAscending={() => setSortAscending(!sortAscending)}
          />
          
          <GenreFilter 
            availableGenres={availableGenres}
            selectedGenres={selectedGenres}
            onToggleGenre={toggleGenre}
          />
        </View>
      )}

      <FlatList
        data={filteredAndSortedMovies}
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