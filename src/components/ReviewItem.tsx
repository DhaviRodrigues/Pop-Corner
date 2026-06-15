import React from 'react';
import { View, Text, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { movieStyle } from '@/styles/movie';
import { textStyle } from '@/styles/text';

interface ReviewItemProps {
  review: {
    id: number | string;
    user?: string;
    name?: string;
    rating: number;
    comment?: string;
    content?: string;
    avatar?: string;
    profilePic?: string;
  };
}

export function ReviewItem({ review }: ReviewItemProps) {
  // Garantimos que ele pegue o dado, não importa como a tela tenha chamado
  const userName = review.name || review.user || 'Usuário';
  const userComment = review.content || review.comment || '';
  const userAvatar = review.avatar || review.profilePic || '';

  return (
    <View style={movieStyle.detailsReviewItem}>
      {/* Avatar do Usuário Condicional */}
      <View style={[movieStyle.detailsReviewAvatar, { overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]}>
        {userAvatar ? (
          <Image 
            source={{ uri: userAvatar }} 
            style={{ width: 40, height: 40, borderRadius: 20 }} 
          />
        ) : (
          <Feather name="user" size={24} color="#2A0800" />
        )}
      </View>

      {/* Conteúdo do Comentário */}
      <View style={movieStyle.detailsReviewContent}>
        <Text style={textStyle.detailsReviewUser}>
          {userName}{' '}
          <Text style={textStyle.detailsReviewStars}>
            {'★'.repeat(review.rating || 0)}
          </Text>
        </Text>
        <Text style={textStyle.detailsReviewText}>
          {userComment}
        </Text>
      </View>
    </View>
  );
}