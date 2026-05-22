import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DynamicStarsProps {
  rating: number;
  starSize?: number;    
  colorBackground?: string; 
  colorForeground?: string; 
}

export function DynamicStars({ 
  rating, 
  starSize = 16, 
  colorBackground = "#4A2010", 
  colorForeground = "#FFFEB2" 
}: DynamicStarsProps) {
  const fills = [
    Math.max(0, Math.min(1, rating - 0)),
    Math.max(0, Math.min(1, rating - 1)),
    Math.max(0, Math.min(1, rating - 2)),
    Math.max(0, Math.min(1, rating - 3)),
    Math.max(0, Math.min(1, rating - 4))
  ];

  return (
    <View style={styles.wrapper}>
      {fills.map((fill, index) => (
        <View key={index} style={styles.singleStarContainer}>
          {/* Estrela de Fundo (Vazia) */}
          <Text style={{ color: colorBackground, fontSize: starSize }}>★</Text>
          
          {/* Estrela de Frente (Cheia/Parcial) */}
          <View style={[styles.starOverlay, { width: `${fill * 100}%` }]}>
            <Text style={{ color: colorForeground, fontSize: starSize }}>★</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2, 
  },
  singleStarContainer: {
    position: "relative",
  },
  starOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
  },
});