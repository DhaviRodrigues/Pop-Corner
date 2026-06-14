import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { miscStyle } from '@/styles/misc';
import { commentModerationStyle as S } from '@/styles/commentmoderation';  
import { CommentCard } from '@/components/CommentCard';
import { SelectAllBar } from '@/components/SelectAllBar';
import BottomNavbar from '@/components/Navbar';
import { Comment } from '@/models/comment';

const { height } = Dimensions.get('window');

type FilterTab = 'Pendentes' | 'Aprovados' | 'Arquivados' | 'Todos';

type MutableComment = Comment & { selected: boolean };

const TABS: FilterTab[] = ['Pendentes', 'Aprovados', 'Arquivados', 'Todos'];

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'John Wick',
    rating: 3,
    movie: 'Gladiador 2',
    cinema: 'Cinemark Shopping Norte',
    date: '25 de mar. de 2026, 16:32',
    text: 'O filme foi uma decepção total. A qualidade do som na sala 3 estava péssima e a projeção borrada. Não recomendo a ninguém!',
    status: 'Pendente',
  },
  {
    id: '2',
    author: 'Maria Souza',
    rating: 4,
    movie: 'Filme B',
    cinema: 'Cinemark Shopping Norte',
    date: '26 de mar. de 2026, 10:00',
    text: 'Experiência incrível! A sala estava ótima e o filme superou as expectativas.',
    status: 'Aprovado',
  },
  {
    id: '3',
    author: 'Carlos Lima',
    rating: 2,
    movie: 'Filme C',
    cinema: 'Cinemark Shopping Norte',
    date: '27 de mar. de 2026, 14:15',
    text: 'Decepcionante. O ar-condicionado estava quebrado e o som falhava em vários momentos.',
    status: 'Recusado',
  },
];

export default function CommentsModerationScreen() {
  const [activeTab, setActiveTab] = useState<FilterTab>('Pendentes');
  const [search, setSearch] = useState('');
  const [isOrderReversed, setIsOrderReversed] = useState(false);
  const [comments, setComments] = useState<MutableComment[]>(
    MOCK_COMMENTS.map(comment => ({ ...comment, selected: false }))
  );

  const tabCounts = useMemo(() => {
    const counts = {
      Pendentes: 0,
      Aprovados: 0,
      Arquivados: 0,
      Todos: comments.length,
    } as Record<FilterTab, number>;

    comments.forEach(comment => {
      if (comment.status === 'Pendente') counts.Pendentes += 1;
      if (comment.status === 'Aprovado') counts.Aprovados += 1;
      if (comment.status === 'Arquivado') counts.Arquivados += 1;
    });

    return counts;
  }, [comments]);

  // Função para atualizar status do comentário
  const handleApprove = useCallback((id: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === id ? { ...comment, status: 'Aprovado' } : comment
      )
    );
  }, []);

  const handleReject = useCallback((id: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === id ? { ...comment, status: 'Recusado' } : comment
      )
    );
  }, []);

  const handleArchive = useCallback((id: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === id ? { ...comment, status: 'Arquivado' } : comment
      )
    );
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === id ? { ...comment, selected: !comment.selected } : comment
      )
    );
  }, []);

  const handleOrderBy = useCallback(() => {
    setIsOrderReversed(prev => !prev);
  }, []);

  // Mapear filtros para status
  const getStatusForFilter = (tab: FilterTab): Comment['status'][] => {
    switch (tab) {
      case 'Pendentes':
        return ['Pendente'];
      case 'Aprovados':
        return ['Aprovado'];
      case 'Arquivados':
        return ['Arquivado'];
      case 'Todos':
        return ['Pendente', 'Aprovado', 'Recusado', 'Arquivado'];
      default:
        return ['Pendente'];
    }
  };

  const filteredComments = useMemo(
    () => {
      const allowedStatuses = getStatusForFilter(activeTab);
      const filtered = comments.filter(({ movie, cinema, author, status }) => {
        const q = search.toLowerCase();
        const matchesSearch =
          movie.toLowerCase().includes(q) ||
          cinema.toLowerCase().includes(q) ||
          author.toLowerCase().includes(q);
        const matchesStatus = allowedStatuses.includes(status);
        return matchesSearch && matchesStatus;
      });
      return isOrderReversed ? [...filtered].reverse() : filtered;
    },
    [search, activeTab, comments, isOrderReversed]
  );

  const handleSelectAll = useCallback(() => {
    const allSelected = filteredComments.length > 0 && filteredComments.every(comment => comment.selected);
    setComments(prevComments =>
      prevComments.map(comment =>
        filteredComments.some(filtered => filtered.id === comment.id)
          ? { ...comment, selected: !allSelected }
          : comment
      )
    );
  }, [filteredComments]);

  return (
    <SafeAreaView style={miscStyle.background} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#922B21" />

      {/* Header: botão voltar */}
      <View style={S.headerContainer}>
        <TouchableOpacity style={S.backButton}>
          <Text style={S.backEmoji}>←</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require('../../assets/images/Logo.png')}
        style={S.titleLogo}
      />

      <Text style={S.pageTitle}>Gerenciamento de Comentários</Text>

      {/* Layout fixo acima da lista. Abaixo, somente o FlatList deve rolar. */}
      <View style={S.contentWrapper}>
        <View style={S.topControls}>
          <View style={S.inputContainer}>
            <Text style={S.searchEmoji}>🔍</Text>
            <TextInput
              style={S.inputText}
              placeholder="Busca por filme, ator, cinema, palavra chave"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.tabsScroll}>
            <View style={S.tabsRow}>
              {TABS.map(label => {
                const isActive = activeTab === label;
                return (
                  <TouchableOpacity
                    key={label}
                    onPress={() => setActiveTab(label)}
                    style={[S.filterTab, isActive && S.filterTabActive]}
                  >
                    <Text style={[S.filterTabText, isActive && S.filterTabTextActive]}>{label}</Text>
                    <View style={[S.filterTabBadge, isActive && S.filterTabBadgeActive]}>
                      <Text style={[S.filterTabBadgeText, isActive && S.filterTabBadgeTextActive]}>
                        {tabCounts[label]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <SelectAllBar
            onSelectAll={handleSelectAll}
            onOrderBy={handleOrderBy}
            isSelected={filteredComments.length > 0 && filteredComments.every(comment => comment.selected)}
          />
        </View>

        <View style={S.listWrapper}>
          <FlatList
            style={S.flatList}
            data={filteredComments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CommentCard
                comment={item}
                selected={item.selected}
                onToggleSelect={handleToggleSelect}
                onApprove={handleApprove}
                onReject={handleReject}
                onArchive={handleArchive}
              />
            )}
            contentContainerStyle={S.scrollContentInner}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{ height: height * 0.05 }} />}
          />
        </View>
      </View>

      <BottomNavbar />
    </SafeAreaView>
  );
}