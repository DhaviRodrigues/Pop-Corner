import React from 'react';
import { View, TextInput, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { searchBarStyles as styles } from '@/styles/searchbar';

const { height } = Dimensions.get('window');

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onToggleFilters?: () => void;
  filtersVisible?: boolean;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "Buscar...",
  onToggleFilters,
  filtersVisible = false 
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      
      <View style={styles.inputWrapper}>
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
      </View>

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
  );
}
