import { View, Text, Dimensions, ScrollView } from 'react-native';
import BottomNavbar from '@/components/Navbar';
import { style } from '@/styles/style';
import { ButtonY } from '@/components/ButtonY';
import { useRouter } from 'expo-router';
const { height } = Dimensions.get('window');

export default function profile() {
  const router = useRouter();

  return (
    <View style={style.background}>
        <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ width: '100%' }}
        >
          <Text style={{
            fontSize : 16, 
            color: '#FFFEB2',
            textAlign: 'center', 
            fontFamily: 'Poppins-Semibold',
            marginTop: height * 0.4}}>
            Conteúdo da página de Perfil
            </Text>
        <ButtonY title="Meus Filmes" onPress={() => router.push('/mymovies')} />
        </ScrollView>
      <BottomNavbar />
    </View>
  );
}
