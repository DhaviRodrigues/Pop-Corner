import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '@/components/Navbar';
import CinemaCard from '@/components/CinemaCard';
import { Input } from '@/components/Input';
import { ButtonY } from '@/components/ButtonY';
import { mockCinemas } from '@/data/mockCinemas';
import { movieStyle } from '@/styles/movie';
import { style as cinemaStyle } from '@/styles/cinema';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';

export default function Cinemas() {
  const router = useRouter();

  const renderCinema = ({ item }: { item: typeof mockCinemas[0] }) => (
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
    <SafeAreaView style={[movieStyle.filmesContainer, { flex: 1, backgroundColor: COLORS.primary }]}>

      {/* Header com Logo e Busca */}
      <View style={movieStyle.filmesHeader}>
        <Image
          source={require('@/screenAssets/logo/full-logo.png')}
          style={movieStyle.filmesLogo}
        />

        <View style={movieStyle.filmesSearchContainer}>
          <View style={movieStyle.filmesInputWrapper}>
            <Input
              icon={require('@/screenAssets/icons/search.png')}
              text="Buscar um cinema"
            />
          </View>
        </View>
      </View>

      {/* Lista de Cinemas */}
      <FlatList
        data={mockCinemas}
        renderItem={renderCinema}
        // Usando ID + Index para garantir que não dê erro de chaves duplicadas
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} 

        ListFooterComponent={
          <View style={{ alignItems: 'center', marginTop: 30, paddingBottom: 50 }}>
            {/* Botão Ver Mais */}
            <View style={movieStyle.filmesFooterBtn}>
              <ButtonY title="Ver mais" />
            </View>

            {/* Botão Mapa (Ícone + Texto dentro do Touchable para facilitar o clique) */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ marginTop: 25, alignItems: 'center' }}
              onPress={() => router.push('/map')} // Certifique-se que o arquivo é app/map.tsx
            >
              <Image
                source={require('@/screenAssets/Map-Buttom.svg')}
                style={cinemaStyle.mapButtom}
              />
              <Text style={{
                color: '#FFFEB2',
                fontSize: 12,
                fontFamily: 'Poppins-Bold',
                marginTop: 8
              }}>
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