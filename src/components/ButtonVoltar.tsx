import { Text, TouchableOpacity } from "react-native";
import { style } from "@/styles/style";

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

export function ButtonVoltar({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[style.buttonVoltar]} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <Text style={[style.buttonVoltarText]}>{title}</Text>
    </TouchableOpacity>
  );
}