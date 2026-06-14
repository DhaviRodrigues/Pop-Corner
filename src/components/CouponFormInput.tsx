import React from 'react';
import { TextInput, View, StyleProp, ViewStyle } from 'react-native';
import { couponFormStyle as S, placeholderColor } from '@/styles/couponForm';

interface FormInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'url';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function FormInput({ placeholder, value, onChangeText, keyboardType = 'default', style, disabled = false }: FormInputProps) {
  return (
    <View style={[S.inputWrapper, disabled && { backgroundColor: '#D3D3D3', opacity: 0.6 }, style]}>
      <TextInput
        style={S.inputText}
        placeholder={placeholder}
        placeholderTextColor={disabled ? '#999999' : placeholderColor}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={!disabled}
      />
    </View>
  );
}