import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import BottomNavbar from '@/components/Navbar';

const { height } = Dimensions.get('window');

export default function CinemasScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.text}>Conteúdo da página Cinemas</Text>
      </ScrollView>
      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingBottom: height * 0.15,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B22300',
    marginVertical: 20,
    textAlign: 'center',
  },
});
