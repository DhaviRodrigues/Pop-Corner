import { View, Text, ScrollView, FlatList } from "react-native";
import { style } from "@/styles/style";
import { MovieCard } from "@/components/MovieCard";
import { TitleBar } from "@/components/TitleBar";
import BottomNavbar from "@/components/Navbar";

export default function Home() {
  const mockRecommended = [1, 2, 3, 4, 5];
  const mockDiscover = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <View style={style.background}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ width: '100%' }}
>
        <TitleBar 
          title="Seja bem-vindo, (Nome)" 
          backgroundSource={require('@/screenAssets/title-rectangle.png')} 
        />
        <View style={style.carouselSection}>
          <View style={style.sectionBadge}>
            <Text style={style.sectionBadgeText}>Recomendações</Text>
          </View>  
          <FlatList
            data={mockRecommended}
            keyExtractor={(item) => item.toString()}
            renderItem={() => <MovieCard iconPath={require('@/screenAssets/icons/camera.svg')}/>}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={style.carouselContainer}
          />
        </View>
        <View style={style.carouselSection}>
          <View style={style.sectionBadge}>
            <Text style={style.sectionBadgeText}>Descubra novos filmes</Text>
          </View>
          <FlatList
            data={mockDiscover}
            keyExtractor={(item) => item.toString()}
            renderItem={() => <MovieCard iconPath={require('@/screenAssets/icons/camera.svg')}/>}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={style.carouselContainer} 
          />
        </View>
        <View style={{ height: 150 }} />
      </ScrollView>
      <BottomNavbar />
    </View>
  );
}