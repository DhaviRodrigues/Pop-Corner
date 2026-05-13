import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons'; 

import { MOVIES } from '@/data/mockFilmes';
import { REVIEWS } from '@/data/mockReviews'; // Novo Import
import { movieStyle } from '@/styles/movie';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY'; 

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const movie = MOVIES.find(m => m.id.toString() === id);
  const [myReview, setMyReview] = useState('');

  // Filtra apenas os comentários que pertencem a este filme específico
  const movieReviews = REVIEWS.filter(rev => rev.movieId.toString() === id);

  if (!movie) {
    return (
      <SafeAreaView style={movieStyle.filmesContainer}>
        <Text style={movieStyle.detailsTitleText}>Filme não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={movieStyle.filmesContainer}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Título */}
        <View style={movieStyle.detailsHeaderPill}>
          <Text style={movieStyle.detailsTitleText}>{movie.title}</Text>
        </View>

        {/* Pôster e Avaliação */}
        <View style={{ alignItems: 'center', marginBottom: 15 }}>
          <Image source={{ uri: movie.image }} style={movieStyle.detailsPoster} resizeMode="cover" />
          <View style={movieStyle.detailsRatingCard}>
            <Text style={{ color: '#FFFEB2', fontSize: 20, fontWeight: 'bold' }}>
                {movie.rating.toFixed(1)} ★★★★☆
            </Text>
            <Text style={{ color: '#FFFEB2', fontSize: 12 }}>({movie.ratingCount})</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: '10%', marginVertical: 10 }}>
          <ButtonY title="Adicionar a Watchlist" onPress={() => console.log('Adicionou!')} />
        </View>

        {/* Sinopse */}
        <View style={movieStyle.detailsSynopsisCard}>
          <Text style={{ lineHeight: 20, color: '#000', textAlign: 'justify' }}>
            {movie.synopsis}
          </Text>
        </View>

        {/* Informações Técnicas */}
        <View style={{ gap: 5 }}>
            <InfoRow icon="time-outline" label="Duração" value={movie.duration} />
            <InfoRow icon="film-outline" label="Gêneros" value={movie.tags.join(', ')} />
            <InfoRow icon="shield-checkmark-outline" label="Classificação" value={movie.classification} />
            <InfoRow icon="videocam-outline" label="Diretor" value={movie.director} />
        </View>

        {/* Formulário de Avaliação */}
        <View style={movieStyle.detailsSectionGrey}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Sua Avaliação</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 28, color: '#B22300' }}>☆☆☆☆☆</Text>
            </View>
            <TextInput 
                style={movieStyle.detailsReviewInput}
                placeholder="Escreva sua avaliação..."
                multiline
                value={myReview}
                onChangeText={setMyReview}
            />
            <View style={{ paddingHorizontal: '15%' }}>
                <ButtonY title="Avaliar" onPress={() => console.log('Avaliou!')} />
            </View>
        </View>

        {/* Listagem de Comentários (Filtrada) */}
        <View style={movieStyle.detailsSectionGrey}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginBottom: 15 }}>Comentários da Comunidade</Text>
            
            {movieReviews.length > 0 ? (
                movieReviews.map(rev => (
                    <View key={rev.id} style={movieStyle.detailsReviewItem}>
                        <View style={{ width: 45, height: 45, borderRadius: 25, backgroundColor: '#FFFEB2', marginRight: 10, borderWidth: 2, borderColor: '#2A0800', alignItems: 'center', justifyContent: 'center' }}>
                            <Feather name="star" size={20} color="#2A0800" />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{rev.user} <Text style={{ color: '#B22300' }}>{ "★".repeat(rev.rating) + "☆".repeat(5-rev.rating) }</Text></Text>
                            <Text style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{rev.comment}</Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={{ textAlign: 'center', fontSize: 12, color: '#555' }}>Nenhum comentário ainda. Seja o primeiro!</Text>
            )}
            
            <TouchableOpacity style={{ backgroundColor: '#000', paddingVertical: 12, borderRadius: 20, alignItems: 'center', marginHorizontal: '20%', marginTop: 5 }}>
                <Text style={{ color: '#FFFEB2', fontWeight: 'bold' }}>Ver mais</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
      <BottomNavbar />
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <View style={movieStyle.detailsInfoRow}>
            <Ionicons name={icon} size={24} color="#FFFEB2" />
            <Text style={movieStyle.detailsInfoText}>
                {label}: <Text style={{ fontWeight: 'normal' }}>{value}</Text>
            </Text>
        </View>
    );
}