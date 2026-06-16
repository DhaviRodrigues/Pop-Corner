import React from 'react';
import { View, TouchableOpacity, Text, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { navBarStyle } from '@/styles/navbar';
import { useAuth } from '@/contexts/UserContext';

const BottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { isAdmin } = useAuth();
  
  const navbarBackground = width >= 510
    ? require('../screenAssets/Navbar/Navbar-Expandida.png')
    : require('../screenAssets/Navbar/Navbar.png');

  const tabs = [
    {
      name: 'Home',
      route: '/home',
      icon: require('@/screenAssets/Navbar/home-icon.png'),
      activeIcon: require('@/screenAssets/Navbar/home-icon-red.png'),
    },
    {
      name: 'Cinemas',
      route: '/cinemas',
      icon: require('@/screenAssets/Navbar/cinema-icon.png'),
      activeIcon: require('@/screenAssets/Navbar/cinema-icon-red.png'),
    },
    {
      name: 'Filmes',
      route: '/movies',
      icon: require('@/screenAssets/Navbar/filme-icon.png'),
      activeIcon: require('@/screenAssets/Navbar/filme-icon-red.png'),
    },
    {
      name: 'Cupons',
      route: '/coupons',
      icon: require('@/screenAssets/Navbar/ticktet-icon.png'),
      activeIcon: require('@/screenAssets/Navbar/ticktet-icon-red.png'),
    },
    {
      name: isAdmin ? 'Admin' : 'Perfil',
      route: isAdmin ? '/adminControl' : '/profile',
      icon: require('@/screenAssets/Navbar/perfil-icon.png'),
      activeIcon: require('@/screenAssets/Navbar/perfil-icon-red.png'),
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
                  key={tab.name}
                  style={navBarStyle.tab}
                  onPress={() => router.push(tab.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[navBarStyle.tabContent, isActive && navBarStyle.activeTabContent]}>
                    <View style={navBarStyle.iconWrapper}>
                      <Image
                        source={isActive ? tab.activeIcon : tab.icon}
                        style={[navBarStyle.imageIcon, isActive && navBarStyle.activeImageIcon]}
                        resizeMode="contain"
                      />
                      <Text style={[navBarStyle.label, isActive && navBarStyle.activeLabel]}>
                        {tab.name}
                      </Text>
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