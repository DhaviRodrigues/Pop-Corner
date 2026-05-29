import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { componentStyle } from "@/styles/component"; 
import { COLORS } from "@/constants/colors"; 
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, useWindowDimensions, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Cinema } from "@/types/cinema"; 
import { Sessao } from "@/types/sessao"; 
import { registerCinema } from "@/services/cinemaService";
import { ButtonY } from "../components/ButtonY";
import BottomNavbar from "../components/Navbar"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

function LocalInput({ text, value, onChangeText }: { text: string, value: string, onChangeText: (v: string) => void }) {
  return (
    <View style={[componentStyle.inputContainer, { width: '100%', overflow: 'hidden' }]}>
      <TextInput
        placeholder={text}
        placeholderTextColor="#A9A9A9"
        style={[componentStyle.inputText, { flex: 1, flexShrink: 1, minWidth: 0, width: '100%', outlineStyle: 'none' } as any]} 
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
  const { editId } = useLocalSearchParams();

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [idFilme, setIdFilme] = useState("");
  const [filmeSessao, setFilmeSessao] = useState("");
  const [dataSessao, setDataSessao] = useState("");
  const [horarioSessao, setHorarioSessao] = useState("");
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [filmesEmCartaz, setFilmesEmCartaz] = useState<string[]>([]);
  const [sessoes, setSessoes] = useState<{ idFilme: string; data: string; horario: string }[]>([]);
  const [erroSessao, setErroSessao] = useState("");
  const [erroCinema, setErroCinema] = useState("");

  // Validação: todos os campos devem estar preenchidos
  const isCinemaPronto = !!(nome.trim() && cidade.trim() && endereco.trim() && latitude.trim() && longitude.trim() && urlImagem.trim());

  useEffect(() => {
    if (editId) {
      const loadCinema = async () => {
        try {
          const docRef = doc(db, 'cinemas', editId as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setNome(data.nome || "");
            setCidade(data.cidade || "");
            setEndereco(data.endereco || "");
            if (data.coordinates) {
              setLatitude(String(data.coordinates.latitude || ""));
              setLongitude(String(data.coordinates.longitude || ""));
            }
            const imagemUrl = data.url_imagem || data.imagem || "";
            setUrlImagem(imagemUrl);
            setFilmesEmCartaz(data.filmesEmCartaz || []);
          }
        } catch (error) {
          console.error("Erro ao carregar cinema:", error);
        }
      };
      loadCinema();
    }
  }, [editId]);

  const handleAdicionarFilme = () => {
    if (!idFilme.trim()) {
      Alert.alert("Aviso", "Digite o ID do filme antes de adicionar.");
      return;
    }
    setFilmesEmCartaz(prev => [...prev, idFilme.trim()]);
    setIdFilme("");
  };

  const handleAdicionarSessao = () => {
    setErroSessao(""); 
    if (!filmeSessao || filmesEmCartaz.length === 0) {
      setErroSessao("Selecione um filme.");
      return;
    }
    try {
      Sessao.createSessao({ idFilme: filmeSessao, data: dataSessao, horario: horarioSessao });
      setSessoes(prev => [...prev, { idFilme: filmeSessao, data: dataSessao, horario: horarioSessao }]);
      setDataSessao("");
      setHorarioSessao("");
    } catch (error: any) {
      setErroSessao(error.message);
    }
  };

  const handleConfirmar = async () => {
    setErroCinema(""); 
    if (!isCinemaPronto) {
      setErroCinema("Preencha todos os dados.");
      return; 
    }

    try {
      const sessoesInstanciadas = sessoes.map(s => Sessao.createSessao({ idFilme: s.idFilme, data: s.data, horario: s.horario }));
      
      // Cria a instância base com a URL diretamente
      const cinemaInstancia = Cinema.createCinema({ 
          nome, cidade, endereco, latitude, longitude, urlImagem, filmesEmCartaz, sessoes: sessoesInstanciadas 
      });

      const dadosParaSalvar = cinemaInstancia.toFirestore();

      if (editId) {
        // --- BUSCAR DADOS ATUAIS ANTES DE ATUALIZAR ---
        const docRef = doc(db, 'cinemas', editId as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const dadosAtuais = docSnap.data();
            
            // Mescla os novos dados com os campos de avaliação e comentários que já existiam
            const updatePayload = {
                ...dadosParaSalvar,
                avaliacao: dadosAtuais.avaliacao || 0,
                comentarios: dadosAtuais.comentarios || []
            };
            
            await updateDoc(docRef, updatePayload);
            Alert.alert("Sucesso!", "Cinema atualizado.");
        }
      } else {
        await registerCinema(cinemaInstancia);
        Alert.alert("Sucesso!", "Cinema cadastrado.");
      }
      router.back(); 
    } catch (error: any) {
      setErroCinema(error.message);
    }
  };

  return (
    <View style={miscStyle.background}>
      <TouchableOpacity style={styles.backButtonContainer} onPress={() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/cinemas'); 
        }
      }}>
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
            {/* Input para colocar a URL da imagem */}
            <LocalInput text="URL da Imagem (Link HTTP)" value={urlImagem} onChangeText={setUrlImagem} />
            
            {/* Pré-visualização da imagem caso haja uma URL inserida */}
            {urlImagem ? (
              <Image 
                source={{ uri: urlImagem }} 
                style={{ 
                  width: '100%', 
                  height: 180, 
                  borderRadius: 12, 
                  marginTop: 15 
                }} 
                resizeMode="cover"
              />
            ) : null}
          </View>

          <View 
            style={[styles.grayBoxContainer, !isCinemaPronto && { opacity: 0.4 }]}
            pointerEvents={isCinemaPronto ? "auto" : "none"}
          >
            <Text style={styles.grayBoxTitle}>Adicionar Filmes em Cartaz</Text>
            
            <View style={styles.fullInput}>
              <LocalInput text="ID do Filme" value={idFilme} onChangeText={setIdFilme} />
            </View>

            <View style={styles.buttonWrapper}>
              <ButtonY title="Adicionar" onPress={handleAdicionarFilme} />
            </View>
          </View>

          <View 
            style={[styles.grayBoxContainer, { zIndex: 50, elevation: 5 }, !isCinemaPronto && { opacity: 0.4 }]}
            pointerEvents={isCinemaPronto ? "auto" : "none"}
          >
            <Text style={styles.grayBoxTitle}>Adicionar Sessões</Text>
            
            <View style={[styles.sessionRow, { zIndex: 100, elevation: 10 }]}>

              <View style={{ flex: 2, zIndex: 999, elevation: 15 }}> 
                <TouchableOpacity 
                  style={[componentStyle.inputContainer, styles.mockDropdown]}
                  onPress={() => setDropdownAberto(!dropdownAberto)}
                >
                  <Text style={styles.dropdownText} numberOfLines={1}>
                    {filmeSessao || "Selecione..."}
                  </Text>
                  <Text style={styles.dropdownIcon}>{dropdownAberto ? "▲" : "▼"}</Text>
                </TouchableOpacity>

                {dropdownAberto && filmesEmCartaz.length > 0 && (
                  <ScrollView style={styles.dropdownListaBox} nestedScrollEnabled={true}>
                    {filmesEmCartaz.map((filme, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.dropdownItem}
                        onPress={() => {
                          setFilmeSessao(filme);
                          setDropdownAberto(false); 
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{filme}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
              
              <View style={styles.sessionSmallInput}>
                <LocalInput text="Data" value={dataSessao} onChangeText={setDataSessao} />
              </View>
              <View style={styles.sessionSmallInput}>
                <LocalInput text="Hora" value={horarioSessao} onChangeText={setHorarioSessao} />
              </View>
            </View>
            {erroSessao ? <Text style={styles.errorText}>{erroSessao}</Text> : null}
            <View style={[styles.buttonWrapper, { zIndex: -1, elevation: 0 }]}>
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
              {sessoes.length === 0 ? (
                <Text style={styles.mockListText}>Nenhuma sessão adicionada ainda.</Text>
              ) : (
                sessoes.map((sessao, index) => (
                  <Text key={index} style={styles.mockListText}>
                    {sessao.idFilme} - Data: {sessao.data} - Horário: {sessao.horario}
                  </Text>
                ))
              )}
            </ScrollView>
          </View>
          {erroCinema ? <Text style={styles.errorText}>{erroCinema}</Text> : null}
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

  dropdownListaBox: {
    position: 'absolute',
    top: 55, 
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderColor: COLORS.orange, 
    borderWidth: 2,
    borderRadius: 10,
    maxHeight: 120, 
    zIndex: 999, 
    elevation: 5, 
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dropdownItemText: {
    color: '#333333',
    fontSize: width * 0.035,
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
  },

  errorText: {
    color: COLORS.gold, 
    fontSize: width * 0.035,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  }
});