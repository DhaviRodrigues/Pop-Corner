import { style } from "@/styles/style";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  title: string;
  h?: number;
  w?: number;
  textSize?: number;
  align?: "flex-start" | "center" | "flex-end";
  borderRadius?: number;
  onPress?: () => void;
};

export function ButtonY({ title, h, w, textSize, align, borderRadius, onPress }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[style.buttonY, style.button, { height: h, width: w, justifyContent: align, borderRadius: borderRadius }]} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <Text style={[style.buttonText, style.buttonYText]}>{title}</Text>
    </TouchableOpacity>
  );
}