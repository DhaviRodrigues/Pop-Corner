import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator, Platform, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY';
import { AdminEditButton } from '@/components/AdminEditButton';
import { AdminDeleteButton } from '@/components/AdminDeleteButton';
import { ValidationPopup } from '@/components/ValidationPopup';
import { BackButton } from '@/components/BackButton';
import { useAuth } from '@/contexts/UserContext';
import { CinemaService } from '@/services/cinemaService';
import { ReviewService } from '@/services/reviewservice';
import { MovieService } from '@/services/movieservice';
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
                        <Text style={{ color: COLORS.gold, fontSize: 20 }}>★</Text>
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
  const { user, refreshUser, isAdmin } = useAuth();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  
  const [cinema, setCinema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myReview, setMyReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [filmesCartazReal, setFilmesCartazReal] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const fetchCinema = async () => {
    if (!id) return;
    const data = await CinemaService.getCinemaById(id as string);
    setCinema(data);
    
    if (data && data.filmesEmCartaz && data.filmesEmCartaz.length > 0) {
      const allMovies = await MovieService.getAllMovies();
      const filmesReais = allMovies.filter(m => data.filmesEmCartaz.includes(m.id));
      setFilmesCartazReal(filmesReais);
    }
    setLoading(false);
  };

  useEffect(() => { 
    fetchCinema(); 
    if (typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
          (err) => console.warn("Erro de geolocalização", err)
        );
    }
  }, [id]);

  const handleSubmitReview = async () => {
    if (!user || userRating === 0 || !myReview.trim()) return;

    try {
        setIsSubmittingReview(true);
        const userName = (user as any)?.name || "Usuário"; 
        const newReviewId = Date.now().toString();

    const profilePic = typeof (user as any)?.getProfilePicture === 'function' 
    ? (user as any).getProfilePicture() 
    : ((user as any)?.profile_picture || "");

    const reviewPayload = {
        id: newReviewId,
        author: userName,
        rating: userRating,
        text: myReview.trim(),
        date: new Date().toISOString(),
        profilePic: profilePic
    };

        const result = await ReviewService.addReviewToCinema(id as string, reviewPayload);

        if (!result.valid) {
            setPopupMessage(result.error);
            setPopupVisible(true);
            return;
        }

        const novoComentarioFormatado = {
            id: newReviewId,
            user: userName,
            rating: userRating,
            comment: myReview.trim(),
            date: new Date().toISOString()
        };

        setCinema((prevCinema: any) => {
            if (!prevCinema) return prevCinema;
            const listaAntiga = prevCinema.comentarios || prevCinema.comments || [];
            return {
                ...prevCinema,
                comentarios: [novoComentarioFormatado, ...listaAntiga]
            };
        });

        setMyReview('');
        setUserRating(0);
        setPopupMessage("Avaliação enviada com sucesso! Você ganhou 350 pipokas!");
        setPopupVisible(true);
        
        await refreshUser();
    } catch (error: any) {
        setPopupMessage("Erro ao enviar avaliação.");
        setPopupVisible(true);
    } finally {
        setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
        const result = await ReviewService.deleteCinemaReview(String(id), reviewId);
        
        if (result.valid) {
            setPopupMessage("Comentário removido com sucesso!");
            setPopupVisible(true);

            setCinema((prevCinema: any) => {
                if (!prevCinema) return prevCinema;
                const listaAntiga = prevCinema.comentarios || prevCinema.comments || [];
                const listaFiltrada = listaAntiga.filter((rev: any) => (rev.id !== reviewId && rev.date !== reviewId));
                
                return {
                    ...prevCinema,
                    comentarios: listaFiltrada
                };
            });
        } else {
            setPopupMessage(result.error || "Erro ao tentar remover o comentário.");
            setPopupVisible(true);
        }
    } catch (error) {
        console.error("Erro ao deletar avaliação do cinema:", error);
        setPopupMessage("Erro ao tentar remover o comentário.");
        setPopupVisible(true);
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
  const cinemaName = cinema.nome || cinema.name || "Cinema";
  const cinemaImage = cinema.url_imagem || cinema.imagem || cinema.image;
  const cinemaRating = cinema.avaliacao || cinema.rating || 0;
  const cinemaComments = cinema.comentarios || cinema.comments || [];

  return (
    <View style={cinemaDetailsStyle.mainContainer}> 
      
      <View style={[movieStyle.filmesHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 20, paddingBottom: 15 }]}>
          <BackButton style={{ width: 90, alignItems: 'flex-start' }} />

          <View style={{ flex: 1, alignItems: 'center' }}>
              <Image source={require('@/screenAssets/logo/full-logo.png')} style={{ width: 140, height: 70, resizeMode: 'contain' }} />
          </View>

          <View style={{ width: 90, flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              {isAdmin && (
                  <>
                    <AdminEditButton onPress={() => router.push({ pathname: '/addTheater', params: { editId: id } })} />
                    <AdminDeleteButton 
                        onConfirmDelete={async (password: string) => {
                            const result = await CinemaService.deleteCinema(id as string, password);
                            if (!result.valid) {
                                alert(result.error || "Erro ao deletar cinema.");
                            } else {
                                router.replace('/(tabs)/cinemas');
                            }
                        }} 
                    />
                  </>
              )}
          </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never" contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ width: '100%', height: 250 }}>
            {cinemaImage ? (
              <Image source={{ uri: cinemaImage }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            ) : (
              <Image source={require('@/screenAssets/movie-tape.png')} style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.5 }} />
            )}
        </View>

        <View style={cinemaDetailsStyle.contentWrapper}>
            <View style={cinemaDetailsStyle.titleRow}>
                <Text style={cinemaDetailsStyle.cinemaName} numberOfLines={2}>{cinemaName}</Text>
                <TouchableOpacity style={cinemaDetailsStyle.mapButton} onPress={navigateToMap}>
                    <Image source={require("@/screenAssets/Map-Buttom.png")} style={{ width: 20, height: 20, marginRight: 5 }} resizeMode="contain" />
                    <Text style={cinemaDetailsStyle.mapDistanceText}>{distanciaText}</Text>
                </TouchableOpacity>
            </View>
            
            <View style={{ height: 1, backgroundColor: '#FFF', width: '100%', marginVertical: 10 }} />
            
            <View style={{ marginBottom: 20 }}><DynamicStarsDisplay rating={cinemaRating} /></View>

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
                          <View style={[cinemaDetailsStyle.moviePoster, { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }]} />
                        )}
                        <Text style={cinemaDetailsStyle.movieName} numberOfLines={2}>{item.title || item.titulo || item.nome}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={textStyle.detailsInfoLabel}>Nenhum filme em cartaz no momento.</Text>}
            />

            <View style={cinemaDetailsStyle.btnSessoesWrapper}>
               <ButtonY 
                 title="Ver Sessões" 
                 onPress={() => router.push({
                   pathname: '/sessions', 
                   params: { cinemaId: id } 
                 })} 
               />
            </View>

            <View style={[movieStyle.detailsSectionGrey, { marginTop: 30, padding: 15, borderRadius: 10 }]}>
                <Text style={[textStyle.detailsSectionTitle, { textAlign: 'center', marginBottom: 15 }]}>Avaliar Cinema</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setUserRating(star)} style={{ paddingHorizontal: 5 }}>
                            <Text style={{ fontSize: 36, color: star <= userRating ? COLORS.gold : '#666' }}>★</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <TextInput placeholder="Escreva sua avaliação..." placeholderTextColor="#999" value={myReview} onChangeText={(text: string) => { if (text.length <= 300) setMyReview(text); }} multiline={true} textAlignVertical="top" style={{ width: '100%', maxWidth: 350, height: 100, backgroundColor: '#FFF', borderRadius: 8, padding: 12, color: '#000', fontFamily: 'Poppins-Regular' }} />
                    <View style={{ width: '100%', maxWidth: 350, alignItems: 'flex-end' }}>
                        <Text style={{color: '#999', fontSize: 10, marginTop: 5, marginBottom: 15}}>{myReview.length}/300</Text>
                    </View>
                </View>
                
                <View style={movieStyle.detailsButtonWrapper}>
                    {isSubmittingReview ? <ActivityIndicator size="small" color={COLORS.gold} /> : <ButtonY title="Avaliar" onPress={handleSubmitReview} />}
                </View>
            </View>

            <View style={movieStyle.detailsSectionGrey}>
                <Text style={textStyle.detailsSectionTitle}>Avaliações e Comentários</Text>
                {cinemaComments.length > 0 ? cinemaComments.map((rev: any, index: number) => {
                    const reviewIdentifier = rev.id || rev.date || index.toString();
                    return (
                        <View key={reviewIdentifier} style={[movieStyle.detailsReviewItem, { position: 'relative', width: '100%' }]}>
                            <View style={movieStyle.detailsReviewAvatar} />
                            <View style={movieStyle.detailsReviewContent}>
                                <Text style={textStyle.detailsReviewUser}>
                                    {rev.user || "Usuário"}{' '}
                                    <Text style={textStyle.detailsReviewStars}>
                                        {'★'.repeat(rev.rating || 5) + '☆'.repeat(5 - (rev.rating || 5))}
                                    </Text>
                                </Text>
                                <Text style={textStyle.detailsReviewText} numberOfLines={10}>{rev.comment}</Text>
                            </View>

                            {isAdmin && (
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        top: 15,
                                        right: 15,
                                        zIndex: 10,
                                        padding: 5,
                                    }}
                                    onPress={() => handleDeleteReview(reviewIdentifier)}
                                    activeOpacity={0.7}
                                >
                                    <Image
                                        source={require('@/screenAssets/trashbin.png')}
                                        style={{ width: 18, height: 18, tintColor: COLORS.red }}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                }) : <Text style={[textStyle.detailsInfoLabel, {textAlign: 'center', marginVertical: 10}]}>Nenhuma avaliação ainda. Seja o primeiro!</Text>}
            </View>
        </View>
      </ScrollView>

      <ValidationPopup visible={popupVisible} message={popupMessage} onClose={() => setPopupVisible(false)} />
      <BottomNavbar />
    </View>
  );
}