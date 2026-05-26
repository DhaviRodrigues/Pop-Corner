import React from 'react';
import { View, TextInput, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { searchBarStyles as styles } from '@/styles/searchbar';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onToggleFilters?: () => void;
  filtersVisible?: boolean;
  showAddButton?: boolean;
  onAddPress?: () => void;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "Buscar...",
  onToggleFilters,
  filtersVisible = false,
  showAddButton = false,
  onAddPress
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      
      <View style={[styles.inputWrapper, showAddButton && { paddingRight: 60 }]}>
        <Image 
          source={require('@/screenAssets/icons/search.png')} 
          style={styles.searchIcon} 
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0" 
          value={value}
          onChangeText={onChangeText}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />

        {showAddButton && (
          <TouchableOpacity 
            onPress={onAddPress}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Container do Filtro (lado de fora) */}
      <View style={styles.actionsContainer}>
        {onToggleFilters && (
          <TouchableOpacity 
            onPress={onToggleFilters} 
            style={[
              styles.filterTrigger, 
              filtersVisible && styles.filterTriggerActive 
            ]}
          >
            <Image 
              source={require('@/screenAssets/filter.svg')} 
              style={[
                styles.filterIcon,
                { tintColor: filtersVisible ? COLORS.gold : '#A0A0A0' } 
              ]} 
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}