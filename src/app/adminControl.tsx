import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { movieStyle } from '@/styles/movie';
import BottomNavbar from '@/components/Navbar'; 
import { Input } from '@/components/Input'; 
import { ButtonY } from '@/components/ButtonY';
import { useAuth } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';
import { adminControlStyle } from '@/styles/adminControl'; 
import { COLORS } from '@/constants/colors';
import { fetchAllAdmins, addAdmin, removeAdmin } from '@/services/userservice';

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export default function AdminControl() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const currentUserEmail = user?.getEmail(); 

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const adminList = await fetchAllAdmins();
      setAdmins(adminList);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível carregar a lista de administradores.");
    } finally {
      setLoading(false);
    }
  };

const handleAddAdmin = async () => {
    try {
      await addAdmin(emailInput);
      console.log("Administrador adicionado com sucesso!");
      setEmailInput('');
      loadAdmins();
    } catch (error: any) {
      console.error("Erro ao adicionar administrador:", error.message);
    }
  };

  const handleRemoveAdmin = async (targetUserId: string, targetUserEmail: string) => {
    try {
      await removeAdmin(targetUserId, targetUserEmail, currentUserEmail);
      console.log(`Privilégios de ${targetUserEmail} removidos com sucesso.`);
      loadAdmins();
    } catch (error: any) {
      console.error("Erro ao remover administrador:", error.message);
    }
  };

  const renderAdminItem = ({ item }: { item: AdminUser }) => (
    <View style={adminControlStyle.card}>
      <View style={adminControlStyle.cardInfo}>
        <Text style={adminControlStyle.adminName}>{item.name}</Text>
        <Text style={adminControlStyle.adminEmail}>{item.email}</Text>
      </View>
      {item.email !== currentUserEmail && (
        <ButtonY
          title="Remover" 
          onPress={() => handleRemoveAdmin(item.id, item.email)} 
          h={38} 
          w={90} 
          textSize={14} 
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={[movieStyle.filmesContainer, { flex: 1, backgroundColor: COLORS.primary }]}>
        <View style={adminControlStyle.content}>
        <Text style={adminControlStyle.headerTitle}>Administradores</Text>

        <View style={adminControlStyle.actionRow}>
          <Input
            text="E-mail do novo admin"
            value={emailInput}
            onChangeText={setEmailInput}
            keyboardType="email-address"
            containerStyle={adminControlStyle.customInputContainer}
          />
          <View style={adminControlStyle.buttonWrapper}>
            <ButtonY 
              title="Adicionar" 
              onPress={handleAddAdmin} 
              h={35} 
              w={110} 
              textSize={16} 
            />
          </View>
        </View>

        <Text style={adminControlStyle.sectionTitle}>Contas Ativas</Text>
        
        {loading ? (
          <ActivityIndicator 
            size="large" 
            color={COLORS.gold} 
            style={adminControlStyle.loader} 
          />
        ) : (
          <FlatList
            data={admins}
            keyExtractor={(item) => item.id}
            renderItem={renderAdminItem}
            contentContainerStyle={[adminControlStyle.listContainer, { paddingBottom: 200 }]}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <BottomNavbar />
    </SafeAreaView>
  );
}