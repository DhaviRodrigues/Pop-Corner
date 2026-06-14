import React from 'react';
import { TextInput, View, StyleProp, ViewStyle } from 'react-native';
import { couponFormStyle as S, placeholderColor } from '@/styles/couponForm';

interface DateInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function DateInput({ placeholder, value, onChangeText, style }: DateInputProps) {
  const handleDateChange = (text: string) => {
    // remove tudo que não é número
    const cleaned = text.replace(/\D/g, '');

    // limita a 8 dígitos (ddmmyyyy)
    if (cleaned.length > 8) {
      return;
    }

    // formata automaticamente: dd/mm/aaaa
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4);
    }

    onChangeText(formatted);
  };

  return (
    <View style={[S.inputWrapper, style]}>
      <TextInput
        style={S.inputText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={handleDateChange}
        keyboardType="numeric"
        maxLength={10} // dd/mm/aaaa = 10 caracteres
      />
    </View>
  );
}
