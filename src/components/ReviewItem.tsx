import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { movieStyle } from '@/styles/movie';
import { textStyle } from '@/styles/text';

interface ReviewItemProps {
  review: {
    id: number | string;
    user: string;
    rating: number;
    comment: string;
  };
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <View style={movieStyle.detailsReviewItem}>
      {/* Avatar do Usuário */}
      <View style={movieStyle.detailsReviewAvatar}>
        <Feather name="user" size={24} color="#2A0800" />
      </View>

      {/* Conteúdo do Comentário */}
      <View style={movieStyle.detailsReviewContent}>
        <Text style={textStyle.detailsReviewUser}>
          {review.user}{' '}
          <Text style={textStyle.detailsReviewStars}>
            {'★'.repeat(review.rating)}
          </Text>
        </Text>
        <Text style={textStyle.detailsReviewText}>
          {review.comment}
        </Text>
      </View>
    </View>
  );
}