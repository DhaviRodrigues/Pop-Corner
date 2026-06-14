import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { navBarStyle } from '@/styles/navbar';
<<<<<<< HEAD
import { useAuth } from '@/contexts/UserContext';
import { verifyAdmin } from '@/services/userservice';
=======
import { UserAdmin } from '@/types/userAdmin';
import { useUser } from '@/contexts/UserContext';
>>>>>>> main

const BottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  
<<<<<<< HEAD
  const { user } = useAuth();
=======
  const { user } = useUser();
>>>>>>> main
  const [isAdmin, setIsAdmin] = useState(false);
  
  const navbarBackground = width >= 510
    ? require('../screenAssets/Navbar/Navbar-Expandida.svg')
    : require('../screenAssets/Navbar/Navbar.svg');

  useEffect(() => {
<<<<<<< HEAD
    const checkAdminStatus = async () => {
      if (user) {
        // Utiliza o serviço unificado para verificar a role no Firestore
        const result = await verifyAdmin();
        setIsAdmin(result.isAdmin);
=======
    const verifyAdmin = async () => {
      if (user) {
        const isUserAdmin = await UserAdmin.checkIsAdmin();
        setIsAdmin(isUserAdmin);
>>>>>>> main
      } else {
        setIsAdmin(false);
      }
    };

<<<<<<< HEAD
    checkAdminStatus();
=======
    verifyAdmin();
>>>>>>> main
  }, [user]);

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
      name: isAdmin ? 'Admin' : 'Perfil',
      route: isAdmin ? '/adminControl' : '/profile',
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
                  key={tab.name}
                  style={navBarStyle.tab}
                  onPress={() => router.push(tab.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[navBarStyle.tabContent, isActive && navBarStyle.activeTabContent]}>
                    <View style={navBarStyle.iconWrapper}>
                      <Image
                        source={tab.icon}
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