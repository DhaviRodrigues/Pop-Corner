import { View, useWindowDimensions } from "react-native";
import { componentStyle } from "@/styles/component";
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
    <View style={[componentStyle.box,{ width: boxWidth, minHeight: screenHeight * 0.4, paddingTop: padTop}]}>
      {children}
    </View>
  );
}