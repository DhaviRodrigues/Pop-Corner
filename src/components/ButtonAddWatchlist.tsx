import { buttonStyle } from "@/styles/button";
import { Text, TouchableOpacity, useWindowDimensions, DimensionValue } from "react-native";

type ButtonProps = {
  title?: string;
  h?: DimensionValue;
  w?: DimensionValue;
  textSize?: number;
  align?: "flex-start" | "center" | "flex-end";
  borderRadius?: number;
  onPress?: () => void;
};

export function ButtonAddWatchlist({ title = "Adicionar a Watchlist", h, w, textSize, align, borderRadius, onPress }: ButtonProps) {
  const { height, width: screenWidth } = useWindowDimensions();

  const dynamicHeight = h || height * 0.065; 
  const dynamicRadius = borderRadius || 50; 
  const dynamicTextSize = textSize || height * 0.020; 
  const dynamicShadowRadius = height * 0.0158;

  return (
    <TouchableOpacity 
      style={[buttonStyle.buttonY, buttonStyle.button, { 
        height: dynamicHeight, 
        width: w || screenWidth * 0.65, 
        justifyContent: align || "center", 
        borderRadius: dynamicRadius, 
        marginTop: height * 0.02, 
        marginBottom: height * 0.01,
        
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: dynamicShadowRadius
      }]} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <Text 
        style={[buttonStyle.buttonText, buttonStyle.buttonYText, { fontSize: dynamicTextSize }]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}