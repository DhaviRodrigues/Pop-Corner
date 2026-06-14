import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import BottomNavbar from '@/components/Navbar';
import { miscStyle } from '@/styles/misc';
import { StoreCoupon } from '@/components/StoreCoupon';
import { UserCoupon } from '@/components/UserCoupon';
import { ButtonY } from '@/components/ButtonY'; 

// Apenas o necessário para rodar o teste
import { auth } from '@/config/firebase';
import { comprarCupomService } from '@/services/pipokaService';

export default function Coupons() {

  // Função direta de teste
  const handleBuyCoupon = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return Alert.alert("Erro", "Usuário não logado.");

    try {
      const resultado = await comprarCupomService(uid, 'cupom_teste_1', 100, 'Cupom Provisório 10%');
      if (resultado.valid) {
        Alert.alert("Sucesso!", "100 Pipokas gastas e cupom gerado!");
      } else {
        Alert.alert("Ops!", resultado.error);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha no teste.");
    }
  };

  return (
    <View style={miscStyle.background}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
          
          {/* BOTÃO DE TESTE DIRETO */}
          <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 10 }}>
            <ButtonY 
              title="Testar Resgate (Gastar 100)" 
              onPress={handleBuyCoupon} 
            />
          </View>

          <StoreCoupon 
            title="Cupom 1"
            type="Promoção"
            circleText="10"
            pipokaCost={100}
            description="Descrição do cupom 1"
          />
          <UserCoupon
            title="20 Reais de Desconto in Ingressos"
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