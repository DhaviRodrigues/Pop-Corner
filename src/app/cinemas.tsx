import React, { useState, useMemo } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "@/components/Navbar";
import CinemaCard from "@/components/CinemaCard";
import { ButtonY } from "@/components/ButtonY";

// Importando os novos componentes de pesquisa e filtro
import SearchBar from "@/components/SearchBar";
import SortFilterBar from "@/components/SortFilterBar";

import { mockCinemas } from "@/data/mockCinemas";
import { movieStyle } from "@/styles/movie";
import { style as cinemaStyle } from "@/styles/cinema";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";

export default function Cinemas() {
  const router = useRouter();

  // ESTADOS DA PESQUISA E FILTROS
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortType, setSortType] = useState("alphabetical");
  const [sortAscending, setSortAscending] = useState(true);
  const [onlyPartners, setOnlyPartners] = useState(false); // Filtro exclusivo para Parceiros

  // Opções de ordenação para os cinemas
  const cinemaSortOptions = [
    { label: "Alfabético", value: "alphabetical" },
    { label: "Avaliação", value: "rating" },
  ];

  // LÓGICA DE FILTRAGEM INTELIGENTE
  const filteredAndSortedCinemas = useMemo(() => {
    let result = mockCinemas;

    // 1. Filtro por Texto (Nome do Cinema)
    if (searchText) {
      result = result.filter((c) =>
        c.nome.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 2. Filtro por Parceiros
    if (onlyPartners) {
      result = result.filter((c) => c.isParceiro === true);
    }

    // 3. Ordenação
    result = [...result].sort((a, b) => {
      let comp = 0;
      if (sortType === "alphabetical") {
        comp = a.nome.localeCompare(b.nome);
      } else if (sortType === "rating") {
        comp = a.avaliacao - b.avaliacao;
      }
      return sortAscending ? comp : -comp;
    });

    return result;
  }, [searchText, onlyPartners, sortType, sortAscending]);

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
      {/* Header com Logo e Nova Busca */}
      <View style={movieStyle.filmesHeader}>
        <Image
          source={require("@/screenAssets/logo/full-logo.png")}
          style={movieStyle.filmesLogo}
        />

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar um cinema"
          onToggleFilters={() => setShowFilters(!showFilters)}
          filtersVisible={showFilters}
        />
      </View>

      {/* MENU DE FILTROS FLUTUANTE (Estilo Card) */}
      {showFilters && (
        <View style={styles.filterMenuContainer}>
          <SortFilterBar
            options={cinemaSortOptions}
            activeSort={sortType}
            onSelectSort={setSortType}
            sortAscending={sortAscending}
            onToggleAscending={() => setSortAscending(!sortAscending)}
            
            // Injetando um botão extra específico para a tela de Cinemas
            extraFilters={
              <TouchableOpacity
                onPress={() => setOnlyPartners(!onlyPartners)}
                style={[
                  styles.partnerBtn,
                  onlyPartners && styles.partnerBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.partnerText,
                    onlyPartners && styles.partnerTextActive,
                  ]}
                >
                 Parceiros
                </Text>
              </TouchableOpacity>
            }
          />
        </View>
      )}

      {/* Lista de Cinemas (Agora usa os dados filtrados) */}
      <FlatList
        data={filteredAndSortedCinemas}
        renderItem={renderCinema}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
        ListFooterComponent={
          <View
            style={{
              alignItems: "center",
              marginTop: 40,
              marginBottom: 60,
            }}
          >
            {/* Botão Ver Mais */}
            <View style={movieStyle.filmesFooterBtn}>
              <ButtonY title="Ver mais" />
            </View>

            {/* Botão Mapa */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ marginTop: 40, alignItems: "center" }}
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

// Estilos locais
const styles = StyleSheet.create({
  filterMenuContainer: {
    alignSelf: "flex-end",
    justifyContent: "center",
    width: "90%",
    marginRight: "7%",
    paddingTop: 16,
    borderRadius: 16,
    borderTopRightRadius: 4,
 
    zIndex: 10, 
  },
  partnerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor:"transparent",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 3,
    borderColor: COLORS.gold,
  },
  partnerBtnActive: {
    backgroundColor: COLORS.gold,
  },
  partnerText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: "bold",
  },
  partnerTextActive: {
    color: COLORS.primaryDark,
  },
});