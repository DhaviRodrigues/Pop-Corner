import { style } from "@/styles/style";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

export function ButtonR({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={style.buttonR} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <Text style={style.buttonRText}>{title}</Text>
    </TouchableOpacity>
  );
}