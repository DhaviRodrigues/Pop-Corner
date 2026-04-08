import { View, Text, ScrollView, FlatList } from "react-native";
import { style } from "@/styles/style";
import { MovieCard } from "@/components/MovieCard";
import { TitleBar } from "@/components/TitleBar";

export default function Home() {
  const mockMovies = [1, 2, 3, 4, 5];


  return (
    <View style={style.background}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ width: '100%' }}
>
        <TitleBar 
          title="Seja bem-vindo, (Nome)" 
          backgroundSource={require('@/screenAssets/title-rectangle.svg')} 
        />
        <View style={style.carouselSection}>
          <View style={style.sectionBadge}>
            <Text style={style.sectionBadgeText}>Recomendações</Text>
          </View>  
          <FlatList
            data={mockMovies}
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
            data={mockMovies}
            keyExtractor={(item) => item.toString()}
            renderItem={() => <MovieCard iconPath={require('@/screenAssets/icons/camera.svg')}/>}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={style.carouselContainer}
          />
        </View>
      </ScrollView>
    </View>
  );
}