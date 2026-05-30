import { logoStyle } from "@/styles/logo";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";
import { componentStyle } from "@/styles/component";
import { COLORS } from "@/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
import { Cinema } from "@/types/cinema";
import { Sessao } from "@/types/sessao";
import { registerCinema } from "@/services/cinemaService";
import { ButtonY } from "../components/ButtonY";
import BottomNavbar from "../components/Navbar";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";

function LocalInput({
  text,
  value,
  onChangeText,
}: {
  text: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View
      style={[
        componentStyle.inputContainer,
        { width: "100%", overflow: "hidden" },
      ]}
    >
      <TextInput
        placeholder={text}
        placeholderTextColor="#A9A9A9"
        style={[
          componentStyle.inputText,
          {
            flex: 1,
            flexShrink: 1,
            minWidth: 0,
            width: "100%",
            outlineStyle: "none",
            fontFamily: "Poppins-Regular",
          } as any,
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
  const { editId } = useLocalSearchParams();

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [isParceiro, setIsParceiro] = useState(false);

  const [searchMovieQuery, setSearchMovieQuery] = useState("");
  const [availableMovies, setAvailableMovies] = useState<any[]>([]);
  const [filmesEmCartaz, setFilmesEmCartaz] = useState<string[]>([]);

  const [filmeSessao, setFilmeSessao] = useState("");
  const [dataSessao, setDataSessao] = useState("");
  const [horarioSessao, setHorarioSessao] = useState("");
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [sessoes, setSessoes] = useState<
    { idFilme: string; data: string; horario: string }[]
  >([]);
  const [erroSessao, setErroSessao] = useState("");
  const [erroCinema, setErroCinema] = useState("");

  const isCinemaPronto = !!(
    nome.trim() &&
    cidade.trim() &&
    endereco.trim() &&
    latitude.trim() &&
    longitude.trim() &&
    urlImagem.trim()
  );

  useEffect(() => {
    const fetchMoviesAndCinema = async () => {
      try {
        const snap = await getDocs(collection(db, "filmes"));
        const movies = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAvailableMovies(movies);

        if (editId) {
          const docRef = doc(db, "cinemas", editId as string);
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
            setUrlImagem(data.url_imagem || data.imagem || "");
            setIsParceiro(data.is_parceiro || data.isParceiro || false);
            setFilmesEmCartaz(data.filmesEmCartaz || []);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    fetchMoviesAndCinema();
  }, [editId]);

  const getMovieTitle = (movie: any) => {
    if (!movie) return "Filme Desconhecido";
    return (
      movie.title ||
      movie.nome ||
      movie.titulo ||
      movie.original_title ||
      "Filme sem Título"
    );
  };

  const getMovieImage = (movie: any) => {
    if (!movie) return null;
    const path =
      movie.image ||
      movie.url_imagem ||
      movie.imagem ||
      movie.poster_path ||
      movie.backdrop_path;
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return `https://image.tmdb.org/t/p/w500${path}`;
    return null;
  };

  const getMovieData = (id: string) => {
    return availableMovies.find((m) => m.id === id);
  };

  const handleAdicionarSessao = () => {
    setErroSessao("");
    if (!filmeSessao || filmesEmCartaz.length === 0) {
      setErroSessao("Selecione um filme válido do cartaz.");
      return;
    }
    try {
      Sessao.createSessao({
        idFilme: filmeSessao,
        data: dataSessao,
        horario: horarioSessao,
      });
      setSessoes((prev) => [
        ...prev,
        { idFilme: filmeSessao, data: dataSessao, horario: horarioSessao },
      ]);
      setDataSessao("");
      setHorarioSessao("");
    } catch (error: any) {
      setErroSessao(error.message);
    }
  };

  const handleConfirmar = async () => {
    setErroCinema("");
    if (!isCinemaPronto) {
      setErroCinema("Preencha todos os dados básicos.");
      return;
    }

    try {
      const sessoesInstanciadas = sessoes.map((s) =>
        Sessao.createSessao({
          idFilme: s.idFilme,
          data: s.data,
          horario: s.horario,
        }),
      );

      const cinemaInstancia = Cinema.createCinema({
        nome,
        cidade,
        endereco,
        latitude,
        longitude,
        urlImagem,
        filmesEmCartaz,
        sessoes: sessoesInstanciadas,
        isParceiro,
      });

      const dadosParaSalvar = cinemaInstancia.toFirestore();

      if (editId) {
        const docRef = doc(db, "cinemas", editId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dadosAtuais = docSnap.data();
          const updatePayload = {
            ...dadosParaSalvar,
            avaliacao: dadosAtuais.avaliacao || 0,
            comentarios: dadosAtuais.comentarios || [],
          };
          await updateDoc(docRef, updatePayload);
          Alert.alert("Sucesso!", "Cinema atualizado.");
        }
      } else {
        await registerCinema(cinemaInstancia);
        Alert.alert("Sucesso!", "Cinema cadastrado.");
      }

      if (router.canGoBack()) router.back();
      else router.replace("/cinemas");
    } catch (error: any) {
      setErroCinema(error.message);
    }
  };

  const filteredMovies = availableMovies.filter((m) => {
    const title = getMovieTitle(m);
    return title.toLowerCase().includes(searchMovieQuery.toLowerCase());
  });

  return (
    <View style={miscStyle.background}>
      <TouchableOpacity
        style={styles.backButtonContainer}
        onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace("/cinemas");
        }}
      >
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
              <LocalInput
                text="Cidade"
                value={cidade}
                onChangeText={setCidade}
              />
            </View>
          </View>

          <View style={styles.fullInput}>
            <LocalInput
              text="Endereço"
              value={endereco}
              onChangeText={setEndereco}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <LocalInput
                text="Latitude"
                value={latitude}
                onChangeText={setLatitude}
              />
            </View>
            <View style={styles.halfInput}>
              <LocalInput
                text="Longitude"
                value={longitude}
                onChangeText={setLongitude}
              />
            </View>
          </View>

          <View style={styles.fullInput}>
            <LocalInput
              text="URL da Imagem (Link HTTP)"
              value={urlImagem}
              onChangeText={setUrlImagem}
            />
            {urlImagem ? (
              <Image
                source={{ uri: urlImagem }}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 12,
                  marginTop: 15,
                }}
                resizeMode="cover"
              />
            ) : null}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginTop: 5,
              marginBottom: 15,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: 16,
                fontFamily: "Poppins-Regular",
              }}
            >
              Cinema Parceiro Pop-Corner
            </Text>
            <Switch
              value={isParceiro}
              onValueChange={setIsParceiro}
              trackColor={{ false: "#555", true: COLORS.gold }}
              thumbColor={isParceiro ? COLORS.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
            />
          </View>

          <View
            style={[
              styles.grayBoxContainer,
              !isCinemaPronto && { opacity: 0.4 },
            ]}
            pointerEvents={isCinemaPronto ? "auto" : "none"}
          >
            <Text style={styles.grayBoxTitle}>Adicionar Filmes em Cartaz</Text>

            <View style={{ width: "100%" }}>
              <LocalInput
                text="Pesquisar filme..."
                value={searchMovieQuery}
                onChangeText={setSearchMovieQuery}
              />

              <View
                style={{
                  width: "100%",
                  height: 220,
                  backgroundColor: "#FFF",
                  borderRadius: 8,
                  borderWidth: 0,
                  borderColor: COLORS.primary,
                  marginTop: 10,
                  overflow: "hidden",
                }}
              >
                <ScrollView
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                >
                  {filteredMovies.map((movie) => {
                    const isAdded = filmesEmCartaz.includes(movie.id);
                    const mImg = getMovieImage(movie);
                    const mTitle = getMovieTitle(movie);

                    return (
                      <TouchableOpacity
                        key={movie.id}
                        style={{
                          flexDirection: "row",
                          padding: 10,
                          borderBottomWidth: 1,
                          borderColor: "#EEE",
                          alignItems: "center",
                          backgroundColor: isAdded ? "#F9F9F9" : "#FFF",
                        }}
                        onPress={() => {
                          if (!isAdded)
                            setFilmesEmCartaz((prev) => [...prev, movie.id]);
                          else
                            setFilmesEmCartaz((prev) =>
                              prev.filter((id) => id !== movie.id),
                            );
                        }}
                      >
                        {mImg ? (
                          <Image
                            source={{ uri: mImg }}
                            style={{
                              width: 40,
                              height: 60,
                              borderRadius: 4,
                              marginRight: 10,
                            }}
                          />
                        ) : (
                          <Image
                            source={require("@/screenAssets/movie-tape.svg")}
                            style={{
                              width: 40,
                              height: 60,
                              borderRadius: 4,
                              marginRight: 10,
                            }}
                          />
                        )}
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              color: "#000",
                              fontFamily: "Poppins-Bold",
                            }}
                          >
                            {mTitle}
                          </Text>
                          <Text
                            style={{
                              color: "#666",
                              fontSize: 12,
                              fontFamily: "Poppins-Regular",
                            }}
                          >
                            ★{" "}
                            {movie.rating ||
                              movie.avaliacao ||
                              movie.vote_average ||
                              0}
                          </Text>
                        </View>
                        {isAdded && (
                          <Text
                            style={{
                              color: COLORS.textMuted,
                              fontSize: 12,
                              fontFamily: "Poppins-Bold",
                            }}
                          >
                            ✓ Adicionado
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                  {filteredMovies.length === 0 && (
                    <Text
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "#999",
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                      Nenhum filme encontrado no banco.
                    </Text>
                  )}
                </ScrollView>
              </View>
            </View>

            <View style={{ marginTop: 15, gap: 10 }}>
              {filmesEmCartaz.map((id) => {
                const movie = getMovieData(id);
                if (!movie) return null;
                const mImg = getMovieImage(movie);
                const mTitle = getMovieTitle(movie);

                return (
                  <View
                    key={id}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#FFF",
                      padding: 8,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                  >
                    {mImg ? (
                      <Image
                        source={{ uri: mImg }}
                        style={{
                          width: 35,
                          height: 50,
                          borderRadius: 4,
                          marginRight: 10,
                        }}
                      />
                    ) : (
                      <Image
                        source={require("@/screenAssets/movie-tape.svg")}
                        style={{
                          width: 35,
                          height: 50,
                          borderRadius: 4,
                          marginRight: 10,
                        }}
                      />
                    )}
                    <Text
                      style={{
                        flex: 1,
                        color: "#000",
                        fontFamily: "Poppins-Bold",
                      }}
                    >
                      {mTitle}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setFilmesEmCartaz((prev) =>
                          prev.filter((x) => x !== id),
                        )
                      }
                    >
                      <Text
                        style={{
                          color: "#B22300",
                          padding: 5,
                          fontFamily: "Poppins-Bold",
                        }}
                      >
                        Remover
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          <View
            style={[
              styles.grayBoxContainer,
              { zIndex: 50, elevation: 5 },
              !isCinemaPronto && { opacity: 0.4 },
            ]}
            pointerEvents={isCinemaPronto ? "auto" : "none"}
          >
            <Text style={styles.grayBoxTitle}>Adicionar Sessões</Text>

            <View style={[styles.sessionRow, { zIndex: 100, elevation: 10 }]}>
              <View style={{ flex: 2, zIndex: 999, elevation: 15 }}>
                <TouchableOpacity
                  style={[componentStyle.inputContainer, styles.dropdownBox]}
                  onPress={() => setDropdownAberto(!dropdownAberto)}
                >
                  <Text style={styles.dropdownText} numberOfLines={1}>
                    {filmeSessao
                      ? getMovieTitle(getMovieData(filmeSessao))
                      : "Selecione..."}
                  </Text>
                  <Text style={styles.dropdownIcon}>
                    {dropdownAberto ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>

                {dropdownAberto && filmesEmCartaz.length > 0 && (
                  <ScrollView
                    style={styles.dropdownListaBox}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {filmesEmCartaz.map((filmeId, index) => {
                      const mTitle = getMovieTitle(getMovieData(filmeId));
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setFilmeSessao(filmeId);
                            setDropdownAberto(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{mTitle}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}
              </View>

              <View style={styles.sessionSmallInput}>
                <LocalInput
                  text="Data"
                  value={dataSessao}
                  onChangeText={setDataSessao}
                />
              </View>
              <View style={styles.sessionSmallInput}>
                <LocalInput
                  text="Hora"
                  value={horarioSessao}
                  onChangeText={setHorarioSessao}
                />
              </View>
            </View>
            {erroSessao ? (
              <Text style={styles.errorText}>{erroSessao}</Text>
            ) : null}
            <View style={[styles.buttonWrapper, { zIndex: -1, elevation: 0 }]}>
              <ButtonY title="Adicionar" onPress={handleAdicionarSessao} />
            </View>
          </View>

          <View style={styles.grayBoxContainer}>
            <Text style={styles.grayBoxTitle}>Sessões Atuais:</Text>
            <ScrollView
              style={styles.sessionsContainer}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {sessoes.length === 0 ? (
                <Text style={styles.sessionListText}>
                  Nenhuma sessão adicionada ainda.
                </Text>
              ) : (
                sessoes.map((sessao, index) => {
                  const mTitle = getMovieTitle(getMovieData(sessao.idFilme));
                  return (
                    <Text key={index} style={styles.sessionListText}>
                      {mTitle} - Data: {sessao.data} - Horário: {sessao.horario}
                    </Text>
                  );
                })
              )}
            </ScrollView>
          </View>
          {erroCinema ? (
            <Text style={styles.errorText}>{erroCinema}</Text>
          ) : null}
          <View style={{ marginTop: height * 0.03 }}>
            <ButtonY title="Confirmar" onPress={handleConfirmar} />
          </View>
        </View>
      </ScrollView>
      <BottomNavbar />
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    backButtonContainer: {
      position: "absolute",
      top: height * 0.06,
      left: width * 0.05,
      zIndex: 99,
    },
    backIcon: { width: width * 0.12, height: width * 0.12 },
    scrollContent: { paddingBottom: height * 0.2, paddingTop: height * 0.02 },
    formContainer: {
      width: width * 0.9,
      alignSelf: "center",
      alignItems: "center",
    },
    titleText: {
      marginVertical: height * 0.03,
      textAlign: "center",
      fontFamily: "Poppins-Bold",
    },
    row: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "center",
      gap: 10,
    },
    halfInput: { flex: 1 },
    fullInput: { width: "100%", marginVertical: height * 0.015 },
    grayBoxContainer: {
      width: "100%",
      backgroundColor: COLORS.textMuted,
      borderRadius: 20,
      padding: width * 0.04,
      marginTop: height * 0.02,
    },
    grayBoxTitle: {
      color: COLORS.black,
      marginBottom: height * 0.015,
      fontSize: width * 0.042,
      fontFamily: "Poppins-Bold",
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
    dropdownBox: {
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
      fontFamily: "Poppins-Regular",
    },
    dropdownIcon: {
      color: COLORS.textMuted,
      fontSize: width * 0.035,
      fontFamily: "Poppins-Regular",
    },
    sessionSmallInput: { flex: 1.2 },
    dropdownListaBox: {
      position: "absolute",
      top: 55,
      left: 0,
      right: 0,
      backgroundColor: COLORS.white,
      borderColor: COLORS.red,
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
      borderBottomColor: "#EEEEEE",
    },
    dropdownItemText: {
      color: "#333333",
      fontSize: width * 0.035,
      fontFamily: "Poppins-Regular",
    },
    sessionsContainer: {
      maxHeight: height * 0.15,
      backgroundColor: COLORS.white,
      borderRadius: 12,
      padding: 15,
    },
    sessionListText: {
      color: COLORS.textMuted,
      fontSize: width * 0.035,
      marginBottom: 8,
      fontFamily: "Poppins-Regular",
    },
    errorText: {
      color: COLORS.gold,
      fontSize: width * 0.035,
      textAlign: "center",
      marginBottom: 10,
      fontFamily: "Poppins-Regular",
    },
  });
