import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { sessionsStyle } from '@/styles/sessions';
import { SessionCard } from '@/components/SessionCard';
import BottomNavbar from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { getCinemaById } from '@/services/cinemaService';
import { getAllMovies } from '@/services/movieservice';
import { COLORS } from '@/constants/colors';

// Função que gera Hoje + 6 Dias (Uma Semana)
const getNext7Days = () => {
  const days = [];
  const weekDaysStr = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Tratamento para garantir o formato DD/MM e DD/MM/YYYY
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    
    days.push({
      dateStr: `${dd}/${mm}/${yyyy}`, // Formato que vamos cruzar com o banco de dados
      dayMonth: `${dd}/${mm}`,        // Ex: 16/06
      weekDay: weekDaysStr[date.getDay()], // Ex: TER
    });
  }
  return days;
};

export default function SessionsScreen() {
  const router = useRouter();
  const { cinemaId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [cinema, setCinema] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  
  const weekDays = useMemo(() => getNext7Days(), []);
  const [selectedDate, setSelectedDate] = useState(weekDays[0].dateStr); // Hoje como padrão

  useEffect(() => {
    const fetchData = async () => {
      if (!cinemaId) return;
      try {
        const cinemaData = await getCinemaById(cinemaId as string);
        const moviesData = await getAllMovies();
        
        setCinema(cinemaData);
        setMovies(moviesData);
      } catch (error) {
        console.error("Erro ao carregar sessões:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cinemaId]);

  // Agrupa e filtra as sessões para a Data Selecionada
  const renderData = useMemo(() => {
    if (!cinema || !cinema.sessoes) return [];

    const sessionsForDate = cinema.sessoes.filter((s: any) => s.data === selectedDate);
    
    const grouped = sessionsForDate.reduce((acc: any, sessao: any) => {
      const filmeId = sessao.id_filme || sessao.idFilme; 
      
      if (!filmeId) return acc;

      if (!acc[filmeId]) acc[filmeId] = [];
      // Impede horários duplicados no mesmo filme
      if (!acc[filmeId].includes(sessao.horario)) {
        acc[filmeId].push(sessao.horario);
      }
      return acc;
    }, {});

    return Object.keys(grouped).map(idFilme => {
      const movie = movies.find(m => m.id === idFilme);
      return {
        id: idFilme,
        movie,
        horarios: grouped[idFilme].sort(), 
      };
    });
  }, [cinema, movies, selectedDate]);

  if (loading) {
    return (
      <View style={[sessionsStyle.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <View style={sessionsStyle.container}>
      {/* HEADER */}
      <View style={sessionsStyle.header}>
        <View style={{ position: 'absolute', left: 20, top: 0, zIndex: 10 }}>
          <BackButton />
        </View>
        <Text style={sessionsStyle.title}>{cinema?.nome || 'Sessões'}</Text>
      </View>

      {/* BARRA DE DATAS SCROLLÁVEL */}
      <View style={sessionsStyle.dateBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {weekDays.map((day, index) => {
            const isSelected = selectedDate === day.dateStr;
            return (
              <TouchableOpacity 
                key={index}
                style={[sessionsStyle.dateItem, isSelected && sessionsStyle.dateItemSelected]}
                onPress={() => setSelectedDate(day.dateStr)}
              >
                <Text style={[sessionsStyle.dateDayMonth, isSelected && sessionsStyle.dateDayMonthSelected]}>
                  {day.dayMonth}
                </Text>
                <Text style={[sessionsStyle.dateWeekDay, isSelected && sessionsStyle.dateWeekDaySelected]}>
                  {day.weekDay}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* LISTAGEM DOS CARDS (FILME + HORÁRIOS) */}
      {renderData.length > 0 ? (
        <FlatList
          data={renderData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={sessionsStyle.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SessionCard movie={item.movie} horarios={item.horarios} />
          )}
        />
      ) : (
        <Text style={sessionsStyle.noSessionsText}>
          Nenhuma sessão disponível para esta data.
        </Text>
      )}

      <BottomNavbar />
    </View>
  );
}