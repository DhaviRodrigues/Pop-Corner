import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, Platform, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "@/components/Navbar";
import { StoreCoupon } from "@/components/StoreCoupon";
import { AdminAddButton } from "@/components/AdminAddButton";
import { movieStyle } from "@/styles/movie";
import { COLORS } from "@/constants/colors";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "@/contexts/UserContext";
import { fetchCoupons, deleteCoupon, purchaseCoupon } from "@/services/couponService";
import { verifyAdmin } from "@/services/userservice";
import { UserPipoka } from "@/components/UserPipoka";
import { ValidationPopup } from "@/components/ValidationPopup";
import { Coupon } from "@/models/coupon";

export default function Coupons() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const couponsResult = await fetchCoupons();
    
    if (couponsResult.valid && couponsResult.data) {
      setCouponsList(couponsResult.data);
    }

    const adminResult = await verifyAdmin();
    if (adminResult.valid) {
      setIsAdmin(adminResult.isAdmin);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handlePurchase = async (coupon: any) => {
    if (!user) return alert("Você precisa estar logado!");
    
    const userId = (user as any).uid || (user as any).id;
    const userPipokas = user.pipoka || 0;

    const result = await purchaseCoupon(userId, coupon, userPipokas);
    
    await refreshUser();
    await loadData();
    setPopupMessage(result.valid ? "Cupom resgatado com sucesso!" : result.error);
    setShowPopup(true);
  };

  useEffect(() => {
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
      throw error;
    }
  };

  const renderCoupon = ({ item }: { item: any }) => {
    return (
      <StoreCoupon
        id={item.id}
        title={item.nome_cupom || item.nome || ""}
        type={item.tipo_cupom || item.tipo || ""}
        circleText={String(item.valor_beneficio || item.valorBeneficios || "0")}
        pipokaCost={item.valor_pipokas || item.valorPipokas || 0}
        description={item.descricao_produto || item.observacoes || ""}
        timer={item.data_expiracao_resgate?.toDate?.() || item.dataExpiracao?.toDate?.()}
        amount={item.limitada ? (item.quantidade_disponivel ?? item.qtdCupons) : undefined}
        isAdmin={isAdmin}
        onEdit={handleEditCoupon}
        onDelete={handleDeleteCoupon}
        urlIcone={item.urlIcone}
        onPurchase={() => handlePurchase(item)} 
      />
    );
  };

  const availableCoupons = couponsList.filter(item => {
    const instance = Coupon.fromFirestore(item.id, item);
    const valid = instance.isDisponivelParaResgate();
    return valid;
  });

  if (loading) {
    return (
      <SafeAreaView style={[movieStyle.filmesContainer, { flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[movieStyle.filmesContainer, { flex: 1, backgroundColor: COLORS.primary }]}>
      <View style={[movieStyle.filmesHeader, { position: 'relative', paddingBottom: 10 }]}>
        <Image source={require("@/screenAssets/logo/full-logo.png")} style={movieStyle.filmesLogo} />

        {isAdmin && (
          <TouchableOpacity
            onPress={() => router.push("/validarCupom")}
            style={{
              position: "absolute",
              top: Platform.OS === 'web' ? 20 : 40,
              left: 20,
              backgroundColor: COLORS.gold,
              width: 90,
              height: 55,
              borderColor: COLORS.primaryDark,
              borderWidth: 4,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              zIndex: 100,
            }}
          >
            <Text style={{ color: COLORS.primary, fontSize: 13, fontFamily: "Poppins-Bold" }}>VALIDAR</Text>
          </TouchableOpacity>
        )}

        {isAdmin && (
          <AdminAddButton onPress={() => router.push("/addCoupons")} />
        )}
      </View>
      <View style={{ alignItems: 'center' }}>
      <UserPipoka user={user} ></UserPipoka>
      </View>


      {availableCoupons.length === 0 ? (
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
              {availableCoupons
                .filter((_, index) => index % 2 === 0)
                .map((item, index) => (
                  <View key={`left-${item.id}-${index}`} style={{ marginBottom: 15 }}>
                    {renderCoupon({ item })}
                  </View>
                ))}
            </View>

            <ValidationPopup
            visible={showPopup}
            message={popupMessage}
            onClose={() => setShowPopup(false)}
          />

            <View style={{ flex: 1, marginLeft: 5 }}>
              {availableCoupons
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
  );
}