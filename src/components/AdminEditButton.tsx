import React from "react";
import { TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";

type AdminEditButtonProps = {
  onPress: () => void;
};

export function AdminEditButton({ onPress }: AdminEditButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.gold,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Feather name="edit" size={18} color={COLORS.gold} />
    </TouchableOpacity>
  );
}
