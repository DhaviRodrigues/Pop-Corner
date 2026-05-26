import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { REVIEWS } from '@/data/mockReviews';
import { COLORS } from '@/constants/colors';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY'; 
import { ButtonB } from '@/components/ButtonB'; 
import { ButtonAddWatchlist } from '@/components/ButtonAddWatchlist';
import { Input } from '@/components/Input';
import { InfoRow } from '@/components/InfoRow';
import { ReviewItem } from '@/components/ReviewItem';
import { movieStyle } from '@/styles/movie'; 
import { textStyle } from '@/styles/text';
import { DynamicStars } from '@/components/DynamicStars';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [myReview, setMyReview] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);

  // Estados do Firebase
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Busca do Firebase
  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "filmes", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMovie({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const currentMovieReviews = useMemo(() => {
    return REVIEWS.filter(rev => String(rev.movieId) === String(id));
  }, [id]);

  const paginatedReviews = useMemo(() => {
    return currentMovieReviews.slice(0, visibleCount);
  }, [currentMovieReviews, visibleCount]);

  const renderRatingCount = (count: any) => {
    if (typeof count === 'number') return `${count} avaliações`;
    if (typeof count === 'string') return count.replace(/[()]/g, ''); // 
    return '0 avaliações';
  };

  if (loading) {
    return (
      <View style={[movieStyle.detailsMainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={movieStyle.detailsMainContainer}>
        <View style={movieStyle.detailsTopBar}>
          <Text style={textStyle.detailsTitleText}>Erro</Text>
        </View>
        <Text style={textStyle.text}>Filme não encontrado.</Text>
        <BottomNavbar />
      </View>
    );
  }

  return (
    <View style={movieStyle.detailsMainContainer}> 
      
      {/* HEADER */}
      <View style={movieStyle.detailsTopBar}>
        <Text style={textStyle.detailsTitleText}>{movie.title}</Text>
      </View>

      <Image 
        source={{ uri: movie.image }} 
        style={movieStyle.detailsBackgroundImage} 
        blurRadius={10} 
        resizeMode="cover"
      />

      <ScrollView 
        contentContainerStyle={movieStyle.detailsScrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={false} 
      >
        <View style={movieStyle.detailsPosterWrapper}>
          <Image source={{ uri: movie.image }} style={movieStyle.detailsPoster} resizeMode="cover" />
        </View>

        <View style={movieStyle.detailsContentWrapper}>
            
            {/* CARD DE NOTA */}
            <View style={movieStyle.detailsRatingCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={textStyle.detailsRatingScore}>
                  {(movie.rating || 0).toFixed(1).replace('.', ',')}
                </Text>
                
                <DynamicStars 
                  rating={movie.rating || 0} 
                  starSize={26} 
                  colorBackground="#D9D9D9" 
                  colorForeground="#FFFEB2" 
                />
              </View>

              <Text style={textStyle.detailsRatingCount}>
                ({renderRatingCount(movie.ratingCount)})
              </Text>
            </View>

            <View style={movieStyle.detailsInfoGroup}>
                <View style={movieStyle.detailsWatchlistBtnWrapper}>
                    <ButtonAddWatchlist onPress={() => console.log('Adicionou!')} />
                </View>

                <View style={movieStyle.detailsSynopsisCard}>
                  <Text style={textStyle.detailsSynopsisText}>{movie.synopsis}</Text>
                </View>

                {/* INFORMAÇÕES DO FILME */}
                <InfoRow 
                  icon="time-outline" 
                  label="Duração" 
                  value={movie.duration} 
                />

                <InfoRow 
                  icon="film-outline" 
                  label="Gêneros" 
                  value={movie.tags} 
                  isTag={true} 
                />

                <InfoRow 
                  icon="shield-checkmark-outline" 
                  label="Classificação" 
                  value={movie.classification} 
                />

                <InfoRow 
                  icon="videocam-outline" 
                  label="Diretor" 
                  value={movie.director} 
                />

                {/* NOVO ITEM: Ano de lançamento */}
                <InfoRow 
                  icon="calendar-outline" 
                  label="Ano de lançamento" 
                  value={String(movie.year || '')} 
                />
            </View>

            {/* SEÇÃO DE AVALIAÇÃO */}
            <View style={movieStyle.detailsSectionGrey}>
                <Text style={textStyle.detailsSectionTitle}>Sua Avaliação</Text>
                
                <View style={movieStyle.detailsStarsContainer}>
                    <Text style={textStyle.detailsUserStars}>☆☆☆☆☆</Text>
                </View>
                
                <Input
                  text="Escreva sua avaliação..."
                  value={myReview}
                  onChangeText={setMyReview}
                  multiline={true}
                  containerStyle={movieStyle.detailsReviewInput}
                />
                
                <View style={{ marginTop: 15, alignItems: 'center' }}>
                    <ButtonY title="Avaliar" onPress={() => console.log('Enviado!')} />
                </View>
            </View>

            {/* LISTA DE COMENTÁRIOS */}
            <View style={movieStyle.detailsSectionGrey}>
                <Text style={textStyle.detailsSectionTitle}>Comentários</Text>
                
                {currentMovieReviews.length === 0 ? (
                  <Text style={[textStyle.detailsReviewText, { textAlign: 'center' }]}>
                    Ainda não há comentários para este filme.
                  </Text>
                ) : (
                  <>
                    {/* Renderizando os comentários */}
                    {paginatedReviews.map(rev => (
                        <ReviewItem key={rev.id} review={rev} />
                    ))}
                    
                    {visibleCount < currentMovieReviews.length && (
                      <View style={{ marginTop: 10, alignItems: 'center' }}>
                        <ButtonB title="Ver mais" onPress={() => setVisibleCount(v => v + 5)} />
                      </View>
                    )}
                  </>
                )}
            </View>
        </View>
      </ScrollView>
      
      <BottomNavbar />
    </View>
  );
}