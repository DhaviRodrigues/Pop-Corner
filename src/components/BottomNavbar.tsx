import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, ImageBackground, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

const BottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Home',
      route: '/home',
      icon: require('../screenAssets/Navbar/home-icon.svg'),
    },
    {
      name: 'Cinemas',
      route: '/cinemas',
      icon: require('../screenAssets/Navbar/cinema-icon.svg'),
    },
    {
      name: 'Filmes',
      route: '/filmes',
      icon: require('../screenAssets/Navbar/filme-icon.svg'),
    },
    {
      name: 'Cupons',
      route: '/cupons',
      icon: require('../screenAssets/Navbar/ticktet-icon.svg'),
    },
    {
      name: 'Perfil',
      route: '/perfil',
      icon: require('../screenAssets/Navbar/perfil-icon.svg'),
    },
  ];

  return (
    <View style={styles.navbarWrapper}>
      <Image
        source={require('../screenAssets/Navbar/Navbar.svg')}
        style={styles.navbarBackground}
        resizeMode="cover"
      />
      <View style={styles.navbarContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.tabContainer}>
            {tabs.map((tab) => {
              const isActive = pathname === tab.route;
              return (
                <TouchableOpacity
                  key={tab.route}
                  style={styles.tab}
                  onPress={() => router.push(tab.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.tabContent, isActive && styles.activeTabContent]}>
                    <View style={styles.iconWrapper}>
                      <Image
                        source={tab.icon}
                        style={[styles.imageIcon, isActive && styles.activeImageIcon]}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.name}</Text>
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

const styles = StyleSheet.create({
  navbarWrapper: {
    width: '100%',
    minHeight: 350, 
    height: Platform.OS === 'web' ? 360 : 350,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    justifyContent: 'flex-end', 
    alignItems: 'center',
  },
  navbarContainer: {
    width: '90%',
    height: 230, 
    backgroundColor: '#B22300',
    borderRadius: 32, 
    shadowColor: '#000',
    shadowOpacity: 0.50,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    overflow: 'hidden', 
    zIndex: 2, 
    marginBottom: Platform.OS === 'ios' ? 20 : 15, 
  },
  navbarBackground: {
    position: 'absolute',
    bottom: 0,
    width: '115%',
    height: 450, 
    top: -60, 
    left: '50%',
    transform: [{ translateX: '-50%' }],
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 2,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 15,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  activeTabContent: {
    backgroundColor: '#FFFEB2',
    width: 185,
    height: 185,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  iconWrapper: {
    width: 120, 
    height: 120, 
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    width: 70, 
    height: 70, 
    tintColor: '#FFFEB2',
  },
  activeImageIcon: {
    tintColor: '#D42A23',
  },
  label: {
    fontSize: 24, 
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFEB2',
    marginTop: 2,
  },
  activeLabel: {
    color: '#B22300',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default BottomNavbar;