import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { buttonStyle } from "@/styles/button";
import { textStyle } from "@/styles/text";

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
        buttonStyle.buttonGenre, 
        selected && { backgroundColor: '#FFFEB2' }
      ]} 
      activeOpacity={0.7} 
      onPress={handlePress}
    >
      <Text style={[
        buttonStyle.buttonGenreText,
        selected && { color: '#000000' }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}