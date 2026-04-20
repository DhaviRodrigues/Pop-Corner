import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { buttonStyle } from "@/styles/button";
import { textStyle } from "@/styles/text";

type ButtonProps = {
  title: string;
  selected: boolean;
  onToggle: () => void;
};

export function ButtonGenre({ title, selected, onToggle }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        buttonStyle.buttonGenre, 
        selected && { backgroundColor: '#FFFEB2' }
      ]} 
      activeOpacity={0.7} 
      onPress={onToggle}
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