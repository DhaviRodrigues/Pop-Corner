import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { useRouter } from "expo-router";
import React from "react";
import { ValidationPopup } from "@/components/ValidationPopup";
import { db } from "@/config/firebase";
import { useUserRegistration } from '@/contexts/UserRegistrationContext';
import { sendVerificationEmail } from '@/services/cadastro2fa';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Box } from "../components/Box";
import { useState } from "react";
import { ButtonVoltar } from "../components/ButtonVoltar";
import { ButtonY } from "../components/ButtonY";
import CodeInput from "../components/CodeInput";
import { doc, getDoc, serverTimestamp, setDoc } from "@firebase/firestore";

export default function Verify2FA() {
  const router = useRouter();
  // O hook useWindowDimensions é essencial aqui porque, diferente do Dimensions.get, ele escuta mudanças e re-renderiza o componente se a tela redimensionar (tipo se girar o aparelho).
  const { width, height } = useWindowDimensions();
  // As dimensões dinâmicas são passadas para a factory de estilos lá embaixo para calcular as posições e tamanhos na hora.
  const styles = getStyles(width, height);

  const [typedCode, setTypedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const { data } = useUserRegistration();

  const handleConfirm = async () => {
  if (loading) return;
  
  if (typedCode.length < 5) {
    setValidationMessage("Por favor, insira o código de 5 dígitos.");
    setShowValidationPopup(true);
    return;
  }

  setLoading(true);
  const docRef = doc(db, "temp_codes", data.email.toLowerCase());
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const { code, createdAt } = snap.data();
    const date = Date.now();
    const createdTime = createdAt.toMillis();

    if (code === typedCode && (date - createdTime) < 600000) {
      router.push("/genre");
    } else {
      setValidationMessage(code !== typedCode ? "Código incorreto." : "Este código expirou.");
      setShowValidationPopup(true);
    }
  } else {
    setValidationMessage("Código não encontrado. Tente reenviar.");
    setShowValidationPopup(true);
  }
  setLoading(false);
};

const handleResend = async () => {
    if (resending) return;
    
    setResending(true);
    const newCode = Math.floor(10000 + Math.random() * 90000).toString(); 

    await setDoc(doc(db, "temp_codes", data.email.toLowerCase()), {
      code: newCode,
      createdAt: serverTimestamp()
    });
    
    const enviado = await sendVerificationEmail(data.email, newCode);

    if (enviado) {
      setValidationMessage("Um novo código foi enviado para seu e-mail!");
    } else {
      setValidationMessage("Erro ao reenviar e-mail. Tente novamente.");
    }
    
    setShowValidationPopup(true);
    setResending(false);
  };

  return (
    <View style={miscStyle.background}>
      {/* Pipocas decorativas com position absolute. O zIndex 0 garante que elas fiquem presas no fundo e não atrapalhem o clique nos botões que estão na frente. */}
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
              Insira o código que enviamos para o e-mail {data.email}.
            </Text>
            {/* O gerenciamento de estado e os refs dos 5 quadradinhos de input estão isolados nesse componente para não poluir a tela principal de layout. */}
            <CodeInput onCodeChange={setTypedCode} />

            <TouchableOpacity style={miscStyle.resendButton} onPress={handleResend} disabled={resending}>
              <Text style={[textStyle.underlineText]}>
                Não recebeu o código? Reenviar código
              </Text>
            </TouchableOpacity>
            {/* Como essa tela faz parte do fluxo de cadastro (diferente do esqueci a senha), o sucesso da verificação joga o usuário para a tela de escolher os gêneros (/genre) para finalizar o perfil. */}
            <ButtonY title="Confirmar" onPress={handleConfirm} 
              disabled={loading} />
            <ButtonVoltar title="Voltar" onPress={() => router.push("/register")} />
          </View>
        </Box>
        </View>
        <ValidationPopup
            visible={showValidationPopup}
            message={validationMessage}
            onClose={() => setShowValidationPopup(false)}
        />
      </View>
  );
}

// Factory function gerando os estilos baseados no width e height do momento da renderização.
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