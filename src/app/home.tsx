import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { COLORS } from "@/constants/colors";

import { MovieCard } from "@/components/MovieCard";
import BottomNavbar from "@/components/Navbar";
import { TitleBar } from "@/components/TitleBar";
import { miscStyle } from "@/styles/misc";
import { getHomeMovies } from "@/services/recommendationService";
import { useAuth } from "@/contexts/UserContext";

const { height } = Dimensions.get("window");

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);
  const [discoverMovies, setDiscoverMovies] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const fetchMovies = async () => {
      try {
        setLoadingMovies(true);
        const generosDoUsuario = user?.favorite_genres || user?.getGenres?.() || [];
        
        const resultado = await getHomeMovies(generosDoUsuario);
        
        if (resultado.sucesso) {
          setRecommendedMovies(resultado.recomendados);
          setDiscoverMovies(resultado.descobrir);
        } else {
          console.error(resultado.erro);
        }
      } catch (error) {
        console.error("Erro ao carregar filmes na tela Home:", error);
      } finally {
        setLoadingMovies(false);
      }
    };
    
    fetchMovies();
  }, [authLoading, user]);
  if (authLoading || loadingMovies) {
    return (
      <View style={[miscStyle.background, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <View style={miscStyle.background}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
        <TitleBar title="Seja Bem-Vindo" />
        
        {/* SEÇÃO 1: RECOMENDAÇÕES */}
        <View style={miscStyle.carouselSection}>
          <View style={miscStyle.sectionBadge}>
            <Text style={miscStyle.sectionBadgeText}>Recomendações</Text>
          </View>  
          <FlatList
            data={recommendedMovies} 
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MovieCard movie={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={miscStyle.carouselContainer}
          />
        </View>

        {/* SEÇÃO 2: DESCUBRA NOVOS FILMES */}
        <View style={miscStyle.carouselSection}>
          <View style={miscStyle.sectionBadge}>
            <Text style={miscStyle.sectionBadgeText}>Descubra novos filmes</Text>
          </View>
          <FlatList
            data={discoverMovies} 
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MovieCard movie={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={miscStyle.carouselContainer} 
          />
        </View>

        <View style={{ height: height * 0.3 }} />
      </ScrollView>
      <BottomNavbar />
    </View>
  );
}