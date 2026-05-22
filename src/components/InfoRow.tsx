import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { movieStyle } from '@/styles/movie';
import { textStyle } from '@/styles/text';

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View style={movieStyle.detailsInfoRow}>
      <Ionicons name={icon} size={18} color={COLORS.gold} />
      
      <Text style={[textStyle.detailsInfoLabel, { marginLeft: 10, flex: 1 }]}>
        {label}: <Text style={textStyle.detailsInfoValue}>{value}</Text>
      </Text>
    </View>
  );
}