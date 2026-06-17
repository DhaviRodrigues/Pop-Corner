import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';
const { height, width } = Dimensions.get("window");

export const sessionsStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: 20,
    position: 'relative',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: COLORS.gold,
  },
  // ESTILOS DA BARRA DE DATAS
  dateBarContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryDark,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 70,
  },
  dateItemSelected: {
    borderColor: COLORS.red,
    backgroundColor: COLORS.primaryDark,
  },
  dateDayMonth: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFF',
  },
  dateWeekDay: {
    fontFamily: 'Poppins-Regular', // Usando Regular como "Light"
    fontSize: 12,
    color: '#A9A9A9',
  },
  dateDayMonthSelected: {
    color: COLORS.gold,
  },
  dateWeekDaySelected: {
    color: COLORS.gold,
  },
  // ESTILOS DO CARD DE SESSÃO
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  cardContainer: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  movieTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFF',
    marginBottom: 2,
  },
  duration: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A9A9A9',
  },
  divider: {
    height: 2,               // Grossura 2
    backgroundColor: COLORS.red, // Linha vermelha
    width: '100%',
    marginVertical: 10,      // Espaçamento em cima e embaixo
  },
  timesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timePill: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  timeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: COLORS.gold,
  },
  noSessionsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#A9A9A9',
    textAlign: 'center',
    marginTop: 50,
  }
});