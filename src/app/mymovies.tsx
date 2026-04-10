import { View, Text, ScrollView, FlatList } from "react-native";
import { style } from "@/styles/style";
import { ButtonR } from "@/components/ButtonR";
import { useRouter } from "expo-router";
import { MovieCard } from "@/components/MovieCard";
import { TitleBar } from "@/components/TitleBar";
import BottomNavbar from "@/components/Navbar";

export default function MyMovies() {
    const router = useRouter();

    const mockAssistidos = [1, 2, 3, 4, 5, 6];
    const mockWatchlist = [1, 2, 3, 4, 5];

    return (
        <View style={style.background}>
            <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ width: '100%' }}
>
        <TitleBar 
          title="Meus Filmes" 
          backgroundSource={require('@/screenAssets/title-rectangle.png')}
        />
        <View style={style.carouselSection}>
            <View style={style.yellowBar}>
            <ButtonR title="Assistidos" onPress={() => router.push('/Watched')} />
            </View>
            <FlatList
            data={mockAssistidos}
            keyExtractor={(item) => item.toString()}
            renderItem={() => <MovieCard iconPath={require('@/screenAssets/icons/camera.svg')}/>}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={style.carouselContainer}
            />
        </View>
        </ScrollView>
        <BottomNavbar />
    </View>
    );
}