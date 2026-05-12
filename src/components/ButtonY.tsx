import { buttonStyle } from "@/styles/button";
import { Text, TouchableOpacity, useWindowDimensions, DimensionValue } from "react-native";

// Tipagem das props. Deixamos quase tudo como opcional (?) para garantir flexibilidade. Assim a gente pode usar esse mesmo botão amarelo no app todo, sobrescrevendo altura, largura ou borda só quando o design de uma tela específica exigir.
type ButtonProps = {
  title: string;
  h?: DimensionValue;
  w?: DimensionValue;
  textSize?: number;
  align?: "flex-start" | "center" | "flex-end";
  borderRadius?: number;
  onPress?: () => void;
};

export function ButtonY({ title, h, w, textSize, align, borderRadius, onPress }: ButtonProps) {
  const { height, width: screenWidth } = useWindowDimensions();

  const dynamicHeight = h || height * 0.07;
  const dynamicRadius = borderRadius || height * 0.022;
  const dynamicTextSize = textSize || height * 0.027;
  const dynamicMarginVertical = height * 0.01;
  const dynamicShadowRadius = height * 0.0158;

  return (
    <TouchableOpacity 
      // O style recebe um array pra gente conseguir mesclar as classes globais (buttonStyle.buttonY e button) com os estilos inline dinâmicos gerados pelas props. O justifyContent aqui espelha a prop align.
      style={[buttonStyle.buttonY, buttonStyle.button, {
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
      // Mantendo o activeOpacity em 0.7 pra dar um feedback de clique mais natural, padronizando com o comportamento do ButtonB.
      activeOpacity={0.7} 
      onPress={onPress}
    >
      {/* Mesma lógica de array no Text pra permitir que a prop textSize mude o tamanho da fonte caso a tela precise de um texto de botão maior ou menor que o padrão */}
      <Text style={[buttonStyle.buttonText, buttonStyle.buttonYText, { fontSize: dynamicTextSize }]}>{title}</Text>
    </TouchableOpacity>
  );
}