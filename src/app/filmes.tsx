import { View, Text, StyleSheet } from 'react-native';
import BottomNavbar from '@/components/Navbar';

export default function FilmesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Filmes</Text>
      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B22300',
  },
});
