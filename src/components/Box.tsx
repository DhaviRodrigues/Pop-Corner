import { View, useWindowDimensions } from "react-native";
import { componentStyle } from "@/styles/component";
import { Children, ReactNode } from "react";

// Tipando as props. O 'vw' aqui foi a sacada que a gente teve pra simular o Viewport Width do CSS web no React Native, já que ele não aceita '80vw' direto no StyleSheet.
type BoxProps = {
vw: number;
padTop: number;
children: ReactNode;
};

// Esse componente serve como um container padrão (aquele card branco ou escuro) pra não ter que ficar reescrevendo margem e padding em toda tela.
export function Box({ vw, padTop, children }: BoxProps) {
  // Usando useWindowDimensions em vez de Dimensions.get('window') aqui dentro do componente. A vantagem do hook é que se a tela redimensionar (split screen, girar o celular), o componente re-renderiza com o tamanho novo.
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Faz a matemática pra descobrir o tamanho real em pixels. Se a tela tem 400px e o vw passado foi 0.8, a caixa vai ter 320px.
  const boxWidth = screenWidth * vw

  return (
    // Passamos o style como um array. Isso permite juntar as configurações fixas (bordas, cores) que vêm do componentStyle.box com as dimensões dinâmicas que acabamos de calcular.
    // O minHeight de 40% (0.4) da tela garante que a caixa não fique "esmagada" se tiver pouco texto dentro dela.
    <View style={[componentStyle.box,{ width: boxWidth, minHeight: screenHeight * 0.4 , paddingTop: padTop}]}>
      {/* O children renderiza o que quer que a gente jogue dentro da tag <Box> lá nas telas (inputs, textos, botões) */}
      {children}
    </View>
  );
}