import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { style } from "../styles/style"; // USANDO O SEU GLOBAL

import { Box } from "../components/Box";
import { ButtonVoltar } from "../components/ButtonVoltar";
import { ButtonY } from "../components/ButtonY";
import CodeInput from "../components/CodeInput";

const { height } = Dimensions.get("window");

export default function Verify2FA() {
  const router = useRouter();

  return (
    <View style={style.background}>
      <Image
        source={require("../screenAssets/popcorn-collor.png")}
        style={{
          position: "absolute",
          width: 39,
          height: 39,
          top: "25%",
          right: "12%",
          zIndex: 10,
        }}
      />
      <Image
        source={require("../screenAssets/popcorn-collor.png")}
        style={{
          position: "absolute",
          width: 26,
          height: 26,
          top: "28%",
          left: "10%",
          zIndex: 10,
        }}
      />
      <Image
        source={require("../screenAssets/popcorn-collor.png")}
        style={{
          position: "absolute",
          width: 32,
          height: 32,
          top: "32%",
          left: "5%",
          zIndex: 10,
        }}
      />

      <View style={style.center}>
        <Image
          source={require("../screenAssets/escudo-pipoca.png")}
          style={{
            width: 180,
            height: 180,
            marginTop: height * 0.05,
            resizeMode: "contain",
          }}
        />

        <Text style={[style.welcomeTitle, { fontSize: 20, marginTop: 10 }]}>
          Estamos quase lá!
        </Text>
        <Text
          style={[
            style.welcomeTitle,
            { fontSize: 24, marginBottom: height * 0.01 },
          ]}
        >
          Verifique sua Identidade
        </Text>

        <Box vw={0.88} padTop={height * 0.02}>
          <View style={{ padding: height * 0.02, alignItems: "center" }}>
            <Text
              style={[
                style.text,
                { fontSize: 13, marginBottom: height * 0.02 },
              ]}
            >
              Insira o código de 5 dígitos que enviamos para o e-mail
              a******@email.com**.
            </Text>

            <CodeInput />

            <TouchableOpacity
              style={{
                alignSelf: "center",
                marginBottom: height * 0.03,
                marginTop: height * 0.01,
              }}
            >
              <Text
                style={[style.message, { textDecorationLine: "underline" }]}
              >
                Não recebeu o código? Reenviar código
              </Text>
            </TouchableOpacity>

            <ButtonY title="Confirmar" onPress={() => router.push("/home")} />
          </View>
        </Box>

        <View style={{ marginTop: -30, width: "100%", alignItems: "center" }}>
          <ButtonVoltar title="Voltar" onPress={() => router.back()} />
        </View>
      </View>
    </View>
  );
}
