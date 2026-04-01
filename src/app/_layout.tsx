import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold,Poppins_700Bold 
} from '@expo-google-fonts/poppins';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}