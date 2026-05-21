import { Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { buttonStyle } from "@/styles/button";

// Tipagem simples. O onPress tá como opcional (?) pra gente poder importar o botão e montar o layout das telas mesmo antes de ter a lógica de navegação do router pronta, sem o TypeScript ficar reclamando.
type ButtonProps = {
  title: string;
  onPress?: () => void;
};

export function ButtonVoltar({ title, onPress }: ButtonProps) {
  const { height } = useWindowDimensions();

  const dynamicHeight = height * 0.05;
  const dynamicRadius = height * 0.022;
  const dynamicMarginVertical = height * 0.01;
  const dynamicShadowRadius = height * 0.0158;
  const dynamicTextSize = height * 0.020;

  return (
    <TouchableOpacity 
      // Usando array no style pra fazer composição. O buttonStyle.button deve ter as regras globais (padding, alinhamento) e o buttonVoltar as específicas (fundo transparente, texto colorido, etc).
      style={[buttonStyle.button, buttonStyle.buttonVoltar,
        {
          height: dynamicHeight,
          borderRadius: dynamicRadius,
          marginTop: dynamicMarginVertical,
          marginBottom: dynamicMarginVertical,
          shadowRadius: dynamicShadowRadius
        }
      ]} 
      // O activeOpacity 0.7 deixa o feedback tátil do clique mais suave, parecido com app nativo mesmo, em vez daquele piscar agressivo do padrão do React Native.
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <Text style={[buttonStyle.buttonVoltarText, { fontSize: dynamicTextSize }]}>{title}</Text>
    </TouchableOpacity>
  );
}