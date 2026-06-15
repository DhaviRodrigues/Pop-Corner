import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/colors";
import { componentStyle } from "@/styles/component";

type DisplayCouponProps = {
  title: string;
  discountAmount: string;
  description: string;
  status: "Ativo" | "Inativo";
  validity: string;
};

export function DisplayCoupon({ title, discountAmount, description, status, validity }: DisplayCouponProps) {
  const router = useRouter();

  return (
    // Envolvendo na BoxDark (usando o estilo definido em component.js)
    <View style={componentStyle.boxDark}>
      <View style={componentStyle.coupomContainer}>
        <Text style={componentStyle.coupomTitle}>{title}</Text>
        
        <View style={componentStyle.coupomGlowContainer}>
          <View style={componentStyle.coupomCircle}>
            <Text style={componentStyle.coupomCircleValue}>{discountAmount}</Text>
          </View>
        </View>

        <Text style={componentStyle.coupomPipokaText}>{description}</Text>
        <View style={componentStyle.coupomDivider} />
        
        <Text style={status === "Ativo" ? componentStyle.userCouponStatusActive : componentStyle.userCouponStatusInactive}>
          {status}
        </Text>
        <Text style={componentStyle.coupomDescription}>Validade: {validity}</Text>

        {/* Botão para QR Code */}
        <TouchableOpacity 
          style={[componentStyle.dropdownContainer, { marginTop: 15, paddingHorizontal: 20 }]} 
          onPress={() => router.push("/couponQRCode")}
        >
          <Text style={componentStyle.dropdownText}>Ver QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}