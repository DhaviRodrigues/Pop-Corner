import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { componentStyle } from "@/styles/component"; 
import { COLORS } from "@/constants/colors"; 
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, useWindowDimensions, View, ScrollView, TouchableOpacity, TextInput } from "react-native";

import { ButtonY } from "../components/ButtonY";
import BottomNavbar from "../components/Navbar"; 

// --- COMPONENTE LOCAL ---
// Substitui o Input global apenas nesta tela para garantir o alinhamento e evitar vazamento de texto.
function LocalInput({ text, value, onChangeText }: { text: string, value: string, onChangeText: (v: string) => void }) {
  return (
    <View style={[componentStyle.inputContainer, { width: '100%', overflow: 'hidden' }]}>
      <TextInput
        placeholder={text}
        placeholderTextColor="#A9A9A9"
        style={[
          componentStyle.inputText, 
          { 
            flex: 1, 
            flexShrink: 1, 
            minWidth: 0,   
            width: '100%', 
            outlineStyle: 'none' 
          } as any
        ]} 
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

export default function CreateCinema() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);

  const [nome, setNome] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [urlImagem, setUrlImagem] = useState<string>("");

  const [idFilme, setIdFilme] = useState<string>("");
  const [dataSessao, setDataSessao] = useState<string>("");
  const [horarioSessao, setHorarioSessao] = useState<string>("");

  const handleAdicionarFilme = () => {
    console.log("Filme adicionado:", { idFilme });
  };

  const handleAdicionarSessao = () => {
    console.log("Sessão adicionada:", { dataSessao, horarioSessao });
  };

  const handleConfirmar = () => {
    console.log("A enviar para o Control:", { nome, cidade, endereco, latitude, longitude, urlImagem });
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
            Escreva as Informações do Cinema
          </Text>
          
          <View style={styles.row}>
            <View style={styles.halfInput}> 
              <LocalInput text="Nome" value={nome} onChangeText={setNome} />
            </View>
            <View style={styles.halfInput}>
              <LocalInput text="Cidade" value={cidade} onChangeText={setCidade} />
            </View>
          </View>

          <View style={styles.fullInput}>
            <LocalInput text="Endereço" value={endereco} onChangeText={setEndereco} />
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <LocalInput text="Latitude" value={latitude} onChangeText={setLatitude} />
            </View>
            <View style={styles.halfInput}>
              <LocalInput text="Longitude" value={longitude} onChangeText={setLongitude} />
            </View>
          </View>

          <View style={styles.fullInput}>
            <LocalInput text="URL da Imagem ou Arquivo" value={urlImagem} onChangeText={setUrlImagem} />
          </View>

          <View style={styles.grayBoxContainer}>
            <Text style={styles.grayBoxTitle}>Adicionar Filmes em Cartaz</Text>
            
            <View style={styles.fullInput}>
              <LocalInput text="ID do Filme" value={idFilme} onChangeText={setIdFilme} />
            </View>

            <View style={styles.buttonWrapper}>
              <ButtonY title="Adicionar" onPress={handleAdicionarFilme} />
            </View>
          </View>

          <View style={styles.grayBoxContainer}>
            <Text style={styles.grayBoxTitle}>Adicionar Sessões</Text>
            
            <View style={styles.sessionRow}>
              <TouchableOpacity style={[componentStyle.inputContainer, styles.mockDropdown]}>
                <Text style={styles.dropdownText}>Filmez em Cartaz</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              
              <View style={styles.sessionSmallInput}>
                <LocalInput text="Data" value={dataSessao} onChangeText={setDataSessao} />
              </View>
              <View style={styles.sessionSmallInput}>
                <LocalInput text="Hora" value={horarioSessao} onChangeText={setHorarioSessao} />
              </View>
            </View>

            <View style={styles.buttonWrapper}>
              <ButtonY title="Adicionar" onPress={handleAdicionarSessao} />
            </View>
          </View>

          <View style={styles.grayBoxContainer}>
            <Text style={styles.grayBoxTitle}>Sessões Atuais:</Text>

            <ScrollView 
              style={styles.mockListContainer}
              nestedScrollEnabled={true} 
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.mockListText}>ex: Batman Cavaleiro das Trevas #2032- 11:30- 17:30</Text>
              <Text style={styles.mockListText}>Barbie #6632- 11:30- 17:30</Text>
              <Text style={styles.mockListText}>Batman:Begin #2032- 11:30- 17:30</Text>
              <Text style={styles.mockListText}>Pokemon #0992- 11:30- 17:30</Text>
              <Text style={styles.mockListText}>Oppenheimer #1245- 14:00- 20:00</Text>
              <Text style={styles.mockListText}>Duna: Parte 2 #9931- 15:30- 21:30</Text>
              <Text style={styles.mockListText}>Homem-Aranha #3451- 10:00- 16:00</Text>
            </ScrollView>
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
  row: {
    flexDirection: "row",
    width: "100%", 
    justifyContent: "center", 
    gap: 10, 
  },
  halfInput: {
    flex: 1, 
  },
  fullInput: {
    width: "100%",
    marginVertical: height * 0.015, 
  },

  grayBoxContainer: {
    width: "100%",
    backgroundColor: COLORS.textMuted, 
    borderRadius: 20, 
    padding: width * 0.04, 
    marginTop: height * 0.02,
  },
  grayBoxTitle: {
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: height * 0.015,
    fontSize: width * 0.042,
  },
  buttonWrapper: {
    width: "60%", 
    alignSelf: "center",
    marginTop: height * 0.01,
  },

  sessionRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: height * 0.015,
  },
  mockDropdown: {
    flex: 2, 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 50, 
  },
  dropdownText: {
    color: COLORS.textMuted,
    fontSize: width * 0.035,
  },
  dropdownIcon: {
    color: COLORS.textMuted,
    fontSize: width * 0.035,
  },
  sessionSmallInput: {
    flex: 1.2, 
  },

  mockListContainer: {
    maxHeight: height * 0.15, 
    backgroundColor: COLORS.white, 
    borderRadius: 12,
    padding: 15,
  },
  mockListText: {
    color: COLORS.textMuted, 
    fontSize: width * 0.035,
    marginBottom: 8, 
  }
});