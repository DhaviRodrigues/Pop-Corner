import React from 'react';
import { View, Text } from 'react-native';
import { commentModerationStyle as S } from '@/styles/commentmoderation';

interface StarRatingProps {
  rating: number;
  max?: number;
}

export function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <View style={S.starsRow}>
      {Array.from({ length: max }).map((_, i) => (
        <Text key={i} style={[S.star, i < rating ? S.starFilled : S.starEmpty]}>
          ★
        </Text>
      ))}
    </View>
  );
}