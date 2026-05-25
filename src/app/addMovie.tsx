import React, { useState } from "react";
import { View, ScrollView, TextInput, Text, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { COLORS } from "@/constants/colors";
import { miscStyle } from "@/styles/misc";
import { logoStyle } from "@/styles/logo";
import { textStyle } from "@/styles/text";
import { Input } from "@/components/Input";
import { ButtonY } from "@/components/ButtonY";
import BottomNavbar from "@/components/Navbar";
import { BackButton } from "@/components/BackButton"; 

export default function CreateMovie() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // States com os nomes no padrão da interface Movie
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [duration, setDuration] = useState("");
  const [classification, setClassification] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [synopsis, setSynopsis] = useState("");

  const handleConfirmar = async () => {
    if (!title || !image) {
      Alert.alert("Erro", "Nome e URL da imagem são obrigatórios!");
      return;
    }

    setLoading(true);
    try {
      const tagsArray = tags.split(',').map(g => g.trim().toUpperCase());

      await addDoc(collection(db, "filmes"), {
        title: title,
        director: director || "Não informado",
        year: parseInt(year) || new Date().getFullYear(),
        duration: duration,
        classification: classification,
        tags: tagsArray,
        image: image,
        synopsis: synopsis,
        rating: 5.0, 
        ratingCount: "0 avaliações",
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
      <ScrollView contentContainerStyle={{ paddingBottom: 180 }} showsVerticalScrollIndicator={false}>

        <View style={{ padding: 20, paddingTop: 60, flexDirection: 'row', alignItems: 'center' }}>
          <BackButton /> 
          <Image 
            source={require("@/screenAssets/logo/full-logo.png")} 
            style={[logoStyle.escudo, { marginLeft: '20%' }]} 
          />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Text style={[textStyle.outBoxMessage, { textAlign: 'center', marginVertical: 20 }]}>
            Escreva as Informações do Filme
          </Text>

          <Input text="Nome do Filme" value={title} onChangeText={setTitle} />
          <Input text="Diretor" value={director} onChangeText={setDirector} />
          <Input text="Ano de Lançamento (Ex: 2024)" value={year} onChangeText={setYear} keyboardType="numeric" />
          
          <Input text="Duração (Ex: 2h 07min)" value={duration} onChangeText={setDuration} />
          <Input text="Classificação (Ex: 18 anos)" value={classification} onChangeText={setClassification} />
          <Input text="Gêneros (Separe por vírgula)" value={tags} onChangeText={setTags} />
          
          <Input text="URL da Imagem" value={image} onChangeText={setImage} />

          <View style={{ 
            backgroundColor: '#B0B0B0', 
            borderRadius: 16, 
            padding: 15, 
            marginTop: 15 
          }}>
            <Text style={{ fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 10, fontSize: 16 }}>
              Sinopse do Filme
            </Text>
            <TextInput 
              multiline 
              numberOfLines={5} 
              style={{ 
                backgroundColor: 'white', 
                borderRadius: 12, 
                padding: 15, 
                textAlignVertical: 'top',
                minHeight: 100,
                fontSize: 14
              }}
              value={synopsis}
              onChangeText={setSynopsis}
              placeholder="Escreva a sinopse aqui..."
            />
          </View>

          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <ButtonY title={loading ? "Salvando..." : "Confirmar"} onPress={handleConfirmar} />
          </View>
        </View>
      </ScrollView>
      
      <BottomNavbar />
    </View>
  );
}