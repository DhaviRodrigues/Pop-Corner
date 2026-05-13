import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOVIES } from '@/data/mockFilmes';
import { movieStyle } from '@/styles/movie';
import BottomNavbar from '@/components/Navbar';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const movie = MOVIES.find(m => m.id.toString() === id);

  return (
    <SafeAreaView style={movieStyle.filmesContainer}>
      <ScrollView>
        <View style={movieStyle.detailsHeaderPill}>
          <Text style={movieStyle.detailsTitleText}>{movie?.title || "Carregando..."}</Text>
        </View>
        <Text style={{color: '#FFF', textAlign: 'center'}}>Tela de detalhes conectada!</Text>
      </ScrollView>
      <BottomNavbar />
    </SafeAreaView>
  );
}