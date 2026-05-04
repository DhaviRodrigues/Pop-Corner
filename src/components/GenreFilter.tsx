import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import {COLORS} from '@/constants/colors'; 

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

const styles = StyleSheet.create({
  container: { 
    marginBottom: height * 0.010,
    bottom: height * 0.01,
  },
  scrollContent: {
    paddingHorizontal: "3%",
  },
  genreBtn: { 
    paddingVertical: height * 0.006, 
    paddingHorizontal: 14, 
    borderWidth: 3, 
    borderColor: COLORS.gold,
    borderRadius: 20, 
    marginRight: 8,
    backgroundColor: COLORS.primaryDark
  },
  activeGenreBtn: { 
    backgroundColor: COLORS.gold 
  },
  genreText: {
    color: COLORS.gold ,
    fontSize: height * 0.013,
    fontWeight: 'bold',
  },
  activeGenreText: {
    color: COLORS.primaryDark,
    fontWeight: 'bold',
  }
});