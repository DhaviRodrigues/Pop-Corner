import { COLORS } from "@/constants/colors";
import { buttonStyle } from "@/styles/button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, Text, TouchableOpacity } from "react-native";

const { height } = Dimensions.get('window');

interface LogoutButtonProps {
  onPress: () => void;
}

export function LogoutButton({ onPress }: LogoutButtonProps) {
  return (
    <TouchableOpacity style={buttonStyle.logoutButton} onPress={onPress}>
      <MaterialCommunityIcons name="logout" size={height * 0.02} color={COLORS.black} />
      <Text style={buttonStyle.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}
