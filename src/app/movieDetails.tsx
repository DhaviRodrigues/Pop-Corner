import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { Feather } from '@expo/vector-icons'; 

import { REVIEWS } from '@/data/mockReviews';
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

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const [myReview, setMyReview] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminState, setIsAdminState] = useState(false);

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

  const currentMovieReviews = useMemo(() => {
    return REVIEWS.filter(rev => String(rev.movieId) === String(id));
  }, [id]);

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
          <BackButton />
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

          {/* SEÇÃO DE AVALIAÇÃO */}
          <View style={movieStyle.detailsSectionGrey}>
            <Text style={textStyle.detailsSectionTitle}>Sua Avaliação</Text>
            
            <View style={movieStyle.detailsStarsContainer}>
                <Text style={textStyle.detailsUserStars}>☆☆☆☆☆</Text>
            </View>
            
            <Input
                text="Escreva sua avaliação..."
                value={myReview}
                onChangeText={setMyReview}
                multiline={true}
                containerStyle={movieStyle.detailsReviewInput}
            />
            
            <View style={{ marginTop: 15, alignItems: 'center' }}>
                <ButtonY title="Avaliar" onPress={() => console.log('Enviado!')} />
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
                {/* Renderizando os comentários */}
                {paginatedReviews.map(rev => (
                    <ReviewItem key={rev.id} review={rev} />
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
      
      <BottomNavbar />
    </View>
  );
}