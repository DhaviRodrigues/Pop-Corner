import { View, Text, Dimensions, ScrollView } from 'react-native';
import BottomNavbar from '@/components/Navbar';
import { miscStyle } from '@/styles/misc';
import { textStyle } from '@/styles/text';

const { height } = Dimensions.get('window');

export default function ProfileScreen() {
  return (
    <View style={miscStyle.background}>
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
        </ScrollView>
      <BottomNavbar />
    </View>
  );
}
