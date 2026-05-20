import React from 'react';
import { TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { componentStyle } from '@/styles/component';

// Interface para definição das propriedades aceitas pelo componente, garantindo a tipagem do evento de clique.
type PencilProps = {
  onPress?: () => void;
  onPhotoSelecting?: () => void; // Callback para notificar o início da seleção
  onPhotoSelected?: (photoUri: string | null) => void;
  isLoading?: boolean;
};

/**
 * Componente que abstrai o botão de edição (ícone de lápis).
 * Utilizado sobreposto a outros elements (como fotos de perfil) para indicar interatividade de alteração.
 */
export function Pencil({ onPress, onPhotoSelecting, onPhotoSelected, isLoading = false }: PencilProps) {

  const handleSelectPhoto = async () => {
    try {
      if (onPhotoSelecting) onPhotoSelecting();

      // Solicitar permissão de acesso à galeria
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        console.log('Permissão para acessar a galeria foi negada');
        if (onPhotoSelected) onPhotoSelected(null);
        return;
      }

      // Abrir o seletor de imagens
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        const fileUri = selectedImage.uri;
        
        if (onPhotoSelected) {
          onPhotoSelected(fileUri);
        }
      } else {
        if (onPhotoSelected) onPhotoSelected(null);
      }
    } catch (error) {
      console.error('Erro ao selecionar ou fazer upload da foto:', error);
      if (onPhotoSelected) onPhotoSelected(null);
    }
  };

  // Se passou onPhotoSelected, usar a lógica de upload, senão usar o callback onPress antigo
  const handlePress = onPhotoSelected ? handleSelectPhoto : onPress;

  return (
    // Container tátil que encapsula o ícone; o estilo editButtonContainer gerencia o posicionamento absoluto.
    <TouchableOpacity 
      style={componentStyle.editButtonContainer} 
      onPress={handlePress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFD60A" />
      ) : (
        <Image 
          source={require('@/screenAssets/icons/pencil.svg')} 
          style={componentStyle.editButtonIcon} 
        />
      )}
    </TouchableOpacity>
  );
}