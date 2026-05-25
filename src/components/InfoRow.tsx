import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { movieStyle } from '@/styles/movie';

// 👇 É AQUI QUE O ERRO MORRE 👇
interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | string[]; 
  isTag?: boolean; // <-- Adicionei essa linha aqui!
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
  const displayValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <View style={movieStyle.detailsInfoRow}>
      
      <Ionicons name={icon} size={24} color={COLORS.gold} />
      
      <Text 
        style={movieStyle.detailsInfoText}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}: <Text style={{ fontWeight: 'normal' }}>{displayValue}</Text>
      </Text>
      
    </View>
  );
}