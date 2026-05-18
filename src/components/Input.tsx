import { componentStyle } from "@/styles/component";
import { Image, ImageSourcePropType, TextInput, View, StyleProp, ViewStyle, TextStyle } from "react-native";

type InputProps = {
  icon?: ImageSourcePropType;
  text: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (value: string) => void;
  // Novas props adicionadas para permitir multiline e estilos customizados
  multiline?: boolean;
  numberOfLines?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function Input({ 
  icon, 
  text, 
  secureTextEntry, 
  value, 
  onChangeText, 
  multiline, 
  numberOfLines, 
  containerStyle, 
  inputStyle 
}: InputProps) {
  return (
    <View style={[componentStyle.inputContainer, containerStyle]}>
      {icon && (
        <Image source={icon} style={componentStyle.inputIcon} resizeMode="contain" />
      )}
      
      <TextInput
        placeholder={text}
        placeholderTextColor="#A9A9A9"
        style={[componentStyle.inputText, { outlineStyle: 'none' } as any, inputStyle]} 
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}