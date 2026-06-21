import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { BackButton } from '@/components/BackButton';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY';
import { CouponService } from '@/services/couponService';
import { validateStyle } from '@/styles/validatecoupon';
import { COLORS } from '@/constants/colors';

type PopupConfig = {
  visible: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
};

export default function ValidarCupomScreen() {
  const router = useRouter();
  
  const [codigoLido, setCodigoLido] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<PopupConfig>({ visible: false, type: 'error', title: '', message: '' });

  const fecharPopup = () => setPopup({ ...popup, visible: false });

  const validarNoFirebase = async () => {
    if (!codigoLido.trim()) {
      setPopup({
        visible: true,
        type: 'error',
        title: 'Código Vazio',
        message: 'Por favor, digite o código de resgate do cupom antes de validar.'
      });
      return;
    }

    setLoading(true);

    const result = await CouponService.validateRedeemedCoupon(codigoLido);

    if (!result.valid) {
      setPopup({
        visible: true,
        type: 'error',
        title: result.error?.includes('anteriormente') ? 'Atenção!' : 'Cupom Inválido',
        message: result.error || 'Erro ao processar validação.'
      });
      setLoading(false);
      return;
    }

    setPopup({
      visible: true,
      type: 'success',
      title: 'Sucesso!',
      message: `Cupom validado e consumido.\nBenefício liberado: ${result.data?.nome_cupom}`
    });
    setCodigoLido('');
    setLoading(false);
  };

  const popupBorderColor = popup.type === 'error' ? (COLORS.red || '#B22300') : '#B22300'; 
  const popupTitleColor = popup.type === 'error' ? (COLORS.gold || '#B22300') : '#2E7D32';

  return (
    <View style={validateStyle.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={validateStyle.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={validateStyle.header}>
          <BackButton onPress={() => router.back()} />
          <Text style={validateStyle.headerTitle}>Validar Cupom</Text>
        </View>

        <View style={validateStyle.inputCard}>
          <Text style={validateStyle.instructionText}>
            Digite o código de resgate apresentado pelo cliente para validar e consumir o benefício.
          </Text>

          <View style={validateStyle.inputWrapper}>
            <TextInput
              placeholder="Ex: R5G4T3-9988"
              placeholderTextColor="#A9A9A9"
              value={codigoLido}
              onChangeText={setCodigoLido}
              style={validateStyle.inputField as any}
              autoCapitalize="characters"
            />
          </View>

          <View style={{ width: '80%', marginTop: 10 }}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.gold} />
            ) : (
              <ButtonY title="Validar Código" onPress={validarNoFirebase} />
            )}
          </View>
        </View>

      </ScrollView>

      <Modal visible={popup.visible} transparent={true} animationType="fade">
        <View style={validateStyle.modalOverlay}>
          
          <View style={[validateStyle.popupContainer, { borderColor: popupBorderColor }]}>
            
            <Text style={[validateStyle.popupTitle, { color: popupTitleColor }]}>
              {popup.title}
            </Text>
            
            <Text style={validateStyle.popupMessage}>
              {popup.message}
            </Text>

            <TouchableOpacity 
              style={[validateStyle.popupBtn, { backgroundColor: popupBorderColor }]}
              onPress={fecharPopup}
              activeOpacity={0.8}
            >
              <Text style={validateStyle.popupBtnText}>
                {popup.type === 'error' ? 'Tentar Novamente' : 'Finalizar'}
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </Modal>

      <BottomNavbar />
    </View>
  );
}