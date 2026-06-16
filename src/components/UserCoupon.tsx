import React, { useState } from "react";
import { View, Text, Image, useWindowDimensions } from "react-native";
import { COLORS } from "@/constants/colors";
import { ButtonY } from "@/components/ButtonY";
import { componentStyle } from "@/styles/component";
import { router, useRouter } from 'expo-router';

type UserCouponProps = {
  title: string;
  type: string;
  circleText: string;
  discountAmount: string;
  description: string;
  status: string;
  validity: string;
  urlIcone?: string;
  validationCode?: string;
  onShowCode?: () => void;
};

export function UserCoupon({
  title,
  type = "",
  circleText = "",
  discountAmount,
  description,
  status,
  validity,
  urlIcone,
  validationCode,
  onShowCode,
}: UserCouponProps) {
  const [showCode, setShowCode] = useState(false);
  const { height } = useWindowDimensions();

  const isImageCoupon = 
    (type?.toLowerCase() === 'dois por um') || 
    (type?.toLowerCase() === 'produto grátis') || 
    (type === 'DOIS_POR_UM') || 
    (type === 'PRODUTO_GRATIS');

  const handleShowCode = () => {
      router.push({
      pathname: '/couponQRCode',
      params: {
        id: validationCode || "PPC-8899-X7T",
        titulo: title,
        desc: description,
        status: status,
        url_icone: urlIcone || "",
      }
    });
    
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
            {isImageCoupon && urlIcone ? (
              <Image 
                source={{ uri: urlIcone }} 
                style={{ width: '65%', height: '65%' }} 
                resizeMode="contain"
              />
            ) : (
              <Text style={componentStyle.userCouponCircleText}>
                {circleText}
                {(type === 'VALOR_FIXO' || type === 'valor fixo') && (
                  <Text style={componentStyle.coupomCircleCurrency}> R$</Text>
                )}
              </Text>
            )}
          </View>
            <Text 
              style={componentStyle.userCouponLeftDescription} 
              numberOfLines={3} 
              ellipsizeMode="tail"
            >
              {description}
          </Text>
        </View>
        <View style={componentStyle.userCouponRightSection}>
          <View style={{ width: '100%' }}>
            <Text style={componentStyle.userCouponRightTitle}>Detalhes</Text>
            <View style={componentStyle.userCouponDetailRow}>
              <Text style={componentStyle.userCouponDetailLabel}>Validade: </Text>
              <Text style={componentStyle.userCouponDetailValue}>{validity}</Text>
            </View>
            <View style={componentStyle.userCouponDetailRow}>
              <Text style={componentStyle.userCouponDetailLabel}>Status: </Text>
              <Text style={statusStyle}>{status}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', width: '100%', marginTop: 10 }}>
            <ButtonY
              title={showCode ? "Ocultar Código" : "Mostrar Código"}
              w="100%"
              h={height * 0.07  } 
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
                {validationCode || "PPC-8899-X7T"}
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