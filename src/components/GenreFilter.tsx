import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import {COLORS} from '@/constants/colors'; 
import { genreFilterStyles as styles } from '@/styles/searchbar';

const { height } = Dimensions.get('window');

interface GenreFilterProps {
  availableGenres: string[];
  selectedGenres: string[];
  onToggleGenre: (genre: string) => void;
}

export default function GenreFilter({ availableGenres, selectedGenres, onToggleGenre }: GenreFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {availableGenres.map(genre => {
          const isActive = selectedGenres.includes(genre);
          return (
            <TouchableOpacity 
              key={genre} 
              onPress={() => onToggleGenre(genre)}
              style={[styles.genreBtn, isActive && styles.activeGenreBtn]}
            >
              <Text style={[styles.genreText, isActive && styles.activeGenreText]}>
                {genre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
