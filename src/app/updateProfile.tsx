import React, { useState, useEffect } from "react";
import { Dimensions, Image, ScrollView, View, Text, Modal, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { BoxDark } from "@/components/BoxDark";
import { BoxDarkSelection } from "@/components/BoxDarkSelection";
import { ButtonY } from "@/components/ButtonY";
import { ButtonGenre } from "@/components/ButtonGenre";
import { TitleBar } from "@/components/TitleBar";
import { ConfirmPopup } from "@/components/ConfirmPopup";
import { ValidationPopup } from "@/components/ValidationPopup";
import { useAuth } from '@/contexts/UserContext';
import { fetchUserData, updateUserProfileField } from '@/services/userservice';
import { uploadUserPhoto, ALLOWED_IMAGE_EXTENSIONS } from '@/services/storage';
import { COLORS } from "@/constants/colors";
import { miscStyle } from "@/styles/misc";
import { textStyle } from "@/styles/text";

const { height } = Dimensions.get("window");

const AVAILABLE_GENRES = ['AÇÃO', 'DRAMA', 'COMÉDIA', 'TERROR', 'FICÇÃO CIENTÍFICA', 'SUSPENSE', 'ROMANCE', 'FAROESTE', 'MUSICAL'];

export default function UpdateProfile() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const userIdString = String(user?.getId() || '');
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isSavingGenres, setIsSavingGenres] = useState(false);

  useEffect(() => {
    if (showGenresModal && user) {
      const currentGenres = user.favorite_genres || (user as any).getGenres?.() || [];
      setSelectedGenres(currentGenres);
    }
  }, [showGenresModal, user]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };

  const handleSaveGenres = async () => {
    if (selectedGenres.length < 2) {
      setValidationMessage("Selecione no mínimo 2 gêneros.");
      setShowValidationPopup(true);
      return;
    }

    try {
      setIsSavingGenres(true);

      const response = await updateUserProfileField({ favorite_genres: selectedGenres });

      if (!response.success) {
        setValidationMessage(response.error || 'Erro ao processar a atualização no servidor.');
        setShowValidationPopup(true);
        setIsSavingGenres(false);
        return;
      }

      const updated = await fetchUserData();
      if (updated && setUser) setUser(updated);

      setIsSavingGenres(false);
      setShowGenresModal(false);
    } catch (error) {
      console.error("Erro ao atualizar gêneros favoritos:", error);
      setValidationMessage("Ocorreu um erro inesperado ao salvar os gêneros.");
      setShowValidationPopup(true);
      setIsSavingGenres(false);
    }
  };

  const handleConfirmDeactivateAccount = () => {
    setShowDeletePopup(false);
    router.push({
      pathname: '/passwordConfirmation',
      params: { from: 'updateProfile' }
    });
  };

  const getImageExtension = (uri: string) => {
    return uri.split('.').pop()?.split('?')[0]?.toLowerCase() || '';
  };

  const handleRemovePhoto = async () => {
    try {
      setIsChangingPhoto(true);
      const response = await updateUserProfileField({ profile_picture: '' });
      
      if (!response.success) {
        setValidationMessage(response.error || 'Usuário não autenticado ou erro ao processar.');
        setShowValidationPopup(true);
        setIsChangingPhoto(false);
        return;
      }

      const updated = await fetchUserData();
      if (updated && setUser) setUser(updated);
      
      setIsChangingPhoto(false);
      router.push('/profile');
    } catch (error) {
      setValidationMessage('Erro ao remover foto. Tente novamente.');
      setShowValidationPopup(true);
      setIsChangingPhoto(false);
    }
  };

  const handleChangePhoto = async () => {
    try {
      setIsChangingPhoto(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setValidationMessage('Permissão para acessar galeria negada.');
        setShowValidationPopup(true);
        setIsChangingPhoto(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled || result.assets.length === 0) {
        setIsChangingPhoto(false);
        return;
      }

      const uri = result.assets[0].uri;
      const fileName = result.assets[0].fileName || '';

      const ext = getImageExtension(fileName) || getImageExtension(uri);
      const valid = ext && ALLOWED_IMAGE_EXTENSIONS.includes(ext);
      
      if (!valid) {
        setValidationMessage('Formato de imagem inválido. Use apenas JPG, JPEG ou PNG.');
        setShowValidationPopup(true);
        setIsChangingPhoto(false);
        return;
      }

      const uploadResponse = await uploadUserPhoto(uri, 'perfil_foto', userIdString, fileName);
      if (!uploadResponse.success) {
        setValidationMessage(uploadResponse.error || 'Erro ao fazer upload da foto.');
        setShowValidationPopup(true);
        setIsChangingPhoto(false);
        return;
      }

      const signed = uploadResponse.signedUrl;
      if (signed) {
        await updateUserProfileField({ profile_picture: signed });
        
        const updated = await fetchUserData();
        if (updated && setUser) setUser(updated);
        
        setIsChangingPhoto(false);
        router.push('/profile');
        return;
      }

      setValidationMessage('Erro ao obter URL da foto.');
      setShowValidationPopup(true);
      setIsChangingPhoto(false);
    } catch (error) {
      console.error('Erro ao trocar foto:', error);
      setValidationMessage('Erro ao trocar a foto. Tente novamente.');
      setShowValidationPopup(true);
      setIsChangingPhoto(false);
    }
  };
    
  return (
    <View style={miscStyle.background}>
      <TitleBar title="Configurações de Perfil" compact />

      <ScrollView contentContainerStyle={{
          alignItems: "center",
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('@/screenAssets/logo/full-logo.png')}
          style={{
            width: height * 0.15,
            height: height * 0.12,
            marginBottom: height * 0.01,
            resizeMode: 'contain',
          }}
        />

        <BoxDark vw={0.8} padTop={height * 0.03}>
          <BoxDarkSelection
            iconSource={require('@/screenAssets/icons/profile-icon.png')}
            title="Alterar Nome de Usuário"
            description="Renomeia o nome do usuário"
            color={COLORS.white}
            onPress={() => router.push('/updateName')}
          />

          <BoxDarkSelection
            iconSource={require('@/screenAssets/trashbin.png')}
            title="Remover Foto de Perfil"
            description="Restaura a foto de perfil para a imagem padrão"
            color={COLORS.white}
            onPress={handleRemovePhoto}
          />

          <BoxDarkSelection
            iconSource={require('@/screenAssets/arrows.png')}
            title="Mudar Foto de Perfil"
            description="Troca sua foto de perfil pela imagem selecionada"
            onPress={handleChangePhoto}
          />

          <BoxDarkSelection
            iconSource={require('@/screenAssets/movie-tape.png')}
            title="Gerenciar Gêneros Favoritos"
            description="Permite a adição e remoção de gêneros aos favoritos"
            onPress={() => setShowGenresModal(true)}
          />

          <BoxDarkSelection
            iconSource={require('@/screenAssets/trashbin.png')}
            title="Deletar Perfil"
            description="Remova sua conta permanentemente"
            onPress={() => setShowDeletePopup(true)}
            style={{ marginTop: height * 0.015 }}
          />
        </BoxDark>

        <ButtonY title="Voltar" onPress={() => router.push('/profile')} />
      </ScrollView>

      <Modal
        visible={showGenresModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowGenresModal(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        }}>
          <View style={[miscStyle.formContainer, { 
            backgroundColor: COLORS.primary,
            borderRadius: 16, 
            padding: 24, 
            width: '85%',
            alignItems: 'center'
          }]}>
            <Text style={[textStyle.text, { marginBottom: height * 0.02, fontWeight: 'bold' }]}>
              Gerenciar Gêneros Favoritos
            </Text>

            <View style={miscStyle.genresContainer}>
              {AVAILABLE_GENRES.map(genre => (
                <ButtonGenre 
                  key={genre}
                  title={genre}
                  selected={selectedGenres.includes(genre)}
                  onToggle={() => toggleGenre(genre)}
                />
              ))}
            </View>

            <View style={{ marginTop: height * 0.02, marginBottom: height * 0.02, width: '100%' }}>
              <Text style={[textStyle.message, { textAlign: 'center' }]}>
                *Selecione no mínimo 2 gêneros
              </Text>
            </View>

            {isSavingGenres ? (
              <ActivityIndicator size="large" color={COLORS.gold} style={{ marginVertical: height * 0.02 }} />
            ) : (
              <>
                <ButtonY title="Salvar" onPress={handleSaveGenres} />
                <ButtonY 
                  title="Cancelar" 
                  onPress={() => setShowGenresModal(false)} 
                />
              </>
            )}
          </View>
        </View>
      </Modal>
      
      <ConfirmPopup 
        visible={showDeletePopup}
        message="Tem certeza que deseja remover seu perfil permanentemente?"
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleConfirmDeactivateAccount}
      />
      
      <ValidationPopup
        visible={showValidationPopup}
        message={validationMessage}
        onClose={() => setShowValidationPopup(false)}
      />
    </View>
  );
}