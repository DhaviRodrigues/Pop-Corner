import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator, Platform, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'; 
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY';
import { AdminEditButton } from '@/components/AdminEditButton';
import { AdminDeleteButton } from '@/components/AdminDeleteButton';
import { BackButton } from '@/components/BackButton';
import { useAuth } from '@/contexts/UserContext';
import { getCinemaById, deleteCinema, updateCinemaReviews } from '@/services/cinemaService';
import { getMovieById } from '@/services/movieservice';
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
  
  const { user, isAdmin } = useAuth();

  const [cinema, setCinema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [myReview, setMyReview] = useState('');
  const [userRating, setUserRating] = useState(0); 
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  const [filmesCartazReal, setFilmesCartazReal] = useState<any[]>([]);

  useEffect(() => {
    const fetchCinemaData = async () => {
      if (!id) return;
      try {
        const data = await getCinemaById(id as string);
        if (data) {
          setCinema(data);
        }
      } catch (error) {
        console.error("Erro ao carregar o cinema através do service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemaData();

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn("Erro de geolocalização", err)
      );
    }
  }, [id]);

  useEffect(() => {
    const fetchFilmesDetalhados = async () => {
      const listaFilmesIds = cinema?.filmesEmCartaz || cinema?.moviesInTheaters || [];
      
      if (listaFilmesIds.length > 0) {
        try {
          const listaFilmesBuscados = [];
          for (const filmeId of listaFilmesIds) {
            const dadosFilme = await getMovieById(filmeId);
            if (dadosFilme) {
              let pathImg = dadosFilme.image || dadosFilme.url_imagem || dadosFilme.poster_path || null;
              if (pathImg && pathImg.startsWith('/')) {
                 pathImg = `https://image.tmdb.org/t/p/w500${pathImg}`;
              }
              const movieTitle = dadosFilme.title || dadosFilme.titulo || dadosFilme.nome || "Filme sem título";

              listaFilmesBuscados.push({
                id: filmeId,
                nome: movieTitle,
                image: pathImg
              });
            }
          }
          setFilmesCartazReal(listaFilmesBuscados);
        } catch (error) {
          console.error("Erro ao carregar os filmes do cartaz pelo service:", error);
        }
      } else {
        setFilmesCartazReal([]);
      }
    };

    fetchFilmesDetalhados();
  }, [cinema]);

  const handleDeleteCinema = async (password: string) => {
    if (!isAdmin) {
      throw new Error("Not authorized");
    }

    try {
      const result = await deleteCinema(id as string, password);
      if (result.valid) {
        router.replace('/cinemas');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao deletar via service:", error);
      throw error;
    }
  };

  const handleSubmitReview = async () => {
    if (userRating === 0 || !myReview.trim() || !user) return;

    try {
        setIsSubmittingReview(true);
        
        const userName = typeof (user as any)?.getName === 'function' ? (user as any).getName() : ((user as any)?.name || "Usuário");
        const userPic = typeof (user as any)?.getProfilePicture === 'function' ? (user as any).getProfilePicture() : ((user as any)?.profile_picture || "");

        const newComment = { 
          user: userName, 
          profilePic: userPic, 
          rating: userRating, 
          comment: myReview.trim(), 
          createdAt: new Date().toISOString() 
        };
        
        const currentComments = cinema.comentarios || cinema.comments || [];
        const updatedComments = [newComment, ...currentComments]; 
        
        const totalRating = updatedComments.reduce((acc, curr) => acc + curr.rating, 0);
        const newAverage = totalRating / updatedComments.length;

        // Delega a atualização do documento e cálculos de média para o cinemaService
        const result = await updateCinemaReviews(id as string, updatedComments, newAverage);

        if (result.valid) {
          setCinema({ ...cinema, comentarios: updatedComments, avaliacao: newAverage });
          setMyReview('');
          setUserRating(0);
        } else {
          console.error("Falha ao salvar comentários:", result.error);
        }

    } catch (error) {
        console.error("Erro ao submeter avaliação para o service:", error);
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
                    <AdminDeleteButton itemName="cinema" onConfirmDelete={handleDeleteCinema} />
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
                <Text style={cinemaDetailsStyle.cinemaName} numberOfLines={2}>{cinemaName}</Text>
                <TouchableOpacity style={cinemaDetailsStyle.mapButton} onPress={navigateToMap}>
                    <Image source={require("@/screenAssets/Map-Buttom.svg")} style={{ width: 20, height: 20, marginRight: 5 }} resizeMode="contain" />
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
                {cinemaComments.length > 0 ? cinemaComments.map((rev: any, index: number) => (
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

      <BottomNavbar />
    </View>
  );
}