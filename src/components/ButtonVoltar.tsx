import { Text, TouchableOpacity } from "react-native";
import { buttonStyle } from "@/styles/button";

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

export function ButtonVoltar({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[buttonStyle.button, buttonStyle.buttonVoltar]} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <Text style={[buttonStyle.buttonVoltarText]}>{title}</Text>
    </TouchableOpacity>
  );
}