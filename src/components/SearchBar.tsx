import React from 'react';
import { View, TextInput, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';

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

const styles = StyleSheet.create({
  container: {
    width: "105%", 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: height * 0.015,
    paddingHorizontal: "5%", 
    left: "-4%", 
  },
  inputWrapper: {
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 50, 
    borderWidth: 3, 
    borderColor: COLORS.red,
    paddingHorizontal: 15,
    height: height * 0.06,
    marginRight: 12, 
  },
  filterTrigger: {
    width: height * 0.06,  
    height: height * 0.06, 
    borderRadius: (height * 0.06) / 2, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 3, 
    borderColor: COLORS.red, 
  },
  filterTriggerActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.gold,
   
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#A0A0A0', 
    marginRight: 10,
  },
  filterIcon: {
    width: 24,
    height: 24,
    
  },
  input: {
    flex: 1, 
    fontSize: height * 0.018,
    color: '#333',
    fontWeight: '600',
  }
});