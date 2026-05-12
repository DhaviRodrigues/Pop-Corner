import {buttonStyle} from "@/styles/button";
import { Text, TouchableOpacity, useWindowDimensions, DimensionValue } from "react-native";

// Tipagem das props. Deixei quase tudo como opcional (?) pra gente poder reaproveitar esse mesmo botão no app inteiro, injetando largura, altura ou tamanho de texto específico só quando o estilo padrão não servir praquela tela.
type ButtonProps = {
  title: string;
  h?: DimensionValue;
  w?: DimensionValue;
  textSize?: number;
  align?: "flex-start" | "center" | "flex-end";
  borderRadius?: number;
  onPress?: () => void;
};

export function ButtonB({ title, h, w, textSize, align, borderRadius, onPress }: ButtonProps) {
  const { height, width: screenWidth } = useWindowDimensions();

  const dynamicHeight = h || height * 0.07;
  const dynamicRadius = borderRadius || height * 0.022;
  const dynamicTextSize = textSize || height * 0.027;
  const dynamicMarginVertical = height * 0.01;
  const dynamicShadowRadius = height * 0.0158;
  return (
    // Passando o style como um array pra mesclar as classes globais (cor de fundo, padding base) com os overrides que vêm das props. O justifyContent aqui tá mapeado pro 'align' pra facilitar centralizar o conteúdo quando precisar.
    <TouchableOpacity 
      style={[buttonStyle.buttonB, buttonStyle.button, { 
        height: dynamicHeight, 
        width: w || screenWidth * 0.48, 
        justifyContent: align || "center", 
        borderRadius: dynamicRadius, 
        marginTop: dynamicMarginVertical, 
        marginBottom: dynamicMarginVertical,
      
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.25,
        shadowRadius: dynamicShadowRadius
      }]} 
      // O activeOpacity 0.7 dá um feedback visual mais premium no clique, tirando aquele piscar quase transparente agressivo que é o padrão do React Native.
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <Text style={[buttonStyle.buttonText, buttonStyle.buttonBText, { fontSize: dynamicTextSize }]}>{title}</Text>
    </TouchableOpacity>
  );
}