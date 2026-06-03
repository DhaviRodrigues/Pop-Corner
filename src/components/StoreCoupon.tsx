import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { BoxDark } from "@/components/BoxDark";
import { ButtonY } from "@/components/ButtonY";
import { COLORS } from "@/constants/colors";
import {componentStyle} from "@/styles/component";

type StoreCouponProps = {
  title: string;
  type: string;
  circleText: string;
  pipokaCost: number;
  description: string;
  timer?: Date;
  amount?: number;
};

export function StoreCoupon({ title, type, circleText, pipokaCost, description, timer, amount }: StoreCouponProps) {
  const { height } = useWindowDimensions();
  
  const dynamicPadTop = height * 0.02;

  return (
    <BoxDark vw={0.4} padTop={dynamicPadTop}>
      <View style={componentStyle.coupomContainer}>
        <Text style={componentStyle.coupomTitle}>{title}</Text>
        <View style={componentStyle.coupomGlowContainer}>
          <View style={componentStyle.coupomCircle}>
            <Text style={componentStyle.coupomCircleValue}>
              {circleText}
              <Text style={componentStyle.coupomCircleCurrency}> R$</Text>
            </Text>
          </View>
        </View>
        <Text style={componentStyle.coupomPipokaText}>
          <Text style={componentStyle.coupomPipokaCost}>{pipokaCost} </Text>
          Pipokas
        </Text>
        <View style={componentStyle.coupomDivider} />
        <Text style={componentStyle.coupomDescription}>{description}</Text>
          <ButtonY
            title="TROQUE AGORA!"
            w={height * 0.16}
            h={height * 0.08}
            textSize={height * 0.022}
          />
      </View>
    </BoxDark>
  );
}
