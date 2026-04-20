import { View, Text, ScrollView, FlatList } from "react-native";
import { MovieCard } from "@/components/MovieCard";
import { TitleBar } from "@/components/TitleBar";
import BottomNavbar from "@/components/Navbar";
import {miscStyle} from "@/styles/misc";
import { Dimensions } from "react-native";
const { height } = Dimensions.get("window");

export default function Home() {
  const mockRecommended = [1, 2, 3, 4, 5];
  const mockDiscover = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <View style={miscStyle.background}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ width: '100%' }}
>
      <TitleBar title="Seja Bem-Vindo" />
        <View style={miscStyle.carouselSection}>
          <View style={miscStyle.sectionBadge}>
            <Text style={miscStyle.sectionBadgeText}>Recomendações</Text>
          </View>  
          <FlatList
            data={mockRecommended}
            keyExtractor={(item) => item.toString()}
            renderItem={() => <MovieCard iconPath={require('@/screenAssets/icons/camera.svg')}/>}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={miscStyle.carouselContainer}
          />
        </View>
        <View style={miscStyle.carouselSection}>
          <View style={miscStyle.sectionBadge}>
            <Text style={miscStyle.sectionBadgeText}>Descubra novos filmes</Text>
          </View>
          <FlatList
            data={mockDiscover}
            keyExtractor={(item) => item.toString()}
            renderItem={() => <MovieCard iconPath={require('@/screenAssets/icons/camera.svg')}/>}
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