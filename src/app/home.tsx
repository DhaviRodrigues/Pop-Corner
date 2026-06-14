import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase"; 

import { MovieCard } from "@/components/MovieCard";
import BottomNavbar from "@/components/Navbar";
import { TitleBar } from "@/components/TitleBar";
import { miscStyle } from "@/styles/misc";

const { height } = Dimensions.get("window");

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Busca na coleção "filmes" 
        const q = query(collection(db, "filmes"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const moviesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMovies(moviesList);
      } catch (error) {
        console.error("Erro ao carregar filmes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <View style={[miscStyle.background, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#FFFEB2" />
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
            data={movies.slice(0, 4)} // Primeiros 4 filmes
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
            data={movies.slice(4)} // O restante dos filmes
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