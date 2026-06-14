import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { commentModerationStyle as S } from '@/styles/commentmoderation';
import { StarRating } from '@/components/StarRating';
import { StatusBadge } from '@/components/StatusBadge';
import { Comment } from '@/models/comment';

interface CommentCardProps {
  comment: Comment;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onArchive: (id: string) => void;
}

export function CommentCard({ comment, selected, onToggleSelect, onApprove, onReject, onArchive }: CommentCardProps) {
  return (
    <View style={[S.cardWrapper, selected && S.cardSelected]}>
      <TouchableOpacity
        style={[S.cardCircleSelect, selected && S.cardCircleSelectSelected]}
        onPress={() => onToggleSelect(comment.id)}
      >
        {selected && <Text style={S.cardCircleSelectTick}>✓</Text>}
      </TouchableOpacity>

      <View style={S.card}>
        <View style={S.cardTopRow}>
          <View style={S.cardLeftTop}>
            <View style={S.avatarCircle}>
              <Text style={S.avatarText}>{comment.author.charAt(0)}</Text>
            </View>
            <View>
              <Text style={S.authorName}>{comment.author}</Text>
              <StarRating rating={comment.rating} />
            </View>
          </View>

          <View style={S.cardRightTop}>
            <TouchableOpacity>
              <Text style={S.verPostText}>↗ Ver post</Text>
            </TouchableOpacity>
            <StatusBadge status={comment.status} />
          </View>
        </View>

        <Text style={S.cardBodyText}>{comment.text}</Text>

        <View style={S.cardBottomRow}>
          <View style={S.cardBottomLeft}>
            <Text style={S.dateText}>{comment.date}</Text>
            <View style={S.tagBadge}>
              <Text style={S.tagBadgeText}>{comment.movie}</Text>
            </View>
            <View style={S.tagBadge}>
              <Text style={S.tagBadgeText}>{comment.cinema}</Text>
            </View>
          </View>

          <View style={S.cardActions}>
            <TouchableOpacity style={[S.actionBtn, S.approveBtnBg]} onPress={() => onApprove(comment.id)}>
              <Text style={S.actionBtnText}>Aprovar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[S.actionBtn, S.rejectBtnBg]} onPress={() => onReject(comment.id)}>
              <Text style={S.actionBtnText}>Rejeitar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[S.actionBtn, S.archiveBtnBg]} onPress={() => onArchive(comment.id)}>
              <Text style={S.actionBtnText}>Spam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}