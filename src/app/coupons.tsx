import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, Platform, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "@/components/Navbar";
import { StoreCoupon } from "@/components/StoreCoupon";
import { AdminAddButton } from "@/components/AdminAddButton";
import { movieStyle } from "@/styles/movie";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import { fetchCoupons, deleteCoupon } from "@/services/couponService";
import { verifyAdmin } from "@/services/userservice";

export default function Coupons() {
  const router = useRouter();
  const { user } = useUser();

  const [isAdmin, setIsAdmin] = useState(false);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Fetch coupons
      const couponsResult = await fetchCoupons();
      if (couponsResult.valid && couponsResult.data) {
        setCouponsList(couponsResult.data);
      }

      // Verify admin
      const adminResult = await verifyAdmin();
      if (adminResult.valid) {
        setIsAdmin(adminResult.isAdmin);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const handleEditCoupon = (couponId: string) => {
    router.push({
      pathname: "/addCoupons",
      params: { couponId }
    });
  };

  const handleDeleteCoupon = async (couponId: string, password: string) => {
    if (!isAdmin) {
      throw new Error("Not admin");
    }

    try {
      const result = await deleteCoupon(couponId);
      
      if (!result.valid) {
        throw new Error(result.error);
      }
      
      setCouponsList(prev => prev.filter(c => c.id !== couponId));
    } catch (error) {
      console.error("Erro ao deletar:", error);
      throw error;
    }
  };

  const renderCoupon = ({ item }: { item: any }) => {
    // Adicionamos os nomes (camelCase) que vieram do formulário como plano B
    return (
      <StoreCoupon
        id={item.id}
        title={item.nome_cupom || item.nome || ""}
        type={item.tipo_cupom || item.tipo || ""}
        circleText={String(item.valor_beneficio || item.valorBeneficios || "0")}
        pipokaCost={item.valor_pipokas || item.valorPipokas || 0}
        description={item.descricao_produto || item.observacoes || ""}
        timer={item.data_expiracao_resgate?.toDate?.() || item.dataExpiracao?.toDate?.()}
        amount={item.quantidade_disponivel || item.qtdCupons}
        isAdmin={isAdmin}
        onEdit={handleEditCoupon}
        onDelete={handleDeleteCoupon}
        urlIcone={item.urlIcone}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[movieStyle.filmesContainer, { flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[movieStyle.filmesContainer, { flex: 1, backgroundColor: COLORS.primary }]}>
      <View style={[movieStyle.filmesHeader, { position: 'relative' }]}>
        <Image source={require("@/screenAssets/logo/full-logo.png")} style={movieStyle.filmesLogo} />

        {isAdmin && (
          <AdminAddButton onPress={() => router.push("/addCoupons")} />
        )}
      </View>

      {couponsList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
          <Text style={{ color: COLORS.gold, fontSize: 16, fontFamily: "Poppins-Regular" }}>
            Nenhum cupom disponível
          </Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 10, paddingTop: 10 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              {couponsList
                .filter((_, index) => index % 2 === 0)
                .map((item, index) => (
                  <View key={`left-${item.id}-${index}`} style={{ marginBottom: 15 }}>
                    {renderCoupon({ item })}
                  </View>
                ))}
            </View>

            <View style={{ flex: 1, marginLeft: 5 }}>
              {couponsList
                .filter((_, index) => index % 2 !== 0)
                .map((item, index) => (
                  <View key={`right-${item.id}-${index}`} style={{ marginBottom: 15 }}>
                    {renderCoupon({ item })}
                  </View>
                ))}
            </View>
          </View>
        </ScrollView>
      )}

      <BottomNavbar />
    </SafeAreaView>
  );}