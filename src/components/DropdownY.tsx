import React, { useState } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { componentStyle } from '@/styles/component';
import { COLORS } from '@/constants/colors';

const { height } = Dimensions.get('window');

type DropdownYProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
};

export function DropdownY({ selectedValue, onValueChange }: DropdownYProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pressedValue, setPressedValue] = useState<string | null>(null);

  const options = [
    { value: 'addition', label: 'Data de Adição' },
    { value: 'alphabetical', label: 'Alfabética' },
    { value: 'release', label: 'Data de Lançamento' },
    { value: 'genres', label: 'Gêneros Favoritos' },
  ];

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  const optionHeight = height * 0.048; 
  const totalMenuHeight = optionHeight * 4;

  return (
    <View style={componentStyle.dropdownWrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsOpen(!isOpen)}
        style={componentStyle.dropButtonContainer}
      >
        <Text style={componentStyle.dropButtonText}>Ordenar por</Text>
        <Image
          source={require('@/screenAssets/seta-baixo.svg')}
          style={{
            width: height * 0.014,
            height: height * 0.014,
            transform: [{ rotate: isOpen ? '180deg' : '0deg' }]
          }}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={[componentStyle.dropOptions, { height: totalMenuHeight }]}>
          {options.map((item) => {
            const isCurrentlyPressed = pressedValue === item.value;
            const isSelected = selectedValue === item.value;
            
            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={1}
                onPressIn={() => setPressedValue(item.value)}
                onPressOut={() => setPressedValue(null)}
                onPress={() => handleSelect(item.value)}
                style={[
                  componentStyle.dropOptionItem,
                  { 
                    height: optionHeight,
                    backgroundColor: isCurrentlyPressed ? COLORS.primary : 'transparent' 
                  }
                ]}
              >
                <Text 
                  style={[
                    componentStyle.dropOptionText, 
                    { 
                      color: isCurrentlyPressed ? COLORS.gold : COLORS.primary,
                      fontWeight: isSelected ? 'bold' : 'semibold' 
                    }
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}