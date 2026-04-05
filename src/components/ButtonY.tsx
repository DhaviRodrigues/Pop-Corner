import { style } from "@/styles/style";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

export function ButtonY({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[style.buttonY, style.button]} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <Text style={[style.buttonText, style.buttonYText]}>{title}</Text>
    </TouchableOpacity>
  );
}