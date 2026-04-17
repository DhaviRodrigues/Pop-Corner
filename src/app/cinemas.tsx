import React from 'react';
import { View, ScrollView, Image, SafeAreaView } from 'react-native';
import { style } from '@/styles/style';
import BottomNavbar from '@/components/Navbar';
import CinemaCard from '@/components/CinemaCard';
import {Input} from '@/components/Input';
import { mockCinemas } from '@/data/mockCinemas';

export default function Cinemas() {
  return (
    <SafeAreaView style={style.filmesContainer}>
          <View style={style.filmesHeader}>
            <Image 
              source={require('@/screenAssets/logo/full-logo.png')}
              style={style.filmesLogo} 
            />
            
            <View style={style.filmesSearchContainer}>
              <View style={style.filmesInputWrapper}>
                 <Input 
                   icon={require('@/screenAssets/icons/search.png')} 
                   text="Buscar um filme" 
                 />
              </View>
            </View>
          </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {mockCinemas.map((cinema) => (
          <CinemaCard 
            key={cinema.id}
            nome={cinema.nome}
            endereco={cinema.endereco}
            isParceiro={cinema.isParceiro}
            avaliacao={cinema.avaliacao}
            distancia={cinema.distancia}
            imagem={cinema.imagem}
            filmes={cinema.filmes}
          />
        ))}
      </ScrollView>

      <BottomNavbar />
    </SafeAreaView>
  );
}