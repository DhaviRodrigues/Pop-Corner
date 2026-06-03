import BottomNavbar from '@/components/Navbar';
import { miscStyle } from '@/styles/misc';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { StoreCoupon } from '@/components/StoreCoupon';
import { UserCoupon } from '@/components/UserCoupon';

// Pegando a altura total da janela pra poder posicionar o texto provisório de forma responsiva mais embaixo
const { height } = Dimensions.get('window');

export default function Coupons() {
  return (
    <View style={miscStyle.background}>
        {/* O ScrollView já fica na estrutura base pra quando a gente mapear a lista real de cupons a tela poder rolar sem quebrar o layout no celular */}
        <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ width: '100%' }}
        >
        <StoreCoupon 
          title="Cupom 1"
          type="Promoção"
          circleText="10"
          pipokaCost={100}
          description="Descrição do cupom 1"
        />
        <UserCoupon
        title="20 Reais de Desconto em Ingressos"
        discountAmount="20"
        description="Promoção válida apenas para ingressos"
        status="Ativo"
        validity="dd/mm/aaaa"
        onShowCode={() => {}}
      />
        </ScrollView>
      <BottomNavbar />
    </View>
  );
}
