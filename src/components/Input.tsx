import { componentStyle } from "@/styles/component";
import { 
  Image, 
  ImageSourcePropType, 
  TextInput, 
  View, 
  StyleProp, 
  ViewStyle, 
  TextStyle,
  KeyboardTypeOptions // 1. Adicionamos essa importação
} from "react-native";

type InputProps = {
  icon?: ImageSourcePropType;
  text: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (value: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  keyboardType?: KeyboardTypeOptions; // 2. Colocamos na "lista VIP" (o ? significa que é opcional)
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
  inputStyle,
  keyboardType // 3. Recebemos a prop aqui
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
        keyboardType={keyboardType} 
      />
    </View>
  );
}