import React, { useState, useEffect } from "react";
import { View, Text, Image, useWindowDimensions } from "react-native"; // <-- Image importado aqui
import { BoxDark } from "@/components/BoxDark";
import { ButtonY } from "@/components/ButtonY";
import { COLORS } from "@/constants/colors";
import { componentStyle } from "@/styles/component";
import { AdminEditButton } from "@/components/AdminEditButton";
import { AdminDeleteButton } from "@/components/AdminDeleteButton";
import FontAwesome5 from "@expo/vector-icons/build/FontAwesome5";

type StoreCouponProps = {
  id?: string;
  title: string;
  type: string;
  circleText: string;
  pipokaCost: number;
  description: string;
  timer?: Date;
  amount?: number;
  isAdmin?: boolean;
  urlIcone?: string; // <-- Propriedade do ícone adicionada aqui
  onEdit?: (id: string) => void;
  onDelete?: (id: string, password: string) => Promise<void>;
};

export function StoreCoupon({ 
  id, 
  title, 
  type, 
  circleText, 
  pipokaCost, 
  description, 
  timer, 
  amount,
  isAdmin,
  urlIcone,
  onEdit,
  onDelete
}: StoreCouponProps) {
  const { height } = useWindowDimensions();
  const dynamicPadTop = height * 0.02;

  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!timer) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(timer).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer(); 
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId); 
  }, [timer]);

  const renderCurrencySymbol = () => {
    if (type === 'PORCENTAGEM' || type.toLowerCase() === 'percentual') {
      return <Text style={componentStyle.coupomCircleCurrency}>%</Text>;
    }
    if (type === 'VALOR_FIXO' || type.toLowerCase() === 'valor fixo') {
      return <Text style={componentStyle.coupomCircleCurrency}> R$</Text>;
    }
    return null;
  };

  const renderTopBadge = () => {
    const iconSize = height * 0.018;

    if (timer) {
      return (
        <View style={componentStyle.badgeWrapper}>
          <View style={componentStyle.badgePill}>
            <Text style={componentStyle.badgeText}>
              Acaba em: <Text style={{fontWeight: '400'}}>{timeLeft}</Text>
            </Text>
          </View>
          <View style={componentStyle.badgeCircle}>
            <FontAwesome5 name="stopwatch" size={iconSize} color={COLORS.gold} />
          </View>
        </View>
      );
    } 
    else if (amount !== undefined && amount !== null) {
      return (
        <View style={componentStyle.badgeWrapper}>
          <View style={componentStyle.badgePill}>
            <Text style={componentStyle.badgeText}>
              Restam: <Text style={{fontWeight: '400'}}>{amount} unidades</Text>
            </Text>
          </View>
          <View style={componentStyle.badgeCircle}>
            <FontAwesome5 name="exclamation" size={iconSize} color={COLORS.gold} />
          </View>
        </View>
      );
    }
    return null;
  };

  // Verifica se o cupom é de um tipo que deve renderizar a imagem
  const isImageCoupon = type.toLowerCase() === 'dois por um' || type.toLowerCase() === 'produto grátis' || type === 'DOIS_POR_UM' || type === 'PRODUTO_GRATIS';

 return (
    <View style={{ position: 'relative', marginTop: 15 }}>
      {renderTopBadge()}

      <BoxDark vw={0.4} padTop={dynamicPadTop}>
        {isAdmin && id && (
          <View style={{
            position: 'absolute',
            top: 25,
            right: 10,
            flexDirection: 'row',
            gap: 8,
            zIndex: 10,
          }}>
            <AdminEditButton onPress={() => onEdit?.(id)} />
            <AdminDeleteButton 
              itemName="cupom" 
              onConfirmDelete={(password) => onDelete?.(id, password) || Promise.resolve()}
            />
          </View>
        )}

          <View style={[componentStyle.coupomContainer, { paddingTop: isAdmin && id ? height * 0.1 : 0 }]}>
            <Text style={componentStyle.coupomTitle}>{title}</Text>
          <View style={componentStyle.coupomGlowContainer}>
            <View style={componentStyle.coupomCircle}>
              {/* LÓGICA DE RENDERIZAÇÃO DA IMAGEM ADICIONADA AQUI */}
              {isImageCoupon && urlIcone ? (
                <Image 
                  source={{ uri: urlIcone }} 
                  style={{ width: '65%', height: '65%', resizeMode: 'contain' }} 
                />
              ) : (
                <Text style={componentStyle.coupomCircleValue}>
                  {circleText}
                  {renderCurrencySymbol()}
                </Text>
              )}
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
              w={height * 0.13}
              h={height * 0.06}
              textSize={height * 0.016}
            />
        </View>
      </BoxDark>
    </View>
  );
}