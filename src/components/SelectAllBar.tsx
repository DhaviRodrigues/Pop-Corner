import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { commentModerationStyle as S } from '@/styles/commentmoderation'; 

interface SelectAllBarProps {
  onSelectAll: () => void;
  onOrderBy: () => void;
  isSelected: boolean; 
}

export function SelectAllBar({ onSelectAll, onOrderBy, isSelected = true }: SelectAllBarProps) {
  return (
    <View style={S.selectAllBar}>
      <TouchableOpacity style={S.selectAllLeft} onPress={onSelectAll}>
        <View style={S.checkbox}>
          {/* Se estiver selecionado, mostra o check */}
          {isSelected && <Text style={S.checkboxTick}>✓</Text>}
        </View>
        <Text style={S.selectAllText}>Selecionar todos</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} onPress={onOrderBy}>
        <Text style={S.orderText}>↕ Ordenar Itens</Text>
      </TouchableOpacity>
    </View>
  );
}