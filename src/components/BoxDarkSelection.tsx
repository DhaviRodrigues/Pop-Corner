import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { profileStyle } from "@/styles/profile";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
      <MaterialCommunityIcons name="chevron-right" size={24} color={color} />
    </TouchableOpacity>
  );
}
