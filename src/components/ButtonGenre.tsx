import React from "react";
import { Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { buttonStyle } from "@/styles/button";


// Tipando as props. Esse componente é o que chamamos de "burro" (stateless) porque ele não controla se está selecionado ou não, ele só obedece a prop 'selected' que vem do componente pai (a tela Genre) e avisa o pai quando é clicado via 'onToggle'.
type ButtonProps = {
  title: string;
  selected: boolean;
  onToggle: () => void;
};

export function ButtonGenre({ title, selected, onToggle }: ButtonProps) {
  const { height } = useWindowDimensions();

  const dynamicRadius = height * 0.06;
  const dynamicPaddingH = height * 0.02;
  const dynamicPaddingV = height * 0.01;
  const dynamicMarginV = height * 0.01;
  const dynamicMarginH = height * 0.005;
  const dynamicTextSize = height * 0.02;

  return (
    <TouchableOpacity 
      // Usando um array no style para fazer formatação condicional. A classe buttonGenre entra sempre, mas a cor de fundo amarela (#FFFEB2) só é injetada se a prop selected for true. É bem mais limpo que fazer um if/else inteiro.
      style={[
        buttonStyle.buttonGenre,{
          borderRadius: dynamicRadius,
          paddingHorizontal: dynamicPaddingH,
          paddingVertical: dynamicPaddingV,
          marginVertical: dynamicMarginV,
          marginHorizontal: dynamicMarginH
        },
        selected && { backgroundColor: '#FFFEB2' }
      ]} 
      activeOpacity={0.7} 
      onPress={onToggle}
    >
      {/* A mesma lógica de curto-circuito (&&) acontece no texto. Se o botão for selecionado, o fundo fica claro, então forçamos a fonte a ficar preta para manter o contraste e dar pra ler. */}
      <Text style={[
        buttonStyle.buttonGenreText,
        { fontSize: dynamicTextSize},
        selected && { color: '#000000' }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}