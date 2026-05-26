import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { synopsisStyle } from '@/styles/component'; // Ajuste o caminho se tiver escolhido outro arquivo

interface SynopsisInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SynopsisInput = ({ value, onChangeText }: SynopsisInputProps) => {
  return (
    <View style={synopsisStyle.container}>
      <Text style={synopsisStyle.label}>Sinopse do filme</Text>
      <TextInput 
        multiline 
        numberOfLines={5} 
        style={synopsisStyle.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};