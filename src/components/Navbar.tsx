import React from 'react';
import { View, TouchableOpacity, Text, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { navBarStyle} from '@/styles/navbar';

const BottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const navbarBackground = width >=510
    ? require('../screenAssets/Navbar/Navbar-Expandida.svg')
    : require('../screenAssets/Navbar/Navbar.svg');

  const tabs = [
    {
      name: 'Home',
      route: '/home',
      icon: require('@/screenAssets/Navbar/home-icon.svg'),
    },
    {
      name: 'Cinemas',
      route: '/cinemas',
      icon: require('@/screenAssets/Navbar/cinema-icon.svg'),
    },
    {
      name: 'Filmes',
      route: '/movies',
      icon: require('@/screenAssets/Navbar/filme-icon.svg'),
    },
    {
      name: 'Cupons',
      route: '/coupons',
      icon: require('@/screenAssets/Navbar/ticktet-icon.svg'),
    },
    {
      name: 'Perfil',
      route: '/profile',
      icon: require('../screenAssets/Navbar/perfil-icon.svg'),
    },
  ];

  return (
    <View style={navBarStyle.navbarWrapper}>
      <Image
        source={navbarBackground}
        style={navBarStyle.navbarBackground}
        resizeMode="cover"
      />
      <View style={navBarStyle.navbarContainer}>
        <SafeAreaView style={navBarStyle.safeArea}>
          <View style={navBarStyle.tabContainer}>
            {tabs.map((tab) => {
              const isActive = pathname === tab.route;
              return (
                <TouchableOpacity
                  key={tab.route}
                  style={navBarStyle.tab}
                  onPress={() => router.push(tab.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[navBarStyle.tabContent, isActive && navBarStyle .activeTabContent]}>
                    <View style={navBarStyle.iconWrapper}>
                      <Image
                        source={tab.icon}
                        style={[navBarStyle.imageIcon, isActive && navBarStyle.activeImageIcon]}
                        resizeMode="contain"
                      />
                      <Text style={[navBarStyle.label, isActive && navBarStyle.activeLabel]}>{tab.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default BottomNavbar;