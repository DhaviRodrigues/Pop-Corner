import { Modal, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { componentStyle } from "@/styles/component";
import { Dimensions } from "react-native";
import { ButtonB } from "@/components/ButtonB";
import { ButtonY } from "./ButtonY";

// Extração das dimensões da tela para auxiliar no cálculo de proporções dos elementos internos do popup.
const { width, height } = Dimensions.get('window');

type ValidationPopupProps = {
  visible: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Componente de modal para exibição de mensagens de erro ou alertas do sistema.
 * Utiliza o componente nativo Modal para sobrepor o conteúdo atual da tela.
 */
export function ConfirmPopup({ visible, message, onClose, onConfirm }: ValidationPopupProps) {
  return (
    // A propriedade 'transparent' permite que o conteúdo de fundo permaneça visível sob o overlay.
    <Modal visible={visible} transparent animationType="fade">
      <View style={componentStyle.popupOverlay}>
        <View style={componentStyle.popup}>
            <Image 
            source={require('@/screenAssets/exclamation.png')} 
            style={componentStyle.exclamationIcon} 
            />
          <Text style={componentStyle.popupText}>{message}</Text> 
        <View style={componentStyle.popUpButtonContainer}>  
        <ButtonY w = {height * 0.075} h = {height * 0.055} textSize={height * 0.025} title="Sim" onPress={onConfirm}></ButtonY>
        <ButtonB w = {height * 0.075} h = {height * 0.055} textSize={height * 0.025} title="Não"onPress={onClose}></ButtonB>
        </View>
    </View>
      </View>
    </Modal>
  );
}
