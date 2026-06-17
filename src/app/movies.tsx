import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY';
import SearchBar from '@/components/SearchBar';
import SortFilterBar from '@/components/SortFilterBar';
import GenreFilter from '@/components/GenreFilter';
import { AdminAddButton } from '@/components/AdminAddButton'; 
import { movieStyle } from '@/styles/movie';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/contexts/UserContext';
import { MovieService } from '@/services/movieservice';

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
  const { user, isAdmin } = useAuth();
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortType, setSortType] = useState('alphabetical');
  const [sortAscending, setSortAscending] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const isYellow = (tagName: string) => ['AÇÃO', 'FANTASIA', 'FICÇÃO'].includes(tagName.toUpperCase());

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await MovieService.getAllMovies();
        if (data) {
          setMoviesList(data);
        }
      } catch (error) {
        console.error("Erro ao carregar filmes na View:", error);
      }
    };

    fetchMovies();
  }, []);

  const availableGenres = useMemo(() => {
    const allTags = moviesList.flatMap(movie => movie.tags || []);
    return Array.from(new Set(allTags));
  }, [moviesList]);

  const movieSortOptions = [
    { label: 'Alfabético', value: 'alphabetical' },
    { label: 'Nota', value: 'rating' },
  ];

  const filteredAndSortedMovies = useMemo(() => {
    let result = moviesList;

    if (searchText) {
      result = result.filter(m => {
        const titulo = m.titulo || m.title || '';
        return titulo.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (selectedGenres.length > 0) {
      result = result.filter(m => {
        const tags = m.tags || [];
        return tags.some((tag: string) => selectedGenres.includes(tag));
      });
    }

    result = [...result].sort((a, b) => {
      let comp = 0;
      if (sortType === 'alphabetical') {
        const tituloA = a.titulo || a.title || '';
        const tituloB = b.titulo || b.title || '';
        comp = tituloA.localeCompare(tituloB);
      } else if (sortType === 'rating') {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        comp = ratingA - ratingB;
      }
      return sortAscending ? comp : -comp;
    });

    return result;
  }, [moviesList, searchText, selectedGenres, sortType, sortAscending]);

  const paginatedMovies = useMemo(() => {
    return filteredAndSortedMovies.slice(0, visibleCount);
  }, [filteredAndSortedMovies, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
    setVisibleCount(10); 
  };

  const renderMovie: ListRenderItem<any> = ({ item }) => {
    const titulo = item.titulo || item.title || 'Sem Título';
    const imagemUrl = item.url_imagem || item.image;
    const rating = item.rating || 0;
    const tags = item.tags || [];

    return (
      <View style={movieStyle.filmesCard}>
        <Image source={{ uri: imagemUrl }} style={movieStyle.filmesPoster} resizeMode="cover" />
        
        <Text style={movieStyle.filmesMovieTitle} numberOfLines={1}>{titulo}</Text>
        
        <View style={movieStyle.filmesRatingContainer}>
          <Text style={movieStyle.filmesRatingLabel}>Avaliação: {rating.toFixed(1)}</Text>
          <DynamicStars rating={rating} />
        </View>
        
        <View style={movieStyle.filmesTagRow}>
          {tags.map((tag: string, index: number) => (
            <View 
              key={index} 
              style={isYellow(tag) ? movieStyle.filmesTagYellow : movieStyle.filmesTagRed}
            >
              <Text style={[
                movieStyle.filmesTagText, 
                isYellow(tag) ? movieStyle.filmesTagYellowText : movieStyle.filmesTagRedText
              ]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={movieStyle.filmesDetailsButton}
          onPress={() => router.push({
            pathname: '/movieDetails' as any,
            params: { id: item.id } 
          })}
        >
          <Text style={movieStyle.filmesDetailsButtonText}>Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[movieStyle.filmesContainer, { flex: 1, backgroundColor: COLORS.primary }]}>
      
      {/* Botão de Admin solto. Ele é 'absolute' e vai se posicionar sozinho no topo direito da tela */}
      {isAdmin && <AdminAddButton onPress={() => router.push("/addMovie")} />}

      {/* HEADER LIMPO E CENTRALIZADO */}
      <View style={{ paddingHorizontal: "5%", paddingTop: 30 }}>
        <View style={{ alignItems: 'center', width: '100%', marginBottom: 15 }}>
          <Image 
            source={require('@/screenAssets/logo/full-logo.png')}
            style={[movieStyle.filmesLogo, { marginBottom: 0 }]} 
          />
        </View>
      
        <View style={[movieStyle.filmesSearchContainer, { marginVertical: 0 }]}>
           <SearchBar 
             value={searchText} 
             onChangeText={(txt) => { setSearchText(txt); setVisibleCount(10); }} 
             placeholder="Buscar um filme" 
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
            onSelectSort={(val) => { setSortType(val); setVisibleCount(10); }}
            sortAscending={sortAscending}
            onToggleAscending={() => { setSortAscending(!sortAscending); setVisibleCount(10); }}
          />
          <GenreFilter 
            availableGenres={availableGenres}
            selectedGenres={selectedGenres}
            onToggleGenre={toggleGenre}
          />
        </View>
      )}

      <FlatList
        data={paginatedMovies} 
        renderItem={renderMovie}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={movieStyle.filmesRow}
        contentContainerStyle={[movieStyle.filmesListContent, { paddingTop: 15, paddingBottom: 150 }]}
        bounces={false}
        overScrollMode="never"
        ListFooterComponent={
          visibleCount < filteredAndSortedMovies.length ? (
            <View style={movieStyle.filmesFooterBtn}>
              <ButtonY title="Ver mais" onPress={handleLoadMore} />
            </View>
          ) : (
            <View style={{ height: 40 }} /> 
          )
        }
      />
      
      <BottomNavbar />
    </View>
  );
}