import React from 'react';
import { TextInput, View, StyleProp, ViewStyle } from 'react-native';
import { couponFormStyle as S, placeholderColor } from '@/styles/couponForm';

interface FormInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'url';
  style?: StyleProp<ViewStyle>;
}

export function FormInput({ placeholder, value, onChangeText, keyboardType = 'default', style }: FormInputProps) {
  return (
    <View style={[S.inputWrapper, style]}>
      <TextInput
        style={S.inputText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}