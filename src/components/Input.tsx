import { componentStyle } from "@/styles/component";
import { Image, ImageSourcePropType, TextInput, View } from "react-native";

// Definição da interface para garantir a tipagem estática das propriedades do componente.
type InputProps = {
  icon?: ImageSourcePropType;
  text: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (value: string) => void;
};

export function Input({ icon, text, secureTextEntry, value, onChangeText }: InputProps) {
  return (
    <View style={componentStyle.inputContainer}>
      {icon && (
        <Image source={icon} style={componentStyle.inputIcon} resizeMode="contain" />
      )}
      
      <TextInput
        placeholder={text}
        placeholderTextColor="#A9A9A9"
        // A propriedade outlineStyle é utilizada para garantir a consistência visual em navegadores web.
        style={[componentStyle.inputText, { outlineStyle: 'none' } as any]} 
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}