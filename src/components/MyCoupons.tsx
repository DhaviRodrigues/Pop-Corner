import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { componentStyle } from "@/styles/component";
// Constantes que armazenam as dimensões do dispositivo para garantir a adaptabilidade do layout.
const { height, width } = Dimensions.get('window');

// Interface para as propriedades do componente, permitindo a execução de funções externas no evento de clique.
interface MyCouponsProps {
  onPress?: () => void;
}

export function MyCoupons({ onPress }: MyCouponsProps) {
  return (
    // Componente de toque que encapsula toda a área do card, utilizando activeOpacity para feedback visual discreto.
    <TouchableOpacity 
      style={componentStyle.couponContainer} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={componentStyle.couponBox}>
        <View style={componentStyle.coupomContentContainer}>
          <View style={componentStyle.coupomTextContainer}>
            <Text style={componentStyle.coupomTitle}>MEUS CUPONS</Text>
            {/* Uso de quebra de linha manual para assegurar que a hierarquia visual do texto seja mantida em diferentes larguras de tela. */}
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

