import React, { useState, useMemo } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "@/components/Navbar";
import CinemaCard from "@/components/CinemaCard";
import { ButtonY } from "@/components/ButtonY";
import { filterMenuStyles as styles } from '@/styles/searchbar';
import SearchBar from "@/components/SearchBar";
import SortFilterBar from "@/components/SortFilterBar";
import { mockCinemas } from "@/data/mockCinemas";
import { movieStyle } from "@/styles/movie";
import { style as cinemaStyle } from "@/styles/cinema";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";

export default function Cinemas() {
  const router = useRouter();


  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortType, setSortType] = useState("alphabetical");
  const [sortAscending, setSortAscending] = useState(true);
  const [onlyPartners, setOnlyPartners] = useState(false); 

  const cinemaSortOptions = [
    { label: "Alfabético", value: "alphabetical" },
    { label: "Avaliação", value: "rating" },
  ];

  const filteredAndSortedCinemas = useMemo(() => {
    let result = mockCinemas;

    if (searchText) {
      result = result.filter((c) =>
        c.nome.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (onlyPartners) {
      result = result.filter((c) => c.isParceiro === true);
    }

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

      {showFilters && (
        <View style={styles.filterMenuContainer}>
          <SortFilterBar
            options={cinemaSortOptions}
            activeSort={sortType}
            onSelectSort={setSortType}
            sortAscending={sortAscending}
            onToggleAscending={() => setSortAscending(!sortAscending)}
            
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

      <FlatList
        data={filteredAndSortedCinemas}
        renderItem={renderCinema}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ paddingBottom: 200 }}
        ListFooterComponent={
          <View
            style={{
              alignItems: "center",
              marginTop: 40,
              marginBottom: 60,
            }}
          >
            <View style={movieStyle.filmesFooterBtn}>
              <ButtonY title="Ver mais" />
            </View>
            
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


