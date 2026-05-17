import { Box } from "@/components/Box";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { ValidationPopup } from "@/components/ValidationPopup";
import { auth } from "@/config/firebase";
import { updatePassword } from "firebase/auth";
import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";

export default function PasswordUpdate() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      setValidationMessage("Todos os campos precisam ser preenchidos");
      setShowValidationPopup(true);
      return;
    }

    if (password !== confirmPassword) {
      setValidationMessage("As senhas devem ser idênticas");
      setShowValidationPopup(true);
      return;
    }

    const passwordRegex = /^(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setValidationMessage("Senha deve ter mais de 8 caracteres e incluir um número");
      setShowValidationPopup(true);
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setValidationMessage("Não foi possível atualizar a senha. Faça login novamente.");
      setShowValidationPopup(true);
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(currentUser, password);
      router.push('/profile');
    } catch (error) {
      setValidationMessage("Erro ao atualizar a senha. Tente novamente.");
      setShowValidationPopup(true);
    }
    setIsLoading(false);
  };

  const closeValidationPopup = () => {
    setShowValidationPopup(false);
  };

  return (
    <View style={miscStyle.background}>
      <View style={miscStyle.center}>
        <Image source={require("../screenAssets/escudo-pipoca.png")} style={logoStyle.escudo} />

        <Text style={[textStyle.outBoxMessage, { marginBottom: height * 0.03 }]}>Crie uma Nova Senha</Text>

        <View style={{ marginTop: height * 0.03 }}>
          <Box vw={0.8} padTop={height * 0.02}>
            <View style={miscStyle.center}>
              <Image source={require("../screenAssets/popcorn-collor.png")} style={styles.popcornTop} />
              <Text style={[textStyle.text, { textAlign: "center", width: "100%", marginBottom: height * 0.015 }]}>Insira a nova senha:</Text>

              <Input
                icon={require("@/screenAssets/icons/password-icon.png")}
                text="Senha:"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />

              <Text style={[textStyle.text, { textAlign: "center", width: "100%", marginTop: height * 0.02, marginBottom: height * 0.01 }]}>Confirme a senha:</Text>
              <Input
                icon={require("@/screenAssets/icons/password-icon.png")}
                text="Senha:"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <Text style={[textStyle.message, { marginTop: height * 0.015, textAlign: "center" }]}>*A senha deve conter mais de 8 caracteres e um número</Text>

              {isLoading ? (
                <ActivityIndicator size="large" color="#FFD60A" style={{ marginVertical: height * 0.02 }} />
              ) : (
                <ButtonY title="Confirmar" onPress={handleConfirm} />
              )}
              <ButtonVoltar title="Cancelar" onPress={() => router.push('/profile')} />
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
