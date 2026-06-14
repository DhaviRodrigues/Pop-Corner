import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

import { validateStyle } from '@/styles/validatecoupon';
import { COLORS } from '@/constants/colors';
import { BackButton } from '@/components/BackButton';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY';

// Define os tipos para o estado do nosso Popup
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

    try {
      // Procura o cupom na coleção dos cupons que pertencem aos usuários
      const docRef = doc(db, 'cupons_resgatados', codigoLido.trim());
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setPopup({
          visible: true,
          type: 'error',
          title: 'Cupom Inválido',
          message: 'Não encontramos nenhum cupom com este código no sistema Pop-Corner.'
        });
        setLoading(false);
        return;
      }

      const dadosCupom = docSnap.data();

      // REGRA 1: Verifica se já foi utilizado
      if (dadosCupom.status === 'USADO') {
        setPopup({
          visible: true,
          type: 'error',
          title: 'Atenção!',
          message: `O cupom "${dadosCupom.nome_cupom || 'Resgatado'}" já foi utilizado anteriormente.`
        });
      } 
      // REGRA 2: Cupom válido, vamos consumi-do
      else if (dadosCupom.status === 'DISPONIVEL' || dadosCupom.status === 'DISPONÍVEL') {
        
        await updateDoc(docRef, { status: 'USADO' });
        
        setPopup({
          visible: true,
          type: 'success',
          title: 'Sucesso!',
          message: `Cupom validado e consumido.\nBenefício liberado: ${dadosCupom.nome_cupom || 'Desconto'}`
        });
        setCodigoLido(''); 
      } 
      else {
        setPopup({
          visible: true,
          type: 'error',
          title: 'Status Desconhecido',
          message: 'O cupom está num estado inválido para resgate.'
        });
      }

    } catch (error) {
      console.error(error);
      setPopup({
        visible: true,
        type: 'error',
        title: 'Erro de Conexão',
        message: 'Falha ao comunicar com o servidor. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const popupBorderColor = popup.type === 'error' ? (COLORS.red || '#B22300') : '#2E7D32'; 
  const popupTitleColor = popup.type === 'error' ? (COLORS.red || '#B22300') : '#2E7D32';

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
              autoCapitalize="characters" // Facilita a leitura forçando tudo pra maiúsculo
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

      {/* MODAL / POPUP DE RESPOSTA (Exatamente como você pediu) */}
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