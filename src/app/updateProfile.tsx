import React, { useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { BoxDark } from "@/components/BoxDark";
import { BoxDarkSelection } from "@/components/BoxDarkSelection";
import { ButtonY } from "@/components/ButtonY";
import { TitleBar } from "@/components/TitleBar";
import { ConfirmPopup } from "@/components/ConfirmPopup";
import { ValidationPopup } from "@/components/ValidationPopup";
import { useAuth } from '@/contexts/UserContext';
import { fetchUserData, updateUserProfileField } from '@/services/userservice';
import { uploadUserPhoto, ALLOWED_IMAGE_EXTENSIONS } from '@/services/storage';
import { COLORS } from "@/constants/colors";
import { miscStyle } from "@/styles/misc";


const { height } = Dimensions.get("window");

export default function UpdateProfile() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const userIdString = String(user?.getId() || '');

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

      // Atualiza o campo na base de dados de forma abstrata através do service
      const response = await updateUserProfileField({ profile_picture: '' });
      
      if (!response.success) {
        setValidationMessage(response.error || 'Usuário não autenticado ou erro ao processar.');
        setShowValidationPopup(true);
        setIsChangingPhoto(false);
        return;
      }

      // Sincroniza o Context do Usuário reativamente
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
        // Atualiza a URL assinada gerada no documento do Firestore via userservice
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
            onPress={() => null}
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