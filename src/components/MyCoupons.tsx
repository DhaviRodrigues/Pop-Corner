import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { componentStyle } from "@/styles/component";

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
            <Text style={componentStyle.coupomTitles}>MEUS CUPONS</Text>
            <Text style={componentStyle.coupomSubtitle}>Veja seus benefícios e descontos resgatados</Text>
          </View>
          <View style={componentStyle.coupomIconContainer}>
            <Image style={componentStyle.coupomIcon} source={require('@/screenAssets/icons/ticket.png')} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

