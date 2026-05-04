import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import {COLORS} from '@/constants/colors'; 

const { height } = Dimensions.get('window');

export interface SortOption {
  label: string;
  value: string;
}

interface SortFilterBarProps {
  options: SortOption[];
  activeSort: string;
  onSelectSort: (value: string) => void;
  sortAscending: boolean;
  onToggleAscending: () => void;
  extraFilters?: React.ReactNode;
}

export default function SortFilterBar({ 
  options, activeSort, onSelectSort, sortAscending, onToggleAscending, extraFilters 
}: SortFilterBarProps) {
  
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {options.map((option) => {
          const isActive = activeSort === option.value;
          return (
            <TouchableOpacity 
              key={option.value}
              onPress={() => onSelectSort(option.value)} 
              style={[styles.filterBtn, isActive && styles.activeBtn]}
            >
              <Text style={[styles.filterText, isActive && styles.activeText]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {extraFilters}

        <TouchableOpacity onPress={onToggleAscending} style={styles.sortDirectionBtn}>
          <Text style={styles.sortDirectionText}>
            {sortAscending ? '⬆ Asc' : '⬇ Desc'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    bottom: height * 0.02, 
    alignItems: 'flex-end', 
  },
  scrollContent: {
    justifyContent: 'flex-end',
    flexGrow: 1, 
    paddingHorizontal: 8,
  },
  filterBtn: { 
    paddingVertical: height * 0.008, 
    paddingHorizontal: 16, 
    backgroundColor: "transparent",
    borderRadius: 20, 
    marginRight: 8,
    borderWidth: 3,
    borderColor: COLORS.gold,
  },
  activeBtn: { 
    backgroundColor: COLORS.gold
  },
  filterText: {
    color: COLORS.gold,
    fontSize: height * 0.015,
    fontWeight: 'bold',
  },
  activeText: {
    color: COLORS.primaryDark,
  },
  sortDirectionBtn: { 
    paddingVertical: height * 0.008, 
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.gold ,
    backgroundColor: "transparent",
  },
  sortDirectionText: {
    color: COLORS.gold || '#FFD700',
    fontSize: height * 0.015,
    fontWeight: 'bold',
  }
});