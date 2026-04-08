import React from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native";
import { style } from "@/styles/style";

type TitleBarProps = {
  title: string;
  backgroundSource: ImageSourcePropType;
};

export function TitleBar({ title, backgroundSource }: TitleBarProps) {
  return (
    <View style={style.titleBarContainer}>
      <Image 
        source={backgroundSource} 
        style={style.titleBackground} 
        resizeMode="cover" 
        />
      <Text style={style.welcomeTitle}>
        {title}
      </Text>
    </View>
  );
}