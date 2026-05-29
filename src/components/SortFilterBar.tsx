import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { sortFilterStyles as styles } from '@/styles/searchbar';

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
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        
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