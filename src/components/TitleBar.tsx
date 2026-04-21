import React from "react";
import { View, Text } from "react-native";
import { componentStyle } from "@/styles/component";

type TitleBarProps = {
  title: string;
};

export function TitleBar({ title }: TitleBarProps) {
  return (
    <View style={componentStyle.titleBarContainer}>
      <Text style={componentStyle.welcomeTitle}>
        {title}
      </Text>
    </View>
  );
}