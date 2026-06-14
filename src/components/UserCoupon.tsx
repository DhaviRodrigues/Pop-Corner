import React, { useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { COLORS } from "@/constants/colors";
import { ButtonY } from "@/components/ButtonY";
import { componentStyle } from "@/styles/component";

type UserCouponProps = {
  title: string;
  discountAmount: string;
  description: string;
  status: "Ativo" | "Expirado" | "Inativo";
  validity: string;
  onShowCode?: () => void;
};

export function UserCoupon({title,discountAmount,description,status,validity,onShowCode,}: UserCouponProps) {
  const [showCode, setShowCode] = useState(false);
  const { height } = useWindowDimensions();

  const handleShowCode = () => {
    setShowCode(!showCode);
    onShowCode?.();
  };

  const statusStyle = status === "Ativo" 
    ? componentStyle.userCouponStatusActive 
    : componentStyle.userCouponStatusInactive;

  return (
    <View style={componentStyle.userCouponContainer}>
      <View style={componentStyle.userCouponTicketWrapper}>
        <View style={componentStyle.userCouponLeftSection}>
          <Text style={componentStyle.userCouponLeftTitle}>{title}</Text>
          <View style={componentStyle.userCouponCircleGlow}>
            <Text style={componentStyle.userCouponCircleText}>
              {discountAmount}
              <Text style={componentStyle.coupomCircleCurrency}> R$</Text>
            </Text>
          </View>
          <Text style={componentStyle.userCouponLeftDescription}>*{description}</Text>
        </View>
        <View style={componentStyle.userCouponRightSection}>
          <View style={{ width: '100%' }}>
            <Text style={componentStyle.userCouponRightTitle}>Detalhes</Text>
            <View style={componentStyle.userCouponDetailRow}>
              <Text style={componentStyle.userCouponDetailLabel}>Status: </Text>
              <Text style={statusStyle}>{status}</Text>
            </View>
            <View style={componentStyle.userCouponDetailRow}>
              <Text style={componentStyle.userCouponDetailLabel}>Validade: </Text>
              <Text style={componentStyle.userCouponDetailValue}>{validity}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', width: '100%', marginTop: 10 }}>
            <ButtonY
              title={showCode ? "Ocultar Código" : "Mostrar Código"}
              w="100%"
              h={height * 0.05} 
              textSize={14}
              onPress={handleShowCode}
            />
          </View>
          {showCode && (
            <View
              style={{
                backgroundColor: COLORS.primaryDark,
                paddingVertical: 8,
                borderRadius: 8,
                marginTop: 8,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: COLORS.gold,
              }}
            >
              <Text style={{ fontSize: 14, color: COLORS.gold, fontWeight: "bold", letterSpacing: 1 }}>
                CUPOM2026
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={componentStyle.userCouponCutoutLeft} />
      <View style={componentStyle.userCouponCutoutRight} />

    </View>
  );
}