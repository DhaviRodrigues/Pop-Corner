import React, { useState } from "react"; // 1. Importe o useState
import { Text, TouchableOpacity } from "react-native";
import { style } from "@/styles/style";

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

export function ButtonGenre({ title, onPress }: ButtonProps) {
  const [selected, setSelected] = useState(false);

  const handlePress = () => {
    setSelected(!selected);
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity 
      style={[
        style.buttonGenre, 
        selected && { backgroundColor: '#FFFEB2' }
      ]} 
      activeOpacity={0.7} 
      onPress={handlePress}
    >
      <Text style={[
        style.buttonGenreText,
        selected && { color: '#000000' }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}