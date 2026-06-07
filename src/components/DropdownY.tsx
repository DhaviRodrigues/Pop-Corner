import React from 'react';
import { View, TouchableOpacity, Text, Dimensions, Image } from 'react-native';
import { componentStyle } from '@/styles/component';

const { height } = Dimensions.get('window');

type DropdownYProps = {
  onPress?: () => void;
};

export function DropdownY({ onPress }: DropdownYProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={componentStyle.dropdownContainer}
    >
      <Text style={componentStyle.dropdownText}>Ordenar por</Text>
      <Image
        source={require('@/screenAssets/seta-baixo.svg')}
        style={{ width: height * 0.02, height: height * 0.02, marginTop: height * 0.005 }}
      />
    </TouchableOpacity>
  );
}
