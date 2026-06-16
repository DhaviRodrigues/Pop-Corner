import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importação correta
import { useAuth } from '@/contexts/UserContext';
import { fetchUserCoupons } from '@/services/userservice';
import { BackButton } from '@/components/BackButton';
import { useRouter } from 'expo-router';
import { UserCoupon } from '@/components/UserCoupon';
import { miscStyle } from '@/styles/misc';
import { textStyle } from '@/styles/text';
import { COLORS } from '@/constants/colors';
import BottomNavbar from '@/components/Navbar';
import { TitleBar } from '@/components/TitleBar';
import { Dimensions } from 'react-native';

export default function CouponsScreen() {
  const { user } = useAuth();
  const {height} = useWindowDimensions()
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadCoupons = async () => {
      const userId = (user as any)?.uid || (user as any)?.id;
      if (userId) {
        const data = await fetchUserCoupons(userId);
        setCoupons(data);
      }
      setLoading(false);
    };
    loadCoupons();
  }, [user]);

  return (
    <SafeAreaView style={[miscStyle.background, { flex: 1 }]} edges={['top', 'left', 'right']}>
      {/* Cabeçalho Fixo */}
      <View style={{ width: '100%' }}>
        <TitleBar title="Meus Cupons" />
        <View style={{ position: 'absolute', left: 20, top: 15 }}>
          <BackButton onPress={() => router.back()} />
        </View>
      </View>

      {/* Conteúdo Principal (Flexível) */}
      <View style={{ flex: 1, width: '100%' }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={COLORS.gold} size="large" />
          </View>
        ) : (
          <FlatList
            data={coupons}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingHorizontal: 20,
              paddingBottom: 160,
              alignItems: 'center' 
            }}
            renderItem={({ item }) => (
              <UserCoupon 
                title={item.title || "Cupom"}
                type={item.type}
                circleText={item.circleText}
                discountAmount={String(item.discountAmount) || "0"}
                description={item.description || "Sem descrição"}
                status={item.status || "Inativo"}
                validity={item.validity || "N/A"}
                urlIcone={item.urlIcone}
                validationCode={item.validationCode}
              />
            )}
            ListEmptyComponent={
              <Text style={[textStyle.message, { marginTop: 50, textAlign: 'center' }]}>
                Você ainda não possui cupons resgatados.
              </Text>
            }
          />
        )}
      </View>
      <View style={[{ marginBottom: height *0.1 }]}></View>

      {/* Navbar Fixa no fundo */}
      <BottomNavbar />
    </SafeAreaView>
  );
}