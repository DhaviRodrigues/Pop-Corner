import React from 'react';
import { View, Text, Image } from 'react-native';
import { sessionsStyle } from '@/styles/sessions';

type SessionCardProps = {
  movie: any;
  horarios: string[];
};

export function SessionCard({ movie, horarios }: SessionCardProps) {
  const imageUrl = movie?.image || movie?.url_imagem || '';
  const title = movie?.title || movie?.titulo || 'Filme Desconhecido';
  const duration = movie?.duration || 'Duração indisponível';

  return (
    <View style={sessionsStyle.cardContainer}>
      <Image 
        source={imageUrl ? { uri: imageUrl } : require('@/screenAssets/movie-tape.png')} 
        style={sessionsStyle.poster} 
        resizeMode="cover" 
      />
      
      <View style={sessionsStyle.infoContainer}>
        <Text style={sessionsStyle.movieTitle} numberOfLines={2}>{title}</Text>
        <Text style={sessionsStyle.duration}>{duration}</Text>
        
        {/* A Linha Vermelha de grossura 2 */}
        <View style={sessionsStyle.divider} />
        
        <View style={sessionsStyle.timesWrapper}>
          {horarios.map((hora, index) => (
            <View key={index} style={sessionsStyle.timePill}>
              <Text style={sessionsStyle.timeText}>{hora}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}