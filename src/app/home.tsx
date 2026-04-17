import { View, Text, ScrollView, FlatList } from "react-native";
import { MovieCard } from "@/components/MovieCard";
import { TitleBar } from "@/components/TitleBar";
import BottomNavbar from "@/components/Navbar";
import {miscStyle} from "@/styles/misc";
import {textStyle} from "@/styles/text";

export default function Home() {
  const mockRecommended = [1, 2, 3, 4, 5];
  const mockDiscover = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <View style={miscStyle.background}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ width: '100%' }}
>
        <TitleBar 
          title="Seja bem-vindo, (Nome)" 
          backgroundSource={require('@/screenAssets/title-rectangle.png')} 
        />
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
        <View style={{ height: 150 }} />
      </ScrollView>
      <BottomNavbar />
    </View>
  );
}