import React from "react";
import { TouchableOpacity, Image, TouchableOpacityProps } from "react-native";
import { useRouter } from "expo-router";

interface BackButtonProps extends TouchableOpacityProps {
  onPress?: () => void; // Opcional, caso queira sobrescrever o comportamento padrão
}

export function BackButton({ onPress, style, ...rest }: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={handlePress} 
      style={style}
      {...rest}
    >
      <Image 
        source={require("@/screenAssets/back-icon-buttom.png")} 
        style={{ width: 40, height: 40 }} 
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}