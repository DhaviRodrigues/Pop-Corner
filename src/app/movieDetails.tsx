import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/contexts/UserContext';

import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY'; 
import { ButtonB } from '@/components/ButtonB'; 
import { ButtonAddWatchlist } from '@/components/ButtonAddWatchlist';
import { ValidationPopup } from '@/components/ValidationPopup';
import { Input } from '@/components/Input';
import { InfoRow } from '@/components/InfoRow';
import { ReviewItem } from '@/components/ReviewItem';
import { movieStyle } from '@/styles/movie'; 
import { textStyle } from '@/styles/text';
import { DynamicStars } from '@/components/DynamicStars';
import { BackButton } from '@/components/BackButton';

import { MovieService } from '@/services/movieservice';
import { ReviewService } from '@/services/reviewservice';
import { UserService } from '@/services/userservice';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, refreshUser, isAdmin } = useAuth();

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  const [myReview, setMyReview] = useState('');
  const [userRating, setUserRating] = useState(0); 
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isSavingWatchlist, setIsSavingWatchlist] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupOnClose, setPopupOnClose] = useState<(() => void) | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { height, width: screenWidth } = Dimensions.get('window');

  const handleAddToWatchlist = async () => {
    if (!user) {
      setPopupMessage('Faça login para adicionar filmes à watchlist.');
      setPopupVisible(true);
      return;
    }
    if (!movie?.id) {
      setPopupMessage('Não foi possível identificar o filme.');
      setPopupVisible(true);
      return;
    }
    try {
      setIsSavingWatchlist(true);
      const userId = (user as any).uid || (user as any).id;
      const result = await UserService.addMovieToWatchlist(userId, movie.id);
      
      if (!result.valid) {
        setPopupMessage(result.error || 'Erro ao adicionar à watchlist.');
        setPopupVisible(true);
        return;
      }

      await refreshUser();
      setPopupMessage('Filme adicionado à watchlist!');
      setPopupVisible(true);
      setPopupOnClose(() => () => router.push('/watchlist'));
    } catch (error) {
      console.error('Erro ao adicionar à watchlist:', error);
      setPopupMessage('Erro ao adicionar à watchlist. Tente novamente.');
      setPopupVisible(true);
    } finally {
      setIsSavingWatchlist(false);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (!user) {
      setPopupMessage('Faça login para remover filmes da watchlist.');
      setPopupVisible(true);
      return;
    }
    if (!movie?.id) {
      setPopupMessage('Não foi possível identificar o filme.');
      setPopupVisible(true);
      return;
    }
    try {
      setIsSavingWatchlist(true);
      const userId = (user as any).uid || (user as any).id;
      const result = await UserService.removeMovieFromWatchlist(userId, movie.id); 
      
      if (!result.valid) {
        setPopupMessage(result.error || 'Erro ao remover da watchlist.');
        setPopupVisible(true);
        return;
      }

      await refreshUser();
      setPopupMessage('Filme removido da watchlist.');
      setPopupVisible(true);
      setPopupOnClose(() => () => setPopupOnClose(null));
    } catch (error) {
      console.error('Erro ao remover da watchlist:', error);
      setPopupMessage('Erro ao remover da watchlist. Tente novamente.');
      setPopupVisible(true);
    } finally {
      setIsSavingWatchlist(false);
    }
  };

    useEffect(() => {
  const checkWatchlist = async () => {
  if (user && id) {
    const userId = (user as any).uid || (user as any).id;
    const status = await UserService.checkIfMovieInWatchlist(userId, id as string);
    setIsFavorite(status);
  }
  };
  checkWatchlist();
  }, [user, id]);

    useEffect(() => {
  const fetchMovieData = async () => {
      if (!id) return;
      try {
          setLoading(true);
          const fetchedMovie = await MovieService.getMovieById(id as string);
          console.log("DADOS DO FILME RECEBIDOS:", fetchedMovie);
          
          if (fetchedMovie) {
              setMovie(fetchedMovie);
          } else {
              console.warn("Nenhum filme retornado pelo serviço.");
          }
      } catch (error) {
          console.error("Erro ao buscar detalhes:", error);
      } finally {
          setLoading(false);
      }
  };
  fetchMovieData();
}, [id]);

  const handleDeleteMovie = async () => {
    if (!adminPassword) {
      alert("Digite a senha para confirmar.");
      return;
    }
    try {
      const result = await MovieService.deleteMovie(id as string, adminPassword);
      if (result.valid) {
          setShowDeleteModal(false);
          router.replace('/(tabs)/filmes'); 
      } else {
          alert(result.error || "Falha ao deletar filme.");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Ocorreu um erro inesperado ao deletar o filme.");
    }
  };

  const handleSubmitReview = async () => {
  if (userRating === 0) {
      setPopupMessage("Por favor, selecione uma nota de 1 a 5 estrelas.");
      setPopupVisible(true);
      return;
  }
  if (!myReview.trim()) {
      setPopupMessage("Por favor, escreva um comentário para a sua avaliação.");
      setPopupVisible(true);
      return;
  }
  if (!user) {
      setPopupMessage("Você precisa estar logado para avaliar.");
      setPopupVisible(true);
      return;
  }

  try {
      setIsSubmittingReview(true);
      
      const userName = typeof (user as any)?.getName === 'function' ? (user as any).getName() : ((user as any)?.name || "Usuário");
      const profilePic = typeof (user as any)?.getProfilePicture === 'function' ? (user as any).getProfilePicture() : ((user as any)?.profile_picture || "");

      const reviewPayload = {
          id: Date.now().toString(),
          author: userName,
          rating: userRating,
          date: new Date().toISOString(),
          text: myReview.trim(),
          status: 'Aprovado',
          profilePic: profilePic
      };

    const result = await ReviewService.addReviewToMovie(id as string, reviewPayload);

      if (result && result.valid === false) {
          setPopupMessage(result.error);
          setPopupVisible(true);
          return;
      }

      if (result && result.valid) {
          const updatedMovie = await MovieService.getMovieById(id as string);
          if (updatedMovie) {
              setMovie(updatedMovie); 
          }
      }

      setMyReview('');
      setUserRating(0);
      
      setPopupMessage("Avaliação enviada com sucesso! Você ganhou 250 pipokas!");
      setPopupVisible(true);
      await refreshUser(); 

  } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error);
      setPopupMessage(error.message || "Erro ao enviar avaliação. Tente novamente.");
      setPopupVisible(true);
  } finally {
      setIsSubmittingReview(false);
  }
};

const handleDeleteReview = async (reviewUserId: string) => {
try {
  const result = await ReviewService.deleteMovieReview(String(id), reviewUserId);
  if (result.valid) {
    setPopupMessage("Comentário removido com sucesso!");
    setPopupVisible(true);
    
    // Sincroniza a visão do usuário e do administrador atualizando o estado do componente de forma imediata
    const updatedMovie = await MovieService.getMovieById(id as string);
    if (updatedMovie) {
      setMovie(updatedMovie);
    }
  } else {
    setPopupMessage(result.error || "Erro ao tentar remover o comentário.");
    setPopupVisible(true);
  }
} catch (error) {
  console.error("Erro ao deletar avaliação:", error);
  setPopupMessage("Erro ao tentar remover o comentário.");
  setPopupVisible(true);
}
};
  const currentMovieReviews = useMemo(() => {
    return movie?.comentarios || movie?.comments || [];
  }, [movie]);

  const isInWatchlist = useMemo(() => {
    try {
      if (!user || !user.watchlist || !movie?.id) return false;

      const currentMovieId = String(movie.id);
      const watchlist = user.watchlist;

      if (Array.isArray(watchlist)) {
        return watchlist.some((w: any) => {
          const watchId = typeof w.getIdFilme === 'function' ? w.getIdFilme() : (w.idFilme || w);
          return String(watchId) === currentMovieId;
        });
      }

      if (typeof watchlist === 'string') {
        return watchlist.includes(currentMovieId);
      }

      return false;
    } catch (e) {
      console.error("Erro ao verificar watchlist:", e);
      return false;
    }
  }, [user?.watchlist, movie?.id]);

  const paginatedReviews = useMemo(() => {
    return currentMovieReviews.slice(0, visibleCount);
  }, [currentMovieReviews, visibleCount]);

  const renderRatingCount = (count: any) => {
    if (typeof count === 'number') return `${count} avaliações`;
    return '0 avaliações';
  };

  if (loading) {
return (
  <View style={[movieStyle.detailsMainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);
}

if (!movie) {
return (
  <View style={movieStyle.detailsMainContainer}>
    <Text style={textStyle.text}>Filme não encontrado.</Text>
    <BottomNavbar />
  </View>
);
}
return (
<View style={movieStyle.detailsMainContainer}>
{/* HEADER ORIGINAL */}
<View style={[
  movieStyle.detailsTopBar, 
  { 
    backgroundColor: COLORS.primary, 
    zIndex: 9999, 
    position: 'relative', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 10
  }
]}>
  <View style={{ width: 80, alignItems: 'flex-start' }}>
    <BackButton onPress={() => router.back()}/>
  </View>
  
  {/* TÍTULO COM COR FORÇADA PARA APARECER NO VERMELHO */}
  <View style={{ flex: 1 }}>
    <Text style={[
      textStyle.detailsTitleText, 
      { 
        color: COLORS.gold, 
        textAlign: 'center', 
        fontSize: 18,
        fontWeight: 'bold' 
      }
    ]}>
      {movie?.title || "Carregando..."}
    </Text>
  </View>
  
  <View style={{ width: 80, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
    {isAdmin && (
      <>
        <TouchableOpacity onPress={() => router.push({ pathname: '/addMovie', params: { editId: id } })}>
          <Image source={require('@/screenAssets/icons/pencil.png')} style={{ width: 18, height: 18, tintColor: '#FFFEB2' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
          <Image source={require('@/screenAssets/trashbin.png')} style={{ width: 18, height: 18, tintColor: '#FFFEB2' }} />
        </TouchableOpacity>
      </>
    )}
  </View>
</View>

      <Image 
        source={{ uri: movie.image }} 
        style={movieStyle.detailsBackgroundImage} 
        blurRadius={10} 
        resizeMode="cover"
      />

      <ScrollView contentContainerStyle={[movieStyle.detailsScrollContent, {paddingBottom: 180 }]} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={movieStyle.detailsPosterWrapper}>
          <Image source={{ uri: movie.image }} style={movieStyle.detailsPoster} resizeMode="cover" />
        </View>

        <View style={movieStyle.detailsContentWrapper}>
          <View style={movieStyle.detailsRatingCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={textStyle.detailsRatingScore}>
                {(movie.rating || 0).toFixed(1).replace('.', ',')}
              </Text>
              <DynamicStars rating={movie.rating || 0} starSize={26} colorBackground="#D9D9D9" colorForeground="#FFFEB2" />
            </View>
            <Text style={textStyle.detailsRatingCount}>({renderRatingCount(movie.ratingCount)})</Text>
          </View>

          <View style={movieStyle.detailsInfoGroup}>
            <View style={movieStyle.detailsWatchlistBtnWrapper}>
              {isFavorite ? (
                <ButtonB title="Remover da Watchlist" h={height * 0.065} w={screenWidth * 0.65} textSize={height * 0.02} onPress={handleRemoveFromWatchlist} />
              ) : (
                <ButtonAddWatchlist onPress={handleAddToWatchlist} />
              )}  
            </View>

            <View style={movieStyle.detailsSynopsisCard}>
              <Text style={textStyle.detailsSynopsisText}>{movie.synopsis}</Text>
            </View>

            <InfoRow icon="time-outline" label="Duração" value={movie.duration} />
            <InfoRow icon="film-outline" label="Gêneros" value={movie.tags} isTag={true} />
            <InfoRow icon="shield-checkmark-outline" label="Classificação" value={movie.classification} />
            <InfoRow icon="videocam-outline" label="Diretor" value={movie.director} />
            <InfoRow icon="calendar-outline" label="Ano de lançamento" value={String(movie.year || '')} />
          </View>

          {/* SEÇÃO DE AVALIAÇÃO */}
          <View style={movieStyle.detailsSectionGrey}>
            <Text style={textStyle.detailsSectionTitle}>Sua Avaliação</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setUserRating(star)} style={{ paddingHorizontal: 5 }}>
                  <Text style={{ fontSize: 36, color: star <= userRating ? COLORS.primary : '#666' }}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Input
                text="Escreva sua avaliação..."
                value={myReview}
                onChangeText={setMyReview}
                multiline={true}
                containerStyle={movieStyle.detailsReviewInput}
            />
            
            <View style={{ marginTop: 15, alignItems: 'center' }}>
                {isSubmittingReview ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                    <ButtonY title="Avaliar" onPress={handleSubmitReview} />
                )}
            </View>
          </View>

          {/* LISTA DE COMENTÁRIOS */}
          <View style={movieStyle.detailsSectionGrey}>
            <Text style={textStyle.detailsSectionTitle}>Comentários</Text>
            
            {currentMovieReviews.length === 0 ? (
                <Text style={[textStyle.detailsReviewText, { textAlign: 'center' }]}>
                Ainda não há comentários para este filme.
                </Text>
            ) : (
                <>
                {paginatedReviews.map((rev: any, index: number) => (
                    <View key={rev.id || index.toString()} style={{ position: 'relative', width: '100%' }}>
                        <ReviewItem 
                            review={{
                                ...rev,
                                name: rev.user || rev.author || rev.name,
                                avatar: rev.profilePic || rev.avatar,
                                content: rev.comment || rev.text || rev.content
                            }} 
                        />

                        {isAdmin && (
                          <TouchableOpacity
                            style={{
                              position: 'absolute',
                              top: 15,
                              right: 15,
                              zIndex: 10,
                              padding: 5,
                            }}
                            onPress={() => handleDeleteReview(rev.id)}
                            activeOpacity={0.7}
                          >
                            <Image
                              source={require('@/screenAssets/trashbin.png')}
                              style={{ width: 18,
                              height: 18,
                              tintColor: COLORS.red
                            }}
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                ))}
                
                {visibleCount < currentMovieReviews.length && (
                    <View style={{ marginTop: 10, alignItems: 'center' }}>
                    <ButtonB title="Ver mais" onPress={() => setVisibleCount(v => v + 5)} />
                    </View>
                )}
                </>
            )}
          </View>

        </View>
      </ScrollView>

      {/* MODAL DE DELEÇÃO */}
      <Modal visible={showDeleteModal} transparent={true} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <View style={{ width: '85%', backgroundColor: COLORS.primary, padding: 25, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: COLORS.gold }}>
            <Text style={{ color: '#FFF', fontSize: 20, fontFamily: 'Poppins-Bold', marginBottom: 10 }}>Excluir Filme</Text>
            <Text style={{ color: '#CCC', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>Esta ação é irreversível. Digite a senha de admin:</Text>
            <TextInput 
              secureTextEntry 
              value={adminPassword} 
              onChangeText={setAdminPassword} 
              style={{ width: '100%', backgroundColor: '#FFF', padding: 12, borderRadius: 10, marginBottom: 20, color: '#000' }} 
            />
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={{ padding: 12, backgroundColor: '#333', borderRadius: 10, flex: 1, alignItems: 'center' }}>
                <Text style={{color: '#FFF', fontWeight: 'bold'}}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteMovie} style={{ padding: 12, backgroundColor: COLORS.gold, borderRadius: 10, flex: 1, alignItems: 'center' }}>
                <Text style={{color: '#000', fontWeight: 'bold'}}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <ValidationPopup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => {
          setPopupVisible(false);
          if (popupOnClose) {
            const cb = popupOnClose;
            setPopupOnClose(null);
            cb();
          }
        }}
      />
      <BottomNavbar />
    </View>
  );
}