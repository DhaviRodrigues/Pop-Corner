import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, deleteDoc } from 'firebase/firestore'; 
import { db, auth } from '@/config/firebase';
import { Feather } from '@expo/vector-icons'; 
import { COLORS } from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import BottomNavbar from '@/components/Navbar';
import { ButtonY } from '@/components/ButtonY'; 
import { ButtonB } from '@/components/ButtonB'; 
import { ButtonAddWatchlist } from '@/components/ButtonAddWatchlist';
import { Input } from '@/components/Input';
import { InfoRow } from '@/components/InfoRow';
import { ReviewItem } from '@/components/ReviewItem';
import { movieStyle } from '@/styles/movie'; 
import { textStyle } from '@/styles/text';
import { DynamicStars } from '@/components/DynamicStars';
import { BackButton } from '@/components/BackButton';
import { submitReviewService, deleteReviewService } from '@/services/reviewService';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  const [myReview, setMyReview] = useState('');
  const [userRating, setUserRating] = useState(0); 
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminState, setIsAdminState] = useState(false);

  const currentUserUid = auth.currentUser?.uid || (user as any)?.uid || (user as any)?.id;
  
  const isContextAdmin = user 
    ? ((user as any).isAdmin === true || (user as any).isAdm === true)
    : false;
  const isAdmin = isContextAdmin || isAdminState;

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "filmes", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMovie({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkAdminDB = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.isAdm === true || data.isAdmin === true) {
              setIsAdminState(true);
            }
          }
        } catch (err) {
          console.warn("Erro ao checar admin:", err);
        }
      }
    };

    fetchMovie();
    checkAdminDB();
  }, [id]);

  useEffect(() => {
    if (movie?.comentarios && currentUserUid) {
      const existingReview = movie.comentarios.find((c: any) => c.uid === currentUserUid);
      if (existingReview) {
        setHasReviewed(true);
        setMyReview(existingReview.comment);
        setUserRating(existingReview.rating);
      } else {
        setHasReviewed(false);
        setMyReview('');
        setUserRating(0);
      }
    }
  }, [movie?.comentarios, currentUserUid]);

  const handleDeleteMovie = async () => {
    if (!adminPassword) {
      alert("Digite a senha para confirmar.");
      return;
    }
    try {
      await deleteDoc(doc(db, 'filmes', id as string));
      setShowDeleteModal(false);
      router.replace('/(tabs)/filmes'); 
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Falha ao deletar filme.");
    }
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) return alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
    if (!myReview.trim()) return alert("Por favor, escreva um comentário para a sua avaliação.");
    if (!currentUserUid) return alert("Você precisa estar logado para avaliar.");
    if (!id) return alert("Erro ao identificar o filme.");

    try {
        setIsSubmittingReview(true);

        const userName = typeof (user as any)?.getName === 'function' ? (user as any).getName() : ((user as any)?.name || "Usuário");
        const userPic = typeof (user as any)?.getProfilePicture === 'function' ? (user as any).getProfilePicture() : ((user as any)?.profile_picture || "");

        const { updatedComments, newAverage, pipokaMessage } = await submitReviewService({
          collectionName: 'filmes',
          itemId: id as string,
          currentUserUid,
          userName,
          userPic,
          userRating,
          myReview,
          currentComments: movie?.comentarios || [],
          hasReviewed,
          pipokaAmount: 100, 
          itemTitle: movie?.title || "Filme"
        });

        setMovie({ 
            ...movie, 
            comentarios: updatedComments, 
            rating: newAverage, 
            ratingCount: updatedComments.length 
        });
        
        if (Platform.OS === 'web') window.alert(pipokaMessage);
        else Alert.alert("Sucesso", pipokaMessage);

    } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
        alert("Erro ao enviar avaliação. Tente novamente.");
    } finally {
        setIsSubmittingReview(false);
    }
  };

  // DELEÇÃO DELEGADA AO SERVIÇO UNIFICADO
  const handleDeleteMyReview = async () => {
    const procederExclusao = async () => {
      try {
        const { updatedComments, newAverage } = await deleteReviewService(
          'filmes',
          id as string,
          currentUserUid,
          movie?.comentarios || []
        );

        setMovie({ 
          ...movie, 
          comentarios: updatedComments, 
          rating: newAverage, 
          ratingCount: updatedComments.length 
        });

        setMyReview('');
        setUserRating(0);
        setHasReviewed(false);

        if (Platform.OS === 'web') window.alert("Sua avaliação foi excluída.");
        else Alert.alert("Removido", "Sua avaliação foi excluída.");
      } catch (error) {
        console.error("Erro ao deletar avaliação:", error);
        alert("Não foi possível apagar a avaliação.");
      }
    };

    if (Platform.OS === 'web') {
      const confirmar = window.confirm("Tem certeza que deseja apagar o seu comentário?");
      if (confirmar) await procederExclusao();
    } else {
      Alert.alert(
        "Remover Avaliação",
        "Tem certeza que deseja apagar o seu comentário?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Apagar", style: "destructive", onPress: procederExclusao }
        ]
      );
    }
  };

  const currentMovieReviews = useMemo(() => {
    return movie?.comentarios || [];
  }, [movie?.comentarios]);

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
      
      {/* HEADER DINÂMICO */}
      <View style={[movieStyle.detailsTopBar, { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 15, 
        height: 90, 
        paddingTop: Platform.OS === 'android' ? 25 : 0, 
      }]}>
        <View style={{ width: 60, alignItems: 'flex-start' }}>
          <BackButton onPress={() => router.back()}/>
        </View>

        <Text style={[textStyle.detailsTitleText, { flex: 1, textAlign: 'center' }]} numberOfLines={1}>
          {movie.title}
        </Text>

        <View style={{ width: 100, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
          {isAdmin && (
            <>
              <TouchableOpacity 
                onPress={() => router.push({ pathname: '/addMovie', params: { editId: id } })}
                style={movieStyle.adminHeaderButton}
              >
                <Feather name="edit" size={18} color="#FFFEB2" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setShowDeleteModal(true)}
                style={movieStyle.adminHeaderButton}
              >
                <Feather name="trash-2" size={18} color="#FFFEB2" />
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
              <ButtonAddWatchlist onPress={() => console.log('Adicionou!')} />
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

          {/* SEÇÃO DE AVALIAÇÃO COM BOTÃO DE DELETAR E TÍTULO DINÂMICO */}
          <View style={movieStyle.detailsSectionGrey}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={[textStyle.detailsSectionTitle, { marginBottom: 0 }]}>
                {hasReviewed ? "Sua Avaliação Atual" : "Deixe sua Avaliação"}
              </Text>
              {hasReviewed && (
                <TouchableOpacity onPress={handleDeleteMyReview} style={{ padding: 5 }}>
                  <Feather name="trash-2" size={20} color="#B22300" />
                </TouchableOpacity>
              )}
            </View>
            
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
                    <ButtonY title={hasReviewed ? "Atualizar Avaliação" : "Avaliar"} onPress={handleSubmitReview} />
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
                    <ReviewItem 
                        key={rev.id || index.toString()} 
                        review={{
                            ...rev,
                            name: rev.user || rev.name,
                            avatar: rev.profilePic || rev.avatar,
                            content: rev.comment || rev.content
                        }} 
                    />
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

      {/* MODAL DE DELEÇÃO DO FILME (ADMIN) */}
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
      
      <BottomNavbar />
    </View>
  );
}