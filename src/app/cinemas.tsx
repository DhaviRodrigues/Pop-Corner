import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "@/components/Navbar";
import CinemaCard from "@/components/CinemaCard";
import { Input } from "@/components/Input";
import { ButtonY } from "@/components/ButtonY";
import { mockCinemas } from "@/data/mockCinemas";
import { movieStyle } from "@/styles/movie";
import { style as cinemaStyle } from "@/styles/cinema";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";

export default function Cinemas() {
  const router = useRouter();

  const renderCinema = ({ item }: { item: (typeof mockCinemas)[0] }) => (
    <CinemaCard
      nome={item.nome}
      endereco={item.endereco}
      isParceiro={item.isParceiro}
      avaliacao={item.avaliacao}
      distancia={item.distancia}
      imagem={item.imagem}
      filmes={item.filmes}
    />
  );

  return (
    <SafeAreaView
      style={[
        movieStyle.filmesContainer,
        { flex: 1, backgroundColor: COLORS.primary },
      ]}
    >
      {/* Header com Logo e Busca */}
      <View style={movieStyle.filmesHeader}>
        <Image
          source={require("@/screenAssets/logo/full-logo.png")}
          style={movieStyle.filmesLogo}
        />

        <View style={movieStyle.filmesSearchContainer}>
          <View style={movieStyle.filmesInputWrapper}>
            <Input
              icon={require("@/screenAssets/icons/search.png")}
              text="Buscar um cinema"
            />
          </View>
        </View>
      </View>

      {/* Lista de Cinemas */}
      <FlatList
        data={mockCinemas}
        renderItem={renderCinema}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        // Aumente este valor. 180-200 costuma ser ideal para liberar espaço
        // acima da Navbar para botões extras no footer.
        contentContainerStyle={{ paddingBottom: 200 }}
        ListFooterComponent={
          <View
            style={{
              alignItems: "center",
              marginTop: 40,
              marginBottom: 60, // Adiciona um respiro extra no final da lista
            }}
          >
            {/* Botão Ver Mais */}
            <View style={movieStyle.filmesFooterBtn}>
              <ButtonY title="Ver mais" />
            </View>

            {/* Botão Mapa */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ marginTop: 40, alignItems: "center" }} // Aumentei o marginTop para 40
              onPress={() => router.push("/map")}
            >
              <Image
                source={require("@/screenAssets/Map-Buttom.svg")}
                style={cinemaStyle.mapButtom}
              />
              <Text
                style={{
                  color: "#FFFEB2",
                  fontSize: 12,
                  fontFamily: "Poppins-Bold",
                  marginTop: 10,
                }}
              >
                Ver Cinemas no Mapa
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      <BottomNavbar />
    </SafeAreaView>
  );
}
