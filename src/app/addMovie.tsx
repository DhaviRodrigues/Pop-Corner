import React, { useState } from "react";
import { View, ScrollView, TextInput, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { COLORS } from "@/constants/colors";
import { miscStyle } from "@/styles/misc";
import { logoStyle } from "@/styles/logo";
import { textStyle } from "@/styles/text";
import { movieStyle } from "@/styles/movie"; // Importe seus estilos padronizados aqui
import { Input } from "@/components/Input";
import { ButtonY } from "@/components/ButtonY";
import BottomNavbar from "@/components/Navbar";

export default function CreateMovie() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // States
  const [nome, setNome] = useState("");
  const [duracao, setDuracao] = useState("");
  const [generos, setGeneros] = useState(""); // Usuario digita: Ação, Comédia
  const [classificacao, setClassificacao] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [sinopse, setSinopse] = useState("");

  const handleConfirmar = async () => {
    if (!nome || !urlImagem) {
      Alert.alert("Erro", "Nome e URL da imagem são obrigatórios!");
      return;
    }

    setLoading(true);
    try {
      // Transformar string "Ação, Comédia" em Array ["AÇÃO", "COMÉDIA"]
      const tagsArray = generos.split(',').map(g => g.trim().toUpperCase());

      await addDoc(collection(db, "filmes"), {
        titulo: nome,
        duracao,
        tags: tagsArray,
        classificacao,
        url_imagem: urlImagem,
        sinopse,
        rating: 5.0, // Começa com nota cheia
        createdAt: new Date()
      });

      Alert.alert("Sucesso", "Filme adicionado com sucesso!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o filme.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[miscStyle.background, { flex: 1 }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header com Botão Voltar */}
        <View style={{ padding: 20, paddingTop: 60, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()}>
             <Image source={require("@/screenAssets/back-icon-buttom.svg")} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
          <Image source={require("@/screenAssets/logo/full-logo.png")} style={[logoStyle.escudo, { marginLeft: '20%' }]} />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Text style={[textStyle.outBoxMessage, { textAlign: 'center', marginVertical: 20 }]}>
            Escreva as Informações do Filme
          </Text>

          <Input text="Nome" value={nome} onChangeText={setNome} />
          <Input text="Duração (Ex: 1h 45min)" value={duracao} onChangeText={setDuracao} />
          <Input text="Gêneros (Separe por vírgula)" value={generos} onChangeText={setGeneros} />
          <Input text="Classificação Indicativa" value={classificacao} onChangeText={setClassificacao} />
          <Input text="URL da Imagem ou Arquivo" value={urlImagem} onChangeText={setUrlImagem} />

          {/* Container Sinopse similar ao Figma */}
          <View style={{ backgroundColor: COLORS.textMuted, borderRadius: 20, padding: 15, marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Sinopse do Filme</Text>
            <TextInput 
              multiline 
              numberOfLines={4} 
              style={{ backgroundColor: 'white', borderRadius: 10, padding: 10, textAlignVertical: 'top' }}
              value={sinopse}
              onChangeText={setSinopse}
              placeholder="Escreva aqui..."
            />
          </View>

          <View style={{ marginTop: 30 }}>
            <ButtonY title={loading ? "Salvando..." : "Confirmar"} onPress={handleConfirmar} />
          </View>
        </View>
      </ScrollView>
      <BottomNavbar />
    </View>
  );
}