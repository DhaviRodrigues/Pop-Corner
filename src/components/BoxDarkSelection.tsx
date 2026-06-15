import { COLORS } from "@/constants/colors";
import { profileStyle } from "@/styles/profile";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const chevronIcon = require("@/screenAssets/arrows.png"); 

type BoxDarkSelectionProps = {
  iconSource: ImageSourcePropType;
  title: string;
  description: string;
  onPress?: () => void;
  color?: string;
  style?: object;
};

export function BoxDarkSelection({
  iconSource,
  title,
  description,
  onPress,
  color = COLORS.white,
  style,
}: BoxDarkSelectionProps) {

  return (
    <TouchableOpacity onPress={onPress} style={[profileStyle.configRow, style]} activeOpacity={0.7}>
      <View style={profileStyle.configLeftContent}>
        <View style={profileStyle.configIcon}>
          <Image source={iconSource} style={[profileStyle.iconImage]} />
        </View>
        <View style={profileStyle.configTextContent}>
          <Text style={[profileStyle.configLabel, { color }]}>{title}</Text>
          <Text style={[profileStyle.configDescription, { color }]}>{description}</Text>
        </View>
      </View>
      
      <Image 
        source={chevronIcon} 
        style={{ width: 24, height: 24, tintColor: color }} 
      />
      
    </TouchableOpacity>
  );
}