import React from 'react';
import { View, TouchableOpacity, Text, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { navBarStyle} from '@/styles/navbar';

const BottomNavbar = () => {
  const router = useRouter();
  // O hook usePathname é utilizado para identificar a rota atual e gerenciar o estado visual (ativo) de cada aba.
  const pathname = usePathname();
  // Captura das dimensões da janela para implementar lógica de responsividade no background da barra.
  const { width } = useWindowDimensions();
  
  // Seleção condicional do asset de fundo baseada na largura do dispositivo (breakpoint de 510px).
  // Isso garante que o design da Navbar se adapte tanto a smartphones quanto a tablets ou telas maiores.
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
        {/* O SafeAreaView é aplicado internamente para respeitar os limites de sistema (como o "notch"), mantendo o alinhamento dos itens. */}
        <SafeAreaView style={navBarStyle.safeArea}>
          <View style={navBarStyle.tabContainer}>
            {tabs.map((tab) => {
              // Verificação booleana que compara a rota atual do sistema com a rota definida no objeto da aba.
              const isActive = pathname === tab.route;
              return (
                <TouchableOpacity
                  key={tab.route}
                  style={navBarStyle.tab}
                  onPress={() => router.push(tab.route as any)}
                  activeOpacity={0.7}
                >
                  {/* Aplicação de estilos condicionais através de arrays: estilos de estado 'active' são injetados apenas se isActive for verdadeiro. */}
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