import React from "react";
import { TouchableOpacity, Text, Platform } from "react-native";
import { COLORS } from "@/constants/colors";

type AdminAddButtonProps = {
  onPress: () => void;
};

export function AdminAddButton({ onPress }: AdminAddButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: "absolute",
        top: Platform.OS === 'web' ? 20 : 40,
        right: 20,
        backgroundColor: COLORS.primary,
        width: 55,
        height: 55,
        borderColor: COLORS.primaryDark,
        borderWidth: 4,
        borderRadius: 45,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 100,
      }}
    >
      <Text style={{ color: COLORS.gold, fontSize: 30, fontFamily: "Poppins-Bold", lineHeight: 30 }}>+</Text>
    </TouchableOpacity>
  );
}
