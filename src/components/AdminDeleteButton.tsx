import React, { useState } from "react";
import { TouchableOpacity, Modal, View, Text, TextInput, Alert, ActivityIndicator, Platform } from "react-native";
import { COLORS } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";

type AdminDeleteButtonProps = {
  onConfirmDelete: (password: string) => Promise<void>;
  itemName?: string;
};

export function AdminDeleteButton({ onConfirmDelete, itemName = "item" }: AdminDeleteButtonProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!adminPassword) {
      Alert.alert("Aviso", "Digite a senha para confirmar.");
      return;
    }

    try {
      setIsDeleting(true);
      await onConfirmDelete(adminPassword);
      setShowDeleteModal(false);
      setAdminPassword('');
    } catch (error) {
      console.error("Erro ao deletar:", error);
      Alert.alert("Erro", `Falha ao deletar ${itemName}. Verifique sua permissão.`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowDeleteModal(true)}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: COLORS.gold,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather name="trash-2" size={18} color={COLORS.gold} />
      </TouchableOpacity>

      <Modal visible={showDeleteModal} transparent={true} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <View style={{
            backgroundColor: COLORS.primaryDark,
            borderRadius: 15,
            padding: 20,
            width: '80%',
            borderWidth: 2,
            borderColor: COLORS.gold,
          }}>
            <Text style={{ color: COLORS.gold, fontSize: 18, fontFamily: 'Poppins-Bold', marginBottom: 15 }}>
              Deletar {itemName}
            </Text>
            <Text style={{ color: '#FFF', fontSize: 14, fontFamily: 'Poppins-Regular', marginBottom: 15 }}>
              Digite a senha de admin para confirmar a exclusão:
            </Text>

            <TextInput
              style={{
                backgroundColor: '#000',
                color: '#FFF',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: COLORS.gold,
                marginBottom: 15,
                fontFamily: 'Poppins-Regular',
              }}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry={true}
              value={adminPassword}
              onChangeText={setAdminPassword}
              editable={!isDeleting}
            />

            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDeleteModal(false);
                  setAdminPassword('');
                }}
                disabled={isDeleting}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  backgroundColor: '#666',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#FFF', fontFamily: 'Poppins-Bold' }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                disabled={isDeleting}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  backgroundColor: '#8B0000',
                  borderRadius: 8,
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : null}
                <Text style={{ color: '#FFF', fontFamily: 'Poppins-Bold' }}>
                  {isDeleting ? 'Deletando...' : 'Deletar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
