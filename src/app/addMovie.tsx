import React, { useState } from "react";
import { View, ScrollView, Text, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { movieStyle } from "@/styles/movie"; 
import { Input } from "@/components/Input";
import { ButtonY } from "@/components/ButtonY";
import BottomNavbar from "@/components/Navbar";
import { BackButton } from "@/components/BackButton"; 
import { SynopsisInput } from "@/components/SynopsisInput";
import { registerMovie } from "@/services/movieservice";

export default function CreateMovie() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState("");
  const [classification, setClassification] = useState("");
  const [image, setImage] = useState("");
  const [synopsis, setSynopsis] = useState("");

  const handleConfirmar = async () => {
    if (!title || !image) {
      Alert.alert("Erro", "Nome e URL da imagem são obrigatórios!");
      return;
    }

    setLoading(true);
    try {
      const moviePayload = {
        title,
        director,
        year: year ? Number(year) : undefined,
        duration,
        classification,
        tags,
        image,
        synopsis,
      };

      const result = await registerMovie(moviePayload);

      if (result.valid) {
        Alert.alert("Sucesso", "Filme adicionado com sucesso!");
        router.back();
      } else {
        Alert.alert("Erro", result.error || "Não foi possível salvar o filme.");
      }
    } catch (error) {
      console.error("Erro ao registrar filme na View:", error);
      Alert.alert("Erro", "Ocorreu um erro inesperado ao salvar o filme.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[miscStyle.background, { flex: 1 }]}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }} 
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}
        <View style={[movieStyle.filmesHeader, { height: 220, justifyContent: 'flex-end', paddingBottom: 10 }]}>
          <View style={{ position: 'absolute', left: 20, top: 60, transform: [{ scale: 1.2 }] }}>
            <BackButton /> 
          </View>
          
          <Image 
            source={require("@/screenAssets/logo/full-logo.png")} 
            style={[movieStyle.filmesLogo, { width: 180, height: 180, resizeMode: 'contain', transform: [{ translateY: 25 }] }]} 
          />
        </View>

        {/* CONTAINER DO FORMULÁRIO */}
        <View style={{ flex: 1, justifyContent: 'center' }}>

          <Text style={[textStyle.outBoxMessage, { textAlign: 'center', marginBottom: 20, fontSize: 22 }]}>
            Escreva as Informações do Filme
          </Text>

          {/* INPUTS */}
          <View style={movieStyle.formGroup}>
            <Input text="Nome do Filme" value={title} onChangeText={setTitle} />
            <Input text="Diretor" value={director} onChangeText={setDirector} />
            <Input text="Ano de Lançamento (Ex: 2024)" value={year} onChangeText={setYear} keyboardType="numeric" />
            <Input text="Duração (Ex: 2h 07min)" value={duration} onChangeText={setDuration} />
            <Input text="Gêneros" value={tags} onChangeText={setTags} />
            <Input text="Classificação indicativa" value={classification} onChangeText={setClassification} />
            <Input text="URL da Imagem ou Arquivo" value={image} onChangeText={setImage} />
          </View>

          {/* SINOPSE */}
          <View style={{ width: '90%', alignSelf: 'center', marginBottom: 20 }}>
            <SynopsisInput value={synopsis} onChangeText={setSynopsis} />
          </View>

          {/* BOTÃO CONFIRMAR */}
          <View style={{ alignItems: 'center', width: '100%' }}>
            <ButtonY title={loading ? "Salvando..." : "Confirmar"} onPress={handleConfirmar} />
          </View>
          
        </View>
      </ScrollView>
      
      <BottomNavbar />
    </View>
  );
}