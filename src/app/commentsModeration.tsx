import { ScrollView, View, StyleSheet,StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from "react";
import { Comment, FilterTab } from '../types/comment'

const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    author: "John Silva",
    rating: 3,
    movie: "Filme A",
    cinema: "Cinemark Shopping Norte",
    date: "12/03/2024",
    text: "O filme foi bom, porém a qualidade do som ao vivo é uma preocupação. Não recomendo pela qualidade do projetor, fica muito bom.",
    status: "Pendente",
  },
  {
    id: "2",
    author: "John Silva",
    rating: 3,
    movie: "Filme B",
    cinema: "Cinemark Shopping Norte",
    date: "12/03/2024",
    text: "O filme foi bom, porém a qualidade do som ao vivo é uma preocupação. Não recomendo pela qualidade do projetor, fica muito bom.",
    status: "Aprovado",
  },
  {
    id: "3",
    author: "John Silva",
    rating: 3,
    movie: "Filme C",
    cinema: "Cinemark Shopping Norte",
    date: "12/03/2024",
    text: "O filme foi bom, porém a qualidade do som ao vivo é uma preocupação. Não recomendo pela qualidade do projetor, fica muito bom.",
    status: "Recusado",
  },
];

export function commentsModeration() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Pendentes");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.container}>
        <Header />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SearchBar />
          <FilterTabs active={activeTab} onChange={setActiveTab} />
          <SelectAllBar />
          {MOCK_COMMENTS.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </ScrollView>
        <BottomNav activeIndex={0} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
});
