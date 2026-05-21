import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { COLORS } from "@/constants/colors"; 
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, useWindowDimensions, View, ScrollView, TextInput, TouchableOpacity } from "react-native";

import { Box } from "../components/Box";
import { ButtonY } from "../components/ButtonY";
import { Input } from "../components/Input";
import BottomNavbar from "../components/Navbar"; 

export default function CreateMovie() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);

  const [nome, setNome] = useState<string>("");
  const [duracao, setDuracao] = useState<string>("");
  const [generos, setGeneros] = useState<string>("");
  const [classificacao, setClassificacao] = useState<string>("");
  const [urlImagem, setUrlImagem] = useState<string>("");
  const [sinopse, setSinopse] = useState<string>("");

  const handleConfirmar = () => {
    console.log("A enviar para o Control:", { nome, duracao, generos, classificacao, urlImagem, sinopse });
  };

  return (
    <View style={miscStyle.background}>
      <TouchableOpacity style={styles.backButtonContainer} onPress={() => router.back()}>
         <Image 
           source={require("../screenAssets/back-icon-buttom.svg")} 
           style={styles.backIcon} 
           resizeMode="contain" 
         />
      </TouchableOpacity>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[miscStyle.center, { marginTop: height * 0.05 }]}>
          <Image 
            source={require("../screenAssets/logo/full-logo.png")} 
            style={logoStyle.escudo} 
            resizeMode="contain" 
          />
        </View>
        <View style={styles.formContainer}>
          <Text style={[textStyle.outBoxMessage, styles.titleText]}>
            Escreva as Informações do Filme
          </Text>
          <Input text="Nome" value={nome} onChangeText={setNome} />
          <Input text="Duração(Ex:1h45min)" value={duracao} onChangeText={setDuracao} />
          <Input text="Gêneros" value={generos} onChangeText={setGeneros} />
          <Input text="Classificação indicativa" value={classificacao} onChangeText={setClassificacao} />
          <Input text="URL da Imagem ou Arquivo" value={urlImagem} onChangeText={setUrlImagem} />
          <View style={styles.sinopseContainer}>
            <Text style={styles.sinopseTitle}>
              Sinopse do filme
            </Text>
            <TextInput 
              placeholder="Escreva a sinopse aqui..."
              placeholderTextColor={COLORS.textMuted} 
              value={sinopse}
              onChangeText={setSinopse}
              multiline={true}
              numberOfLines={6}
              style={[styles.textArea, { outlineStyle: 'none' } as any]} 
            />
          </View>
          <View style={{ marginTop: height * 0.03 }}>
             <ButtonY title="Confirmar" onPress={handleConfirmar} />
          </View>
        </View>
      </ScrollView>

      <BottomNavbar />
      
    </View>
  );
}

const getStyles = (width: number, height: number) => StyleSheet.create({
  backButtonContainer: {
    position: "absolute",
    top: height * 0.06, 
    left: width * 0.05,
    zIndex: 99, 
  },
  backIcon: {
    width: width * 0.12, 
    height: width * 0.12,
  },
  scrollContent: {
    paddingBottom: height * 0.2, 
    paddingTop: height * 0.02, 
  },
  formContainer: {
    width: width * 0.9, 
    alignSelf: "center", 
    alignItems: "center", 
  },
  titleText: {
    marginVertical: height * 0.03,
    textAlign: "center",
  },
  sinopseContainer: {
    width: "100%",
    backgroundColor: COLORS.textMuted, 
    borderRadius: 20, 
    padding: width * 0.04, 
    marginTop: height * 0.01,
  },
  sinopseTitle: {
    fontWeight: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: height * 0.015,
    fontSize: width * 0.045,
  },
  textArea: {
    minHeight: height * 0.15,
    textAlignVertical: "top", 
    backgroundColor: COLORS.white, 
    borderRadius: 12,
    padding: 15,
    fontSize: width * 0.04,
    color: COLORS.black, 
  }
});