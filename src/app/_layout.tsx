import { UserProvider } from '@/contexts/UserContext';
import { UserRegistrationProvider } from '@/contexts/UserRegistrationContext';
import {
  Poppins_300Light,
  Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold,
  useFonts
} from '@expo-google-fonts/poppins';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-Light': Poppins_300Light,
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
    <UserProvider>
      <UserRegistrationProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
        </Stack>
      </UserRegistrationProvider>
    </UserProvider>
  );
}