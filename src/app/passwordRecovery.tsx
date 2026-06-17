import React, { useState } from "react";
import { ActivityIndicator, useWindowDimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from 'expo-router';

import { Box } from "@/components/Box";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { ValidationPopup } from "@/components/ValidationPopup";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { miscStyle } from "@/styles/misc";
import { logoStyle } from "@/styles/logo";
import { textStyle } from "@/styles/text";
import { AuthService } from "@/services/authservice";

export default function PasswordRecovery() {
  const { height } = useWindowDimensions();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  async function handleResetPassword() {
    if (!email.trim()) {
      setValidationMessage("Por favor, digite o seu e-mail.");
      setShowValidationPopup(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationMessage("Por favor, insira um e-mail válido.");
      setShowValidationPopup(true);
      return;
    }

    try {
      setLoading(true);
      
      const { success, message } = await AuthService.sendPasswordResetEmail(email.trim());
      
      setValidationMessage(message);
      setShowValidationPopup(true);

      if (success) {
        setEmail('');
        setTimeout(() => {
          setShowValidationPopup(false);
          router.push('/');
        }, 3000);
      }
    } catch (error) {
      console.error("Erro ao recuperar senha na tela:", error);
      setValidationMessage("Ocorreu um erro inesperado. Tente novamente mais tarde.");
      setShowValidationPopup(true);
    } finally {
      setLoading(false);
    }
  }

  function closeValidationPopup() {
    setShowValidationPopup(false);
  }

  return (
    <View style={miscStyle.background}>
      <Image source={require('@/screenAssets/logo/full-logo.png')} style={logoStyle.logoB}/>
      <View style={miscStyle.center}> 
        <Box vw={0.80} padTop={0}> 
          <Image 
            source={require('@/screenAssets/popcorn-collor.png')} 
            style={miscStyle.popcorn}
          />
          <View style={miscStyle.formContainer}>
            <Text style={textStyle.text}>Recuperar Senha</Text>
            <Input
              icon={require('@/screenAssets/icons/email-icon.png')}
              text="Email:"
              value={email}
              onChangeText={setEmail}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#FFD60A" style={{ marginVertical: height * 0.02 }} />
            ) : (
              <ButtonY title="Enviar Email" onPress={handleResetPassword} />
            )}
            <View style={{ marginTop: height * 0.015, marginBottom: height * 0.000, width: '100%' }}>
              <ButtonVoltar title="Voltar" onPress={() => router.push('/')} />
            </View>
          </View>
        </Box>
      </View>
      <ValidationPopup
        visible={showValidationPopup}
        message={validationMessage}
        onClose={closeValidationPopup}
      />
    </View>
  );
}
