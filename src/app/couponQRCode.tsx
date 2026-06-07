import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

import { qrCodeStyle } from '@/styles/qrcode';
import { COLORS } from '@/constants/colors';
import { BackButton } from '@/components/BackButton';
import BottomNavbar from '@/components/Navbar';

export default function CouponQRCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idResgate = (params.id as string) || "PPC-8899-X7T";
  const tituloCupom = (params.titulo as string) || "Combo 50% Off";
  const descCupom = (params.desc as string) || "Válido para qualquer filme 2D ou 3D em dias úteis.";
  const status = (params.status as string) || "DISPONÍVEL";
  const urlIcone = (params.url_icone as string) || null;

  return (
    <View style={qrCodeStyle.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={qrCodeStyle.scrollContent}>
        
        {/* Header */}
        <View style={qrCodeStyle.header}>
          <BackButton onPress={() => router.back()} />
          <Text style={qrCodeStyle.headerTitle}>Meu Cupom</Text>
        </View>

        <View style={qrCodeStyle.infoCard}>
          <Image 
            source={urlIcone ? { uri: urlIcone } : require('@/screenAssets/logo/balde.png')}
            style={qrCodeStyle.couponIcon} 
            resizeMode="contain" 
          />
          <Text style={qrCodeStyle.couponTitle}>{tituloCupom}</Text>
          <Text style={qrCodeStyle.couponDesc}>{descCupom}</Text>
          
          <View style={{ backgroundColor: status === 'USADO' ? COLORS.primary : COLORS.gold, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 12 }}>
            <Text style={{ color: '#000000', fontFamily: 'Poppins-Bold', fontSize: 15 }}>
              {status}
            </Text>
          </View>
        </View>

        <Text style={qrCodeStyle.validationTitle}>Código de Validação</Text>

        <View style={qrCodeStyle.qrCardWrapper}>
          <View style={qrCodeStyle.qrBackground}>
            <QRCode
              value={idResgate} 
              size={200}
              color="#000"
              backgroundColor="#FFF"
              logo={require('@/screenAssets/logo/balde.png')}
              logoSize={50}
              logoBackgroundColor="#FFF"
              logoBorderRadius={10}
              logoMargin={5}
            />
          </View>
          
          <Text style={qrCodeStyle.codeLabel}>CÓDIGO MANUAL</Text>
          <Text style={qrCodeStyle.codeValue}>{idResgate}</Text>
        </View>

        {/* Instrução Final */}
        <Text style={qrCodeStyle.instructionText}>
          Apresente este QR Code na bilheteria ou bomboniere. O código manual pode ser utilizado caso haja problemas de leitura.
        </Text>

      </ScrollView>

      <BottomNavbar />
    </View>
  );
}