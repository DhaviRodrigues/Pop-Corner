import { View, useWindowDimensions } from "react-native";
import { style } from "@/styles/style";
import { Children, ReactNode } from "react";

type BoxProps = {
vw: number;
padTop: number;
children: ReactNode;
};

export function Box({ vw, padTop, children }: BoxProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const boxWidth = screenWidth * vw

  return (
    <View style={[style.box,{ width: boxWidth, minHeight: screenHeight * 0.4, paddingTop: padTop}]}>
      {children}
    </View>
  );
}