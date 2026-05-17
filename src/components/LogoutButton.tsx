import { COLORS } from "@/constants/colors";
import { buttonStyle } from "@/styles/button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, Text, TouchableOpacity } from "react-native";

// Captura da dimensão vertical do dispositivo para aplicação de escalas responsivas no ícone.
const { height } = Dimensions.get('window');

// Interface para tipagem das propriedades, assegurando a obrigatoriedade da função de callback para o evento de clique.
interface LogoutButtonProps {
  onPress: () => void;
}

export function LogoutButton({ onPress }: LogoutButtonProps) {
  const iconSize = height * 0.028;
  const iconMarginRight = height * 0.008;

  return (
    <TouchableOpacity style={buttonStyle.logoutButton} onPress={onPress}>
      {/* Implementação do ícone de saída com tamanho calculado proporcionalmente à altura da janela. */}
      <MaterialCommunityIcons name="logout" size={iconSize} color={COLORS.black} style={{ marginRight: iconMarginRight }} />
      <Text style={buttonStyle.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}