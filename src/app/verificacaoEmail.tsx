import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { style } from "../styles/style";

import { Box } from "../components/Box";
import { ButtonVoltar } from "../components/ButtonVoltar";
import { ButtonY } from "../components/ButtonY";
import CodeInput from "../components/CodeInput";

const { height, width } = Dimensions.get("window");

export default function Verify2FA() {
  const router = useRouter();

  return (
    <View style={style.background}>

      <Image source={require("../screenAssets/popcorn-collor.png")} style={styles.popcorn1} />
      <Image source={require("../screenAssets/popcorn-collor.png")} style={styles.popcorn2} />
      <Image source={require("../screenAssets/popcorn-collor.png")} style={styles.popcorn3} />

      <View style={style.center}>
        <Image source={require("../screenAssets/escudo-pipoca.png")} style={styles.escudo} />

        <Text style={[style.welcomeTitle, styles.titleSmall]}>
          Estamos quase lá!
        </Text>
        <Text style={[style.welcomeTitle, styles.titleLarge]}>
          Verifique sua Identidade
        </Text>

        <Box vw={0.88} padTop={height * 0.02}>
          <View style={styles.boxContent}>

            <Text style={[style.text, styles.instructionText]}>
              Insira o código de 5 dígitos que enviamos para o e-mail a******@email.com**.
            </Text>

            <CodeInput />

            <TouchableOpacity style={styles.resendButton}>
              <Text style={[style.message, styles.resendText]}>
                Não recebeu o código? Reenviar código
              </Text>
            </TouchableOpacity>

            <ButtonY title="Confirmar" onPress={() => router.push("/home")} />
          </View>
        </Box>

        <View style={styles.backButtonContainer}>
          <ButtonVoltar title="Voltar" onPress={() => router.back()} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popcorn1: {
    position: "absolute",
    width: width * 0.1, 
    height: width * 0.1,
    top: height * 0.25, 
    right: width * 0.12,
    zIndex: 10,
  },
  popcorn2: {
    position: "absolute",
    width: width * 0.07,
    height: width * 0.07,
    top: height * 0.28,
    left: width * 0.10,
    zIndex: 10,
  },
  popcorn3: {
    position: "absolute",
    width: width * 0.08,
    height: width * 0.08,
    top: height * 0.32,
    left: width * 0.05,
    zIndex: 10,
  },
  escudo: {
    width: width * 0.45, 
    height: width * 0.45,
    marginTop: height * 0.05,
    resizeMode: "contain",
  },
  titleSmall: {
    fontSize: 20,
    marginTop: 10,
  },
  titleLarge: {
    fontSize: 24,
    marginBottom: height * 0.01,
  },
  boxContent: {
    padding: height * 0.02,
    alignItems: "center",
  },
  instructionText: {
    fontSize: 13,
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  resendButton: {
    alignSelf: "center",
    marginBottom: height * 0.03,
    marginTop: height * 0.01,
  },
  resendText: {
    textDecorationLine: "underline",
  },
  backButtonContainer: {
    marginTop: -30, 
    width: "100%", 
    alignItems: "center",
  },
});