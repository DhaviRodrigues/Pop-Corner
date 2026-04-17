import React from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native";
import { componentStyle } from "@/styles/component";

type TitleBarProps = {
  title: string;
  backgroundSource: ImageSourcePropType;
};

export function TitleBar({ title, backgroundSource }: TitleBarProps) {
  return (
    <View style={componentStyle.titleBarContainer}>
      <Image 
        source={backgroundSource} 
        style={[componentStyle.titleBackground, { width: '100%', height: 100 }]} 
        resizeMode="stretch" 
        />
      <Text style={componentStyle.welcomeTitle}>
        {title}
      </Text>
    </View>
  );
}