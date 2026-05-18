import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons'; 
import { MOVIES } from '@/data/mockFilmes';
import { REVIEWS } from '@/data/mockReviews';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY'; 
import { ButtonB } from '@/components/ButtonB'; 
import { ButtonAddWatchlist } from '@/components/ButtonAddWatchlist';
import { Input } from '@/components/Input';
import { movieStyle } from '@/styles/movie'; 
import { textStyle } from '@/styles/text';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const movie = MOVIES.find(m => m.id.toString() === id);
  const [myReview, setMyReview] = useState('');

  const currentMovieReviews = REVIEWS.filter(rev => rev.movieId.toString() === id);

  if (!movie) {
    return (
      <SafeAreaView style={movieStyle.filmesContainer}>
        <Text style={textStyle.detailsTitleText}>Filme não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={movieStyle.detailsMainContainer} edges={['top', 'left', 'right']}> 
      
      {/* 1. HEADER FIXO */}
      <View style={movieStyle.detailsTopBar}>
        <Text style={textStyle.detailsTitleText}>{movie.title}</Text>
      </View>

      {/* 2. IMAGEM DE FUNDO */}
      <Image 
        source={{ uri: movie.image }} 
        style={movieStyle.detailsBackgroundImage} 
        blurRadius={10} 
        resizeMode="cover"
      />

      {/* 3. CONTEÚDO ROLÁVEL */}
      <ScrollView contentContainerStyle={movieStyle.detailsScrollContent} showsVerticalScrollIndicator={false}>
        
        {/* PÔSTER CENTRALIZADO */}
        <View style={movieStyle.detailsPosterWrapper}>
          <Image 
            source={{ uri: movie.image }} 
            style={movieStyle.detailsPoster} 
            resizeMode="cover" 
          />
        </View>

        {/* 4. WRAPPER DE CONTEÚDO SÓLIDO */}
        <View style={movieStyle.detailsContentWrapper}>
            
            {/* PÍLULA DE AVALIAÇÃO GERAL */}
            <View style={movieStyle.detailsRatingCard}>
              <Text style={textStyle.detailsRatingScore}>
                  {movie.rating.toFixed(1).replace('.', ',')} ★★★★★
              </Text>
              <Text style={textStyle.detailsRatingCount}>({movie.ratingCount} avaliações)</Text>
            </View>

            <View style={movieStyle.detailsInfoGroup}>
                
                {/* BOTÃO ADD WATCHLIST */}
                <View style={movieStyle.detailsWatchlistBtnWrapper}>
                    <ButtonAddWatchlist onPress={() => console.log('Adicionou!')} />
                </View>

                {/* SINOPSE */}
                <View style={movieStyle.detailsSynopsisCard}>
                  <Text style={textStyle.detailsSynopsisText}>
                    {movie.synopsis}
                  </Text>
                </View>

                {/* INFORMAÇÕES TÉCNICAS */}
                <InfoRow icon="time-outline" label="Duração" value={movie.duration} />
                <InfoRow icon="film-outline" label="Gêneros" value={movie.tags.join(', ')} />
                <InfoRow icon="shield-checkmark-outline" label="Classificação" value={movie.classification} />
                <InfoRow icon="videocam-outline" label="Diretor" value={movie.director} />
                <InfoRow icon="calendar-outline" label="Ano de lançamento" value="2009" />
            </View>

            {/* SEÇÃO DE AVALIAÇÃO DO USUÁRIO */}
            <View style={movieStyle.detailsSectionGrey}>
                <Text style={textStyle.detailsSectionTitle}>Avaliação</Text>
                
                <View style={movieStyle.detailsStarsContainer}>
                    <Text style={textStyle.detailsUserStars}>☆☆☆☆☆</Text>
                </View>
                
                {/* NOSSO COMPONENTE INPUT TURBINADO AQUI */}
                <Input 
                    text="Escreva sua avaliação..."
                    value={myReview}
                    onChangeText={setMyReview}
                    multiline={true}
                    containerStyle={movieStyle.detailsReviewInput}
                />
                
                <View style={movieStyle.detailsButtonWrapper}>
                    <ButtonY title="Avaliar" onPress={() => console.log('Avaliou!')} />
                </View>
            </View>

            {/* SEÇÃO DE COMENTÁRIOS DA COMUNIDADE */}
            <View style={movieStyle.detailsSectionGrey}>
                <Text style={textStyle.detailsSectionTitle}>Comentários e Avaliações</Text>
                
                {currentMovieReviews.map(rev => (
                    <View key={rev.id} style={movieStyle.detailsReviewItem}>
                        <View style={movieStyle.detailsReviewAvatar}>
                            <Feather name="star" size={24} color="#2A0800" />
                        </View>
                        <View style={movieStyle.detailsReviewContent}>
                            <Text style={textStyle.detailsReviewUser}>
                              {rev.user} <Text style={textStyle.detailsReviewStars}>
                                {'★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating)}
                              </Text>
                            </Text>
                            <Text style={textStyle.detailsReviewText} numberOfLines={3}>
                              {rev.comment}
                            </Text>
                        </View>
                    </View>
                ))}
                
                <View style={movieStyle.detailsViewMoreWrapper}>
                  <ButtonB title="Ver mais" onPress={() => console.log('Ver mais')} />
                </View>
            </View>

        </View>
      </ScrollView>
      
      {/* NAVBAR */}
      <BottomNavbar />
    </SafeAreaView>
  );
}

// SUBCONPONENTE INFO ROW
function InfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <View style={movieStyle.detailsInfoRow}>
            <Ionicons name={icon} size={20} color="#FFFEB2" />
            <Text style={textStyle.detailsInfoLabel} numberOfLines={1}>
                {label}: <Text style={textStyle.detailsInfoValue}>{value}</Text>
            </Text>
        </View>
    );
}