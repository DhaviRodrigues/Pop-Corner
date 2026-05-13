import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Importe os ícones

import { MOVIES } from '@/data/mockFilmes';
import { movieStyle } from '@/styles/movie';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY'; 

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const movie = MOVIES.find(m => m.id.toString() === id);

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
        
        {/* Header Pill */}
        <View style={movieStyle.detailsHeaderPill}>
          <Text style={movieStyle.detailsTitleText}>{movie.title}</Text>
        </View>

        {/* Pôster e Card de Avaliação sobreposto */}
        <View style={{ alignItems: 'center', marginBottom: 15 }}>
          <Image source={{ uri: movie.image }} style={movieStyle.detailsPoster} resizeMode="cover" />
          <View style={movieStyle.detailsRatingCard}>
            <Text style={{ color: '#FFFEB2', fontSize: 20, fontWeight: 'bold' }}>
                {movie.rating.toFixed(1)} ★★★★☆
            </Text>
            <Text style={{ color: '#FFFEB2', fontSize: 12 }}>(128 avaliações)</Text>
          </View>
        </View>

        {/* Botão de Watchlist */}
        <View style={{ paddingHorizontal: '10%', marginVertical: 10 }}>
          <ButtonY title="Adicionar a Watchlist" onPress={() => console.log('Adicionou!')} />
        </View>

        {/* Cards de Informações com Ícones */}
        <View style={{ gap: 5, marginTop: 15 }}>
            <InfoRow icon="time-outline" label="Duração" value="1h 45min" />
            <InfoRow icon="film-outline" label="Gêneros" value={movie.tags.join(', ')} />
            <InfoRow icon="shield-checkmark-outline" label="Classificação" value="12 anos" />
            <InfoRow icon="videocam-outline" label="Diretor" value="James Wong" />
            <InfoRow icon="calendar-outline" label="Ano de lançamento" value="2009" />
        </View>

      </ScrollView>
      <BottomNavbar />
    </SafeAreaView>
  );
}

// Componente auxiliar para as linhas de informação
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