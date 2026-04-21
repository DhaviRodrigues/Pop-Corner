import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { componentStyle } from "@/styles/component";
const { height, width } = Dimensions.get('window');

interface MyCouponsProps {
  onPress?: () => void;
}

export function MyCoupons({ onPress }: MyCouponsProps) {
  return (
    <TouchableOpacity 
      style={componentStyle.couponContainer} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={componentStyle.couponBox}>
        <View style={componentStyle.coupomContentContainer}>
          <View style={componentStyle.coupomTextContainer}>
            <Text style={componentStyle.coupomTitle}>MEUS CUPONS</Text>
            <Text style={componentStyle.coupomSubtitle}>Veja seus benefícios e descontos {"\n"}resgatados</Text>
          </View>
          <View style={componentStyle.coupomIconContainer}>
            <Image style={componentStyle.coupomIcon} source={require('@/screenAssets/icons/ticket.svg')} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

