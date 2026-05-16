import React from "react";
import { View, Text } from "react-native";
import { componentStyle } from "@/styles/component";

// Definição da interface para garantir a tipagem estática do título recebido via propriedades.
type TitleBarProps = {
  title: string;
  compact?: boolean;
};

/**
 * Componente de barra de título reutilizável.
 * Desenvolvido para padronizar o cabeçalho das telas, centralizando a estilização do texto de boas-vindas.
 */
export function TitleBar({ title, compact = false }: TitleBarProps) {
  const { Dimensions } = require("react-native");
  const { height } = Dimensions.get("window");

  const compactStyle = compact
    ? { marginBottom: height * 0.01, height: height * 0.10 }
    : {};

  return (
    <View style={[componentStyle.titleBarContainer, compactStyle]}>
      <Text style={componentStyle.welcomeTitle}>{title}</Text>
    </View>
  );
}