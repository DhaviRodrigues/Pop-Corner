import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { style as S } from '../styles/misc';
const { height } = Dimensions.get('window');

type FilterTab = 'Pendentes' | 'Aprovados' | 'Arquivados' | 'Feitos';
type CommentStatus = 'Pendente' | 'Aprovado' | 'Recusado';

interface Comment {
  id: string;
  author: string;
  rating: number;
  movie: string;
  cinema: string;
  date: string;
  text: string;
  status: CommentStatus;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'John Silva',
    rating: 3,
    movie: 'Filme A',
    cinema: 'Cinemark Shopping Norte',
    date: '12/03/2024',
    text: 'O filme foi bom, porém a qualidade do som ao vivo é uma preocupação. Não recomendo pela qualidade do projetor, fica muito bom.',
    status: 'Pendente',
  },
  {
    id: '2',
    author: 'John Silva',
    rating: 3,
    movie: 'Filme B',
    cinema: 'Cinemark Shopping Norte',
    date: '12/03/2024',
    text: 'O filme foi bom, porém a qualidade do som ao vivo é uma preocupação. Não recomendo pela qualidade do projetor, fica muito bom.',
    status: 'Aprovado',
  },
  {
    id: '3',
    author: 'John Silva',
    rating: 3,
    movie: 'Filme C',
    cinema: 'Cinemark Shopping Norte',
    date: '12/03/2024',
    text: 'O filme foi bom, porém a qualidade do som ao vivo é uma preocupação. Não recomendo pela qualidade do projetor, fica muito bom.',
    status: 'Recusado',
  },
];

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <View style={local.starsRow}>
      {Array.from({ length: max }).map((_, i) => (
        <Text key={i} style={[local.star, i < rating ? local.starFilled : local.starEmpty]}>
          ★
        </Text>
      ))}
    </View>
  );
}

function StatusBadge({ status }: { status: CommentStatus }) {
  const config = {
    Pendente: { bg: COLORS.orange },
    Aprovado: { bg: COLORS.green },
    Recusado: { bg: COLORS.red },
  };
  return (
    <View style={[local.statusBadge, { backgroundColor: config[status].bg }]}>
  
      <Text style={[S.message, local.statusBadgeText]}>{status}</Text>
    </View>
  );
}

function CommentCard({ comment }: { comment: Comment }) {
  return (

    <View style={[S.box, local.card]}>
      <View style={local.cardHeader}>
        <View style={local.avatarCircle}>
      
          <Text style={[S.message, local.avatarText]}>{comment.author.charAt(0)}</Text>
        </View>
        <View style={local.cardAuthorInfo}>
          <Text style={[S.message, local.authorName]}>{comment.author}</Text>
          <StarRating rating={comment.rating} />
        </View>
        <StatusBadge status={comment.status} />
      </View>

      <View style={local.cardMeta}>
        <Text style={[S.message, local.metaText]}>📅 {comment.date}</Text>
        <Text style={[S.message, local.metaText]}>🎬 {comment.movie}</Text>
      </View>

  
      <Text style={[S.text, local.cardText]}>{comment.text}</Text>

      <View style={local.cinemaRow}>
        <Text style={local.cinemaIcon}>🍿</Text>
        <Text style={[S.message, local.cinemaText]}>{comment.cinema}</Text>
      </View>

      <View style={local.cardActions}>
    
        <TouchableOpacity style={[S.button, S.buttonY, local.actionBtn]}>
          <Text style={[S.buttonText, S.buttonYText]}>Aprovar</Text>
        </TouchableOpacity>
    
        <TouchableOpacity style={[S.button, S.buttonB, local.actionBtn]}>
          <Text style={[S.buttonText, S.buttonBText]}>Rejeitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FilterTabs({ active, onChange }: { active: FilterTab; onChange: (t: FilterTab) => void }) {
  const tabs: FilterTab[] = ['Pendentes', 'Aprovados', 'Arquivados', 'Feitos'];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={local.tabsScroll}>
      <View style={local.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(tab)}
        
            style={[S.tab, local.filterTab, active === tab && local.filterTabActive]}
          >
            <Text style={[S.message, active === tab && local.filterTabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  return (

    <View style={S.inputContainer}>
      <Text style={local.searchEmoji}>🔍</Text>
  
      <TextInput
        style={S.inputText}
        placeholder="Busca por filme, ator, cinema, palavra chave"
        placeholderTextColor={COLORS.textMuted}
        value={query}
        onChangeText={setQuery}
      />
    </View>
  );
}

function Header({ onBack }: { onBack?: () => void }) {
  return (
    <View style={local.header}>
      <TouchableOpacity style={local.backBtn} onPress={onBack}>
        <Text style={local.backBtnText}>‹</Text>
      </TouchableOpacity>
      <Text style={local.logoIcon}>🍿</Text>
  
      <Text style={[S.text, local.logoText]}>POP CORNER</Text>
    </View>
  );
}

const NAV_ITEMS = [
  { icon: '🏠', label: 'Início' },
  { icon: '🎬', label: 'Cinemas' },
  { icon: '🎟️', label: 'Espaços' },
  { icon: '🎞️', label: 'Filmes' },
  { icon: '👤', label: 'Perfil' },
];

function BottomNav({ active = 0 }: { active?: number }) {
  return (

    <View style={S.navbarWrapper}>
      <View style={S.navbarContainer}>
        <View style={S.tabContainer}>
          {NAV_ITEMS.map((item, i) => (
            <TouchableOpacity key={item.label} style={S.tab}>
          
              <View style={[S.tabContent, i === active && S.activeTabContent]}>
                <Text style={local.navEmoji}>{item.icon}</Text>
              </View>
          
              <Text style={[S.label, i === active && S.activeLabel]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

function SelectAllBar() {
  return (
    <View style={local.selectAllBar}>
      <View style={local.selectAllLeft}>
        <View style={local.checkbox} />
        <Text style={S.message}>Selecionar todos</Text>
      </View>
      <TouchableOpacity>
        <Text style={[S.message, local.orderText]}>↕ Ordenar Por</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CommentModerationScreen() {
  const [activeTab, setActiveTab] = useState<FilterTab>('Pendentes');

  return (
    <SafeAreaView style={S.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
  
      <View style={S.background}>
        <Header />
        <ScrollView
          style={local.scrollContent}
          contentContainerStyle={local.scrollContentInner}
          showsVerticalScrollIndicator={false}
        >
      
          <Text style={[S.text, local.pageTitle]}>Gerenciamento de Comentários</Text>
          <SearchBar />
          <FilterTabs active={activeTab} onChange={setActiveTab} />
          <SelectAllBar />
          {MOCK_COMMENTS.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </ScrollView>
        <BottomNav active={0} />
      </View>
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#8B0000',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    color: COLORS.white,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: height * 0.02,
    letterSpacing: 1,
  },
  scrollContent: {
    flex: 1,
    width: '100%',
  },
  scrollContentInner: {
    paddingHorizontal: 16,
    paddingBottom: height * 0.18,
  },
  pageTitle: {
    fontSize: height * 0.025,
    marginTop: height * 0.02,
    marginBottom: height * 0.018,
    textAlign: 'center',
  },
  searchEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  tabsScroll: {
    marginBottom: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    flex: undefined,
    marginHorizontal: 0,
  },
  filterTabActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  filterTabTextActive: {
    color: '#8B0000',
    fontWeight: '700',
  },
  selectAllBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectAllLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  orderText: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  card: {
    marginBottom: 14,
    padding: 14,
    backgroundColor: '#A93226',
    borderRadius: 16,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#8B0000',
    fontWeight: '800',
    fontSize: height * 0.02,
  },
  cardAuthorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: height * 0.018,
    marginBottom: 2,
    textAlign: 'left',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
  },
  star: {
    fontSize: 13,
  },
  starFilled: {
    color: COLORS.gold,
  },
  starEmpty: {
    color: 'rgba(255,255,255,0.3)',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: height * 0.013,
    textAlign: 'center',
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metaText: {
    fontSize: height * 0.013,
    textAlign: 'left',
  },
  cardText: {
    fontSize: height * 0.015,
    marginBottom: 10,
    textAlign: 'left',
  },
  cinemaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cinemaIcon: {
    fontSize: 13,
  },
  cinemaText: {
    color: COLORS.gold,
    fontSize: height * 0.013,
    textAlign: 'left',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    width: undefined,
    height: height * 0.055,
    marginTop: 0,
    marginBottom: 0,
  },
  navEmoji: {
    fontSize: height * 0.028,
  },
});
