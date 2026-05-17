import { Box } from "@/components/Box";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { ValidationPopup } from "@/components/ValidationPopup";
import { loginUser } from "@/services/authentication";
import { validateLogin } from "@/validation/login";
import { auth } from "@/config/firebase";
import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";

export default function PasswordConfirmation() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    const email = auth.currentUser?.email ?? "";
    const validation = validateLogin(email, password);

    if (!validation.valid) {
      setValidationMessage(validation.error);
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

    router.push('/passwordUpdate');
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
                <ButtonY title="Confirmar" onPress={handleConfirm} />
              )}
              <ButtonVoltar title="Voltar" onPress={() => router.push('/profile')} />
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
