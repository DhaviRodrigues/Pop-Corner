import { View, Text, Dimensions, ScrollView } from 'react-native';
import BottomNavbar from '@/components/Navbar';
import { miscStyle } from '@/styles/misc';

const { height } = Dimensions.get('window');

export default function Cinemas() {
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
            Conteúdo da página de Cinemas
            </Text>
        </ScrollView>
      <BottomNavbar />
    </View>
  );
}
