import React from 'react';
import { View, Text } from 'react-native';
import { commentModerationStyle as S } from '@/styles/commentmoderation';
import { CommentStatus } from '@/types/comment';

const STATUS_COLOR: Record<CommentStatus, string> = {
  Pendente: '#E67E22',
  Aprovado: '#27AE60',
  Recusado: '#E74C3C',
  Arquivado: '#6C3483',
};

interface StatusBadgeProps {
  status: CommentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View style={[S.statusBadge, { backgroundColor: STATUS_COLOR[status] }]}>
      <Text style={S.statusBadgeText}>{status}</Text>
    </View>
  );
}