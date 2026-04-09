import React from 'react';
import { View, TouchableOpacity, Text, Image, ImageBackground, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { style } from '@/styles/style';

const { width, height } = Dimensions.get('window');

const BottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

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
      route: '/filmes',
      icon: require('@/screenAssets/Navbar/filme-icon.svg'),
    },
    {
      name: 'Cupons',
      route: '/cupons',
      icon: require('@/screenAssets/Navbar/ticktet-icon.svg'),
    },
    {
      name: 'Perfil',
      route: '/perfil',
      icon: require('../screenAssets/Navbar/perfil-icon.svg'),
    },
  ];

  return (
    <View style={style.navbarWrapper}>
      <Image
        source={require('../screenAssets/Navbar/Navbar.svg')}
        style={style.navbarBackground}
        resizeMode="cover"
      />
      <View style={style.navbarContainer}>
        <SafeAreaView style={style.safeArea}>
          <View style={style.tabContainer}>
            {tabs.map((tab) => {
              const isActive = pathname === tab.route;
              return (
                <TouchableOpacity
                  key={tab.route}
                  style={style.tab}
                  onPress={() => router.push(tab.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[style.tabContent, isActive && style.activeTabContent]}>
                    <View style={style.iconWrapper}>
                      <Image
                        source={tab.icon}
                        style={[style.imageIcon, isActive && style.activeImageIcon]}
                        resizeMode="contain"
                      />
                      <Text style={[style.label, isActive && style.activeLabel]}>{tab.name}</Text>
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