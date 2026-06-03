import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Modal, ActivityIndicator, TextInput, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'; 
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY'; 
import { useUser } from '@/contexts/UserContext';
import { db, auth } from '@/config/firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

import { movieStyle } from '@/styles/movie'; 
import { textStyle } from '@/styles/text';
import { cinemaDetailsStyle } from '@/styles/cinemadetails';
import { COLORS } from '@/constants/colors';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

const DynamicStarsDisplay = ({ rating }: { rating: number }) => {
    const fills = Array.from({ length: 5 }, (_, i) => Math.max(0, Math.min(1, rating - i)));
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {fills.map((fill, index) => (
                <View key={index} style={{ position: 'relative', width: 22, height: 22, marginRight: 2 }}>
                    <Text style={{ position: 'absolute', color: '#666', fontSize: 20 }}>★</Text>
                    <View style={{ width: `${fill * 100}%`, overflow: 'hidden' }}>
                        <Text style={{ color: '#FFFEB2', fontSize: 20 }}>★</Text>
                    </View>
                </View>
            ))}
            <Text style={{ color: '#FFF', marginLeft: 8, fontSize: 14, fontFamily: 'Poppins-Regular' }}>{rating.toFixed(1)}/5.0</Text>
        </View>
    );
};

export default function CinemaDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { user } = useUser();

  const [cinema, setCinema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [myReview, setMyReview] = useState('');
  const [userRating, setUserRating] = useState(0); 
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  // ESTADO QUE FORÇA O REDESENHO DOS BOTÕES DE ADMIN
  const [isAdmin, setIsAdmin] = useState(false);

  const [filmesCartazReal, setFilmesCartazReal] = useState<any[]>([]);

  useEffect(() => {
    const fetchCinema = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'cinemas', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCinema({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Erro ao buscar cinema:", error);
      } finally {
        setLoading(false);
      }
    };

    const verifyAdmin = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.isAdm === true || data.isAdmin === true) {
              setIsAdmin(true); // Ativa os botões na tela
            }
          }
        } catch (error) {
          console.error("Erro ao verificar admin:", error);
        }
      }
    };

    fetchCinema();
    verifyAdmin();

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn("Erro de geolocalização", err)
      );
    }
  }, [id]);

  useEffect(() => {
    const fetchFilmesDetalhados = async () => {
      if (cinema?.filmesEmCartaz && cinema.filmesEmCartaz.length > 0) {
        try {
          const listaFilmesBuscados = [];
          for (const filmeId of cinema.filmesEmCartaz) {
            const filmeRef = doc(db, 'filmes', filmeId);
            const filmeSnap = await getDoc(filmeRef);
            if (filmeSnap.exists()) {
              const dadosFilme = filmeSnap.data();
              
              let pathImg = dadosFilme.url_imagem || dadosFilme.imagem || dadosFilme.poster_path || null;
              if (pathImg && pathImg.startsWith('/')) {
                 pathImg = `https://image.tmdb.org/t/p/w500${pathImg}`;
              }
              const movieTitle = dadosFilme.nome || dadosFilme.titulo || dadosFilme.title || dadosFilme.original_title || "Filme sem título";

              listaFilmesBuscados.push({
                id: filmeId,
                nome: movieTitle,
                image: pathImg
              });
            }
          }
          setFilmesCartazReal(listaFilmesBuscados);
        } catch (error) {
          console.error("Erro ao carregar os filmes do cartaz:", error);
        }
      } else {
        setFilmesCartazReal([]);
      }
    };

    fetchFilmesDetalhados();
  }, [cinema]);

  const handleDeleteCinema = async () => {
    if (!adminPassword) {
      Alert.alert("Aviso", "Digite a senha para confirmar.");
      return;
    }

    if (isAdmin) {
      try {
        await deleteDoc(doc(db, 'cinemas', id as string));
        setShowDeleteModal(false);
        router.replace('/cinemas');
      } catch (error) {
        console.error("Erro ao deletar:", error);
        Alert.alert("Erro", "Falha ao deletar cinema. Verifique sua permissão.");
      }
    } else {
      Alert.alert("Acesso Negado", "Você não tem permissão para deletar este cinema.");
    }
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) return alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
    if (!myReview.trim()) return alert("Por favor, escreva um comentário.");
    if (!user && !auth.currentUser) return alert("Você precisa estar logado para avaliar.");

    try {
        setIsSubmittingReview(true);
        
        const userName = typeof (user as any)?.getName === 'function' ? (user as any).getName() : ((user as any)?.name || "Usuário");
        const userPic = typeof (user as any)?.getProfilePicture === 'function' ? (user as any).getProfilePicture() : ((user as any)?.profile_picture || "");

        const newComment = { user: userName, profilePic: userPic, rating: userRating, comment: myReview.trim(), createdAt: new Date().toISOString() };
        const currentComments = cinema.comentarios || [];
        const updatedComments = [newComment, ...currentComments]; 
        
        const totalRating = updatedComments.reduce((acc, curr) => acc + curr.rating, 0);
        const newAverage = totalRating / updatedComments.length;

        const docRef = doc(db, 'cinemas', id as string);
        await updateDoc(docRef, { comentarios: updatedComments, avaliacao: newAverage });

        setCinema({ ...cinema, comentarios: updatedComments, avaliacao: newAverage });
        setMyReview('');
        setUserRating(0);
        
        if (Platform.OS === 'web') window.alert("Avaliação enviada com sucesso!");
        else Alert.alert("Sucesso", "Sua avaliação foi enviada!");

    } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
        alert("Erro ao enviar avaliação. Tente novamente.");
    } finally {
        setIsSubmittingReview(false);
    }
  };

  const navigateToMap = () => { router.push({ pathname: '/map', params: { focusId: id } }); };

  if (loading) return <View style={[cinemaDetailsStyle.mainContainer, { justifyContent: 'center' }]}><ActivityIndicator size="large" color="#FFFEB2" /></View>;
  if (!cinema) return <View style={cinemaDetailsStyle.mainContainer}><Text style={textStyle.detailsTitleText}>Cinema não encontrado</Text></View>;

  let distanciaText = "Calculando...";
  if (userLocation) {
    const lat = cinema.coordinates?.latitude ?? cinema.latitude;
    const lng = cinema.coordinates?.longitude ?? cinema.longitude;
    if (lat !== undefined && lng !== undefined) {
      distanciaText = `${calculateDistance(userLocation[0], userLocation[1], lat, lng)} km`;
    }
  }

  return (
    <View style={cinemaDetailsStyle.mainContainer}> 
      
      <View style={[movieStyle.filmesHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 20, paddingBottom: 15 }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 90, alignItems: 'flex-start' }}>
              <Image source={require("@/screenAssets/back-icon-buttom.svg")} style={{ width: 50, height: 50 }} resizeMode="contain" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: 'center' }}>
              <Image source={require('@/screenAssets/logo/full-logo.png')} style={{ width: 140, height: 70, resizeMode: 'contain' }} />
          </View>

          <View style={{ width: 90, flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              {isAdmin && (
                  <>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/addTheater', params: { editId: id } })} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: COLORS.gold, justifyContent: 'center', alignItems: 'center' }}>
                        <Feather name="edit" size={18} color={COLORS.gold} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowDeleteModal(true)} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: COLORS.gold, justifyContent: 'center', alignItems: 'center' }}>
                        <Feather name="trash-2" size={18} color={COLORS.gold} />
                    </TouchableOpacity>
                  </>
              )}
          </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never" contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ width: '100%', height: 250 }}>
            {cinema.url_imagem || cinema.imagem ? (
              <Image source={{ uri: cinema.url_imagem || cinema.imagem }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            ) : (
              <Image source={require('@/screenAssets/movie-tape.svg')} style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.5 }} />
            )}
        </View>

        <View style={cinemaDetailsStyle.contentWrapper}>
            <View style={cinemaDetailsStyle.titleRow}>
                <Text style={cinemaDetailsStyle.cinemaName} numberOfLines={2}>{cinema.nome}</Text>
                <TouchableOpacity style={cinemaDetailsStyle.mapButton} onPress={navigateToMap}>
                    <Image source={require("@/screenAssets/Map-Buttom.svg")} style={{ width: 20, height: 20, marginRight: 5 }} resizeMode="contain" />
                    <Text style={cinemaDetailsStyle.mapDistanceText}>{distanciaText}</Text>
                </TouchableOpacity>
            </View>
            
            <View style={{ height: 1, backgroundColor: '#FFF', width: '100%', marginVertical: 10 }} />
            
            <View style={{ marginBottom: 20 }}><DynamicStarsDisplay rating={cinema.avaliacao || 0} /></View>

            <Text style={cinemaDetailsStyle.sectionTitle}>Filmes em Cartaz</Text>
            <FlatList 
                horizontal 
                data={filmesCartazReal} 
                keyExtractor={(item) => item.id} 
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={cinemaDetailsStyle.moviePosterWrapper}>
                        {item.image ? (
                          <Image source={{ uri: item.image }} style={cinemaDetailsStyle.moviePoster} />
                        ) : (
                          <View style={[cinemaDetailsStyle.moviePoster, { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }]}>
                             <Feather name="image" size={30} color="#666" />
                          </View>
                        )}
                        <Text style={cinemaDetailsStyle.movieName} numberOfLines={2}>{item.nome}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={textStyle.detailsInfoLabel}>Nenhum filme em cartaz no momento.</Text>}
            />

            <View style={cinemaDetailsStyle.btnSessoesWrapper}><ButtonY title="Ver Sessões" onPress={() => console.log('Abre Sessões')} /></View>

            <View style={[movieStyle.detailsSectionGrey, { marginTop: 30, padding: 15, borderRadius: 10 }]}>
                <Text style={[textStyle.detailsSectionTitle, { textAlign: 'center', marginBottom: 15 }]}>Avaliar Cinema</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setUserRating(star)} style={{ paddingHorizontal: 5 }}>
                            <Text style={{ fontSize: 36, color: star <= userRating ? '#FFFEB2' : '#666' }}>★</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <TextInput placeholder="Escreva sua avaliação..." placeholderTextColor="#999" value={myReview} onChangeText={(text) => { if (text.length <= 300) setMyReview(text); }} multiline={true} textAlignVertical="top" style={{ width: '100%', maxWidth: 350, height: 100, backgroundColor: '#FFF', borderRadius: 8, padding: 12, color: '#000', fontFamily: 'Poppins-Regular' }} />
                    <View style={{ width: '100%', maxWidth: 350, alignItems: 'flex-end' }}>
                        <Text style={{color: '#999', fontSize: 10, marginTop: 5, marginBottom: 15}}>{myReview.length}/300</Text>
                    </View>
                </View>
                
                <View style={movieStyle.detailsButtonWrapper}>
                    {isSubmittingReview ? <ActivityIndicator size="small" color="#FFFEB2" /> : <ButtonY title="Avaliar" onPress={handleSubmitReview} />}
                </View>
            </View>

            <View style={movieStyle.detailsSectionGrey}>
                <Text style={textStyle.detailsSectionTitle}>Avaliações e Comentários</Text>
                {cinema.comentarios && cinema.comentarios.length > 0 ? cinema.comentarios.map((rev: any, index: number) => (
                    <View key={index} style={movieStyle.detailsReviewItem}>
                        <View style={movieStyle.detailsReviewAvatar}>
                            {rev.profilePic ? <Image source={{ uri: rev.profilePic }} style={{ width: '100%', height: '100%', borderRadius: 25 }} /> : <Feather name="user" size={24} color="#2A0800" />}
                        </View>
                        <View style={movieStyle.detailsReviewContent}>
                            <Text style={textStyle.detailsReviewUser}>{rev.user || "Usuário"} <Text style={textStyle.detailsReviewStars}>{'★'.repeat(rev.rating || 5) + '☆'.repeat(5 - (rev.rating || 5))}</Text></Text>
                            <Text style={textStyle.detailsReviewText} numberOfLines={10}>{rev.comment}</Text>
                        </View>
                    </View>
                )) : <Text style={[textStyle.detailsInfoLabel, {textAlign: 'center', marginVertical: 10}]}>Nenhuma avaliação ainda. Seja o primeiro!</Text>}
            </View>
        </View>
      </ScrollView>

      <Modal visible={showDeleteModal} transparent={true} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <View style={{ width: '90%', maxWidth: 320, backgroundColor: COLORS.primaryDark, padding: 20, borderRadius: 15, alignItems: 'center' }}>
                <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Poppins-Bold', marginBottom: 10 }}>Confirmar Exclusão</Text>
                <Text style={{ color: '#CCC', fontSize: 14, fontFamily: 'Poppins-Bold', textAlign: 'center', marginBottom: 20 }}>Digite a senha de administrador:</Text>
                <TextInput secureTextEntry value={adminPassword} onChangeText={setAdminPassword} style={{ width: '100%', backgroundColor: '#FFF', padding: 10, fontFamily: 'Poppins-Bold', borderRadius: 5, marginBottom: 20 }} />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={{ padding: 10, backgroundColor: '#444', borderRadius: 5 }}><Text style={{color: '#FFF', fontFamily: 'Poppins-Bold'}}>Cancelar</Text></TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteCinema} style={{ padding: 10, backgroundColor: '#B22300', borderRadius: 5 }}><Text style={{color: '#FFF', fontFamily: 'Poppins-Bold'}}>Confirmar</Text></TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
      
      <BottomNavbar />
    </View>
  );
}