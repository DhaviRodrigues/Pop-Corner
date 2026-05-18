import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { commentModerationStyle as S } from '@/styles/commentmoderation';

export type FilterTab = 'Pendentes' | 'Aprovados' | 'Arquivados' | 'Feitos';

const TABS: FilterTab[] = ['Pendentes', 'Aprovados', 'Arquivados', 'Feitos'];

interface FilterTabsProps {
  active: FilterTab;
  onChange: (tab: FilterTab) => void;
}

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.tabsScroll}>
      <View style= {S.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(tab)}
            style={[S.filterTab, active === tab && S.filterTabActive]}
          >
            <Text style={[S.filterTabText, active === tab && S.filterTabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}