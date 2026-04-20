import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { height, width } = Dimensions.get('window');

interface MyCouponsProps {
  onPress?: () => void;
}

export function MyCoupons({ onPress }: MyCouponsProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.couponBox}>
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>MEUS CUPONS</Text>
            <Text style={styles.subtitle}>Veja seus benefícios e descontos resgatados</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <Ionicons 
              name="ticket" 
              size={height * 0.08} 
              color="#000000" 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    marginVertical: height * 0.02,
    borderRadius: height * 0.025,
    overflow: 'hidden',
    backgroundColor: '#C41E3A',
    padding: height * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  couponBox: {
    backgroundColor: '#FFFACD',
    borderRadius: height * 0.02,
    padding: height * 0.025,
    minHeight: height * 0.15,
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: width * 0.05,
  },
  title: {
    fontSize: height * 0.035,
    fontWeight: '900',
    color: '#000000',
    fontFamily: 'Poppins-Bold',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: height * 0.014,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    lineHeight: height * 0.02,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
