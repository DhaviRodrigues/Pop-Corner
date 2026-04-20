import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { mockCinemas } from '@/data/mockCinemas';
import BottomNavbar from '@/components/Navbar';

export default function MapaWeb() {
  const router = useRouter();
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    // Só importa o Leaflet se estiver no navegador e após o componente montar
    if (Platform.OS === 'web') {
      Promise.all([
        import('react-leaflet'),
        import('leaflet'),
      ]).then(([ReactLeaflet, L]) => {
        setMapComponents({ ...ReactLeaflet, L: L.default });
      });
    }
  }, []);

  // Se ainda não carregou os componentes do mapa, mostra um fundo preto
  if (!MapComponents) {
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  const { MapContainer, TileLayer, Marker, Popup, L } = MapComponents;

  // Configuração do ícone dentro do useEffect ou aqui com o L carregado
  const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <View style={styles.container}>
      <MapContainer 
        center={[-8.1147, -34.9037]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {mockCinemas.map((cinema) => (
          <Marker 
            key={cinema.id} 
            position={[cinema.latitude, cinema.longitude]} 
            icon={customIcon}
          >
            <Popup>
              <div style={{ textAlign: 'center', color: '#000' }}>
                <h3>{cinema.nome}</h3>
                <p>★ {cinema.avaliacao}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Seus componentes de UI (Botão Voltar e Navbar) */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={require('@/screenAssets/back-icon-buttom.svg')} style={styles.backIcon} />
      </TouchableOpacity>
      
      <View style={styles.navbarWrapper}>
        <BottomNavbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    backButton: { position: 'absolute', top: 20, left: 20, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.7)', padding: 8, borderRadius: 20 },
    backIcon: { width: 25, height: 25 },
    navbarWrapper: { position: 'absolute', bottom: 0, width: '100%', zIndex: 1000 }
});