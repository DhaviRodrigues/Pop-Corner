import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { couponFormStyle as S } from '@/styles/couponForm';

interface CouponFormSliderProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

export function CouponFormSlider({ label, active, onToggle }: CouponFormSliderProps) {
  return (
    <TouchableOpacity style={S.sliderItem} onPress={onToggle} activeOpacity={0.7}>
      <View style={[S.sliderTrack, active && S.sliderTrackActive]}>
        <View style={[S.sliderThumb, active && S.sliderThumbActive]} />
      </View>
      <Text style={S.sliderLabel}>{label}</Text>
    </TouchableOpacity>
  );
}