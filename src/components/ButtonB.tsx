import { Text, TouchableOpacity } from "react-native";
import { style } from "@/styles/style";

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

export function ButtonB({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[style.buttonB, style.button]} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <Text style={[style.buttonText, style.buttonBText]}>{title}</Text>
    </TouchableOpacity>
  );
}