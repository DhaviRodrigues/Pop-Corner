import React, { useState, useMemo, useEffect } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "@/components/Navbar";
import CinemaCard from "@/components/CinemaCard";
import { ButtonY } from "@/components/ButtonY";
import { filterMenuStyles as styles } from '@/styles/searchbar';
import SearchBar from "@/components/SearchBar";
import SortFilterBar from "@/components/SortFilterBar";
import { movieStyle } from "@/styles/movie";
import { style as cinemaStyle } from "@/styles/cinema";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function Cinemas() {
  const router = useRouter();

  const { user } = useUser();

  console.log("DADOS DO USUÁRIO NO CONTEXTO:", user);

  const isAdmin = user 
    ? (
       
        (typeof (user as any).getIsAdmin === 'function' && (user as any).getIsAdmin() === true) || 
      
        ((user as any).isAdmin === true) ||
        
        ((user as any).email === "dhavirodrigues2@gmail.com")
      )
    : false;

  const [cinemasList, setCinemasList] = useState<any[]>([]);

  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortType, setSortType] = useState("alphabetical");
  const [sortAscending, setSortAscending] = useState(true);
  const [onlyPartners, setOnlyPartners] = useState(false); 

  const cinemaSortOptions = [
    { label: "Alfabético", value: "alphabetical" },
    { label: "Avaliação", value: "rating" },
  ];

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cinemas"));
        const cinemasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCinemasList(cinemasData);
      } catch (error) {
        console.error("Erro ao carregar cinemas do Firebase:", error);
      }
    };

    fetchCinemas();
  }, []);

  const filteredAndSortedCinemas = useMemo(() => {
    let result = cinemasList;

    if (searchText) {
      result = result.filter((c) =>
        c.nome?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (onlyPartners) {
      result = result.filter((c) => c.isParceiro === true);
    }

    result = [...result].sort((a, b) => {
      let comp = 0;
      if (sortType === "alphabetical") {
        comp = (a.nome || "").localeCompare(b.nome || "");
      } else if (sortType === "rating") {
        comp = (a.avaliacao || 0) - (b.avaliacao || 0);
      }
      return sortAscending ? comp : -comp;
    });

    return result;
  }, [cinemasList, searchText, onlyPartners, sortType, sortAscending]);

  const renderCinema = ({ item }: { item: any }) => (
    <CinemaCard
      nome={item.nome}
      endereco={item.endereco}
      isParceiro={item.isParceiro}
      avaliacao={item.avaliacao}
      distancia={item.distancia}
      imagem={item.imagem}
      filmes={item.filmes || []}
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

        <View style={{ flexDirection: "row", alignItems: "center", width: "100%", paddingHorizontal: 5 }}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Buscar um cinema"
              onToggleFilters={() => setShowFilters(!showFilters)}
              filtersVisible={showFilters}
            />
          </View>

          {isAdmin && (
            <TouchableOpacity
              onPress={() => router.push("/addTheater")}
              style={{
                backgroundColor: COLORS.primary,
                width: 45,
                height: 45,
                borderRadius: 25, 
                borderColor: COLORS.primaryDark,
                borderWidth: 3,
                justifyContent: "center",
                alignItems: "center",
                elevation: 4, 
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
              }}
            >
              <Text 
                style={{ 
                  color: COLORS.gold, 
                  fontSize: 26, 
                  fontFamily: "Poppins-Bold", 
                  lineHeight: 30,
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
                  color: COLORS.gold,
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