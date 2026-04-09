import { View, Text, Dimensions, ScrollView } from 'react-native';
import BottomNavbar from '@/components/Navbar';
import { style } from '@/styles/style';

const { height } = Dimensions.get('window');

export default function PerfilScreen() {
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
            Conteúdo da página de Cupons
            </Text>
        </ScrollView>
      <BottomNavbar />
    </View>
  );
}
