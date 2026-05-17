import { Box } from "@/components/Box";
import { ButtonVoltar } from "@/components/ButtonVoltar";
import { ButtonY } from "@/components/ButtonY";
import { Input } from "@/components/Input";
import { ValidationPopup } from "@/components/ValidationPopup";
import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { updateUserName } from "@/services/userupdate";
import { fetchUserData } from "@/services/authentication";

const nameRegex = /^[\p{L} ]{3,20}$/u;

export default function NameUpdate() {
    const [newName, setNewName] = useState("")
    const router = useRouter();
    const { width, height } = useWindowDimensions();
    const styles = getStyles(width, height);
    const [validationMessage, setValidationMessage] = useState("");
    const [showValidationPopup, setShowValidationPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        const trimmedName = newName?.trim();

    if (!nameRegex.test(trimmedName)) {
      setValidationMessage("Nome deve conter de 3 a 20 caracteres, contendo apenas letras, espaços e acentos.");
      setShowValidationPopup(true);
      return;
    }
    setIsLoading(true);
    const result = await updateUserName(trimmedName);
    setIsLoading(false);

    if (!result.valid) {
      setValidationMessage(result.error || "Erro ao atualizar o nome. Tente novamente.");
      setShowValidationPopup(true);
      return;
    }

    router.push('/profile');
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
              <Text style={[textStyle.text, { textAlign: "center", width: "100%" }]}>Insira seu Novo Nome:</Text>

              <Input
                icon={require("@/screenAssets/icons/password-icon.png")}
                text="Nome:"
                value={newName}
                onChangeText={setNewName}
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
