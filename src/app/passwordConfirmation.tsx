import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Box } from "@/components/Box";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { ValidationPopup } from "@/components/ValidationPopup";
import { useAuth } from '@/contexts/UserContext';
import { loginUser, validateLogin, getCurrentUserEmail } from "@/services/authservice";
import { deleteUserProfile } from '@/services/userservice';
import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";

export default function PasswordConfirmation() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);
  const { setUser } = useAuth();
  
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { from } = useLocalSearchParams<{ from: string }>();

  const handleConfirm = async (from: string) => {
    const email = getCurrentUserEmail() ?? "";

    const validation = await validateLogin(email, password);

    if (!validation.valid) {
      setValidationMessage(validation.error || "Senha inválida.");
      setShowValidationPopup(true);
      return;
    }

    setIsLoading(true);
    const result = await loginUser(email, password);
    setIsLoading(false);

    if (!result.valid) {
      const message = result.error.includes("Senha") ? "Senha atual incorreta" : "Erro ao verificar a senha. Tente novamente.";
      setValidationMessage(message);
      setShowValidationPopup(true);
      return;
    }

    if (from === 'profile') {
      router.push('/updatePassword');
    } else if (from === 'updateProfile') {
      setIsLoading(true);
      const delResult = await deleteUserProfile();
      setIsLoading(false);

      if (!delResult.valid) {
        setValidationMessage(delResult.error || 'Erro ao remover conta. Tente novamente.');
        setShowValidationPopup(true);
        return;
      }

      if (setUser) setUser(null);
      router.push('/');
    }
  };

  const closeValidationPopup = () => {
    setShowValidationPopup(false);
  };

  return (
    <View style={miscStyle.background}>
      <View style={miscStyle.center}>
        <Image source={require("../screenAssets/escudo-pipoca.png")} style={logoStyle.escudo} />

        <Text style={[textStyle.outBoxMessage, { marginBottom: height * 0.03 }]}>Verificação de Segurança</Text>

        <View style={{ marginTop: height * 0.03 }}>
          <Box vw={0.8} padTop={height * 0.02}>
            <View style={miscStyle.center}>
              <Image source={require("../screenAssets/popcorn-collor.png")} style={styles.popcornTop} />
              <Text style={[textStyle.text, { textAlign: "center", width: "100%" }]}>Insira sua senha atual:</Text>

              <Input
                icon={require("@/screenAssets/icons/password-icon.png")}
                text="Senha:"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />

              {isLoading ? (
                <ActivityIndicator size="large" color="#FFD60A" style={{ marginVertical: height * 0.02 }} />
              ) : (
                <ButtonY title="Confirmar" onPress={() => handleConfirm(from)} />
              )}
              <ButtonVoltar title="Voltar" onPress={() => router.back()} />
            </View>
          </Box>
        </View>
      </View>

      <ValidationPopup
        visible={showValidationPopup}
        message={validationMessage}
        onClose={closeValidationPopup}
      />
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    popcornTop: {
      width: width * 0.14,
      height: width * 0.14,
      marginTop: -(width * 0.13),
      marginBottom: height * 0.02,
      zIndex: 1,
      alignSelf: "center",
    },
  });