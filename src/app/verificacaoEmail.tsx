import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Box } from "../components/Box";
import { ButtonVoltar } from "../components/ButtonVoltar";
import { ButtonY } from "../components/ButtonY";
import CodeInput from "../components/CodeInput";
import { miscStyle } from "@/styles/misc";
import { textStyle} from "@/styles/text";
import { logoStyle } from "@/styles/logo";

export default function Verify2FA() {
  const router = useRouter();
  
  const { width, height } = useWindowDimensions();

  const styles = getStyles(width, height);

  return (
    <View style={miscStyle.background}>
      <Image source={require("../screenAssets/popcorn-collor.png")} style={styles.popcorn1} />
      <Image source={require("../screenAssets/popcorn-collor.png")} style={styles.popcorn2} />
      <Image source={require("../screenAssets/popcorn-collor.png")} style={styles.popcorn3} />

      <View style={miscStyle.center}>
        <Image source={require("../screenAssets/escudo-pipoca.png")} style={logoStyle.escudo} />

        <Text style={[textStyle.outBoxMessage]}>
          Estamos quase lá!
        </Text>
        <Text style={[textStyle.outBoxMessage, { marginBottom: height * 0.03}]}>
          Verifique sua Identidade
        </Text>

        <Box vw={0.75} padTop={height * 0.02}>
          <View style={miscStyle.center}>
            <Text style={[textStyle.text, { textAlign: "left" }]}>
              Insira o código que enviamos para o e-mail a******@email.com**.
            </Text>
            <CodeInput />

            <TouchableOpacity style={miscStyle.resendButton}>
              <Text style={[textStyle.underlineText]}>
                Não recebeu o código? Reenviar código
              </Text>
            </TouchableOpacity>
            <ButtonY title="Confirmar" onPress={() => router.push("/genre")} />
            <ButtonVoltar title="Voltar" onPress={() => router.push("/register")} />
          </View>
        </Box>
        </View>
      </View>
  );
}

const getStyles = (width: number, height: number) => StyleSheet.create({
  popcorn1: {
    position: "absolute",
    width: width * 0.1, 
    height: width * 0.1,
    top: height * 0.22, 
    right: width * 0.12,
    zIndex: 0,
  },
  popcorn2: {
    position: "absolute",
    width: width * 0.07,
    height: width * 0.07,
    top: height * 0.23,
    left: width * 0.14,
    zIndex: 0,
  },
  popcorn3: {
    position: "absolute",
    width: width * 0.08,
    height: width * 0.08,
    top: height * 0.27,
    left: width * 0.05,
    zIndex: 0,
  },
});