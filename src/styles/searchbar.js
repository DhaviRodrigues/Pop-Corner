import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';

const { height } = Dimensions.get('window');

export const searchBarStyles = StyleSheet.create({
  container: {
    width: "105%", 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: height * 0.015,
    paddingHorizontal: "5%", 
    left: "-4%", 
  },
  inputWrapper: {
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 50, 
    borderWidth: 3, 
    borderColor: COLORS.red,
    paddingHorizontal: 15,
    height: height * 0.06,
    marginRight: 12, 
  },
  filterTrigger: {
    width: height * 0.06,  
    height: height * 0.06, 
    borderRadius: (height * 0.06) / 2, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 3, 
    borderColor: COLORS.red, 
  },
  filterTriggerActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.gold,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#A0A0A0', 
    marginRight: 10,
  },
  filterIcon: {
    width: 24,
    height: 24,
  },
  input: {
    flex: 1, 
    fontSize: height * 0.018,
    color: '#333',
    fontWeight: '600',
  }
});

export const sortFilterStyles = StyleSheet.create({
  container: {
    bottom: height * 0.02, 
    alignItems: 'flex-end', 
  },
  scrollContent: {
    justifyContent: 'flex-end',
    flexGrow: 1, 
    paddingHorizontal: 8,
  },
  filterBtn: { 
    paddingVertical: height * 0.008, 
    paddingHorizontal: 16, 
    backgroundColor: "transparent",
    borderRadius: 20, 
    marginRight: 8,
    borderWidth: 3,
    borderColor: COLORS.gold,
  },
  activeBtn: { 
    backgroundColor: COLORS.gold
  },
  filterText: {
    color: COLORS.gold,
    fontSize: height * 0.015,
    fontWeight: 'bold',
  },
  activeText: {
    color: COLORS.primaryDark,
  },
  sortDirectionBtn: { 
    paddingVertical: height * 0.008, 
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.gold ,
    backgroundColor: "transparent",
  },
  sortDirectionText: {
    color: COLORS.gold,
    fontSize: height * 0.015,
    fontWeight: 'bold',
  }
});

export const genreFilterStyles = StyleSheet.create({
  container: { 
    marginBottom: height * 0.010,
    bottom: height * 0.01,
  },
  scrollContent: {
    paddingHorizontal: "3%",
  },
  genreBtn: { 
    paddingVertical: height * 0.006, 
    paddingHorizontal: 14, 
    borderWidth: 3, 
    borderColor: COLORS.gold,
    borderRadius: 20, 
    marginRight: 8,
    backgroundColor: COLORS.primaryDark
  },
  activeGenreBtn: { 
    backgroundColor: COLORS.gold 
  },
  genreText: {
    color: COLORS.gold ,
    fontSize: height * 0.013,
    fontWeight: 'bold',
  },
  activeGenreText: {
    color: COLORS.primaryDark,
    fontWeight: 'bold',
  }
});

export const filterMenuStyles = StyleSheet.create({
  filterMenuContainer: {
    alignSelf: "flex-end",
    justifyContent: "center",
    width: "90%",
    marginRight: "7%",
    paddingTop: 16,
    borderRadius: 16,
    borderTopRightRadius: 4,
    zIndex: 10, 
  },
  partnerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor:"transparent",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 3,
    borderColor: COLORS.gold,
  },
  partnerBtnActive: {
    backgroundColor: COLORS.gold,
  },
  partnerText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: "bold",
  },
  partnerTextActive: {
    color: COLORS.primaryDark,
  },
});