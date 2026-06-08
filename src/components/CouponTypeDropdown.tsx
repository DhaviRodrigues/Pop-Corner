import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleProp, ViewStyle } from 'react-native';
import { couponFormStyle as S } from '@/styles/couponForm';

interface CouponTypeDropdownProps {
  value: string;
  onSelect: (type: string) => void;
  style?: StyleProp<ViewStyle>;
}

const COUPON_TYPES = [
  'Percentual',
  'Valor Fixo',
  'Produto Grátis',
  'Dois por Um',
];

export function CouponTypeDropdown({ value, onSelect, style }: CouponTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{ position: 'relative', zIndex: isOpen ? 1000 : 0 }}>
      <View style={[S.inputWrapper, style, { padding: 0 }]}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 14,
            height: '100%',
          }}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text
            style={[
              S.inputText,
              {
                color: value ? '#333333' : '#AAAAAA',
              },
            ]}
          >
            {value || 'Selecione o Tipo'}
          </Text>
          <Text style={{ fontSize: 16, color: '#333333' }}>
            {isOpen ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            marginTop: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
            zIndex: 1000,
          }}
        >
          <FlatList
            data={COUPON_TYPES}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderBottomWidth: index < COUPON_TYPES.length - 1 ? 1 : 0,
                  borderBottomColor: '#EEEEEE',
                }}
                onPress={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    S.inputText,
                    {
                      color: item === value ? '#B22300' : '#333333',
                      fontWeight: item === value ? '700' : '600',
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
