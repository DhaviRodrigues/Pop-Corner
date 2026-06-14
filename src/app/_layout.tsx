import { UserProvider } from '@/contexts/UserContext';
import { UserRegistrationProvider } from '@/contexts/UserRegistrationContext';
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Trava a splash screen nativa para evitar flashes visuais antes das fontes estarem prontas.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-Light': Poppins_300Light,
  });

  // Libera a renderização da tela assim que as dependências (fontes) terminarem de carregar.
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <UserProvider>
      <UserRegistrationProvider>
        <Head>
          <title>PopCorner</title>
          {/* Importação e customização do CSS do Leaflet necessárias para o mapa renderizar corretamente na web. */}
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />

          <style>{`
            .leaflet-popup-content-wrapper {
              background: transparent !important;
              box-shadow: none !important;
              padding: 0 !important;
            }
            .leaflet-popup-tip-container {
              display: none !important;
            }
            .leaflet-popup-content {
              margin: 0 !important;
            }
            .leaflet-popup-close-button {
              display: none !important;
            }
            .leaflet-top.leaflet-left {
              top: 620px !important; 
              margin-left: 10px !important;
            }

            .leaflet-bar {
              border: 2px solid #FFFEB2 !important;
              box-shadow: none !important;
            }
            .leaflet-bar a {
              background-color: rgba(0, 0, 0, 0.8) !important;
              color: #FFFEB2 !important;
              border-bottom: 1px solid #444 !important;
            }
          `}</style>
        </Head>

        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
        </Stack>
      </UserRegistrationProvider>
    </UserProvider>
  );
}
