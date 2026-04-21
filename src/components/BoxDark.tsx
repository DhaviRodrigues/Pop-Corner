import { componentStyle } from "@/styles/component";
import { ReactNode } from "react";
import { View, useWindowDimensions } from "react-native";

type BoxProps = {
vw: number;
padTop: number;
children: ReactNode;
};

export function BoxDark({ vw, padTop, children }: BoxProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const boxWidth = screenWidth * vw

  return (
    <View style={[componentStyle.boxDark,{ width: boxWidth, paddingTop: padTop, paddingBottom: padTop}]}>
      {children}
    </View>
  );
}