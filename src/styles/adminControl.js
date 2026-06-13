import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "@/constants/colors";

const { height, width } = Dimensions.get('window');

export const adminControlStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, 
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.15,
  },
  headerTitle: {
    fontSize: height * 0.03,
    fontFamily: 'Poppins-Bold',
    color: COLORS.gold,
    marginBottom: height * 0.025,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  customInputContainer: {
    flex: 1,
    marginRight: width * 0.02,
    height: height * 0.06,
    backgroundColor: COLORS.white,
    borderWidth: height * 0.005,
    borderColor: COLORS.red,
    borderRadius: height * 0.03,
    paddingHorizontal: 15,
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: height * 0.022,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.gold,
    marginBottom: height * 0.015,
  },
  loader: {
    marginTop: height * 0.03,
  },
  listContainer: {
    paddingBottom: height * 0.02,
  },
  card: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 15,
    padding: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
    borderWidth: 2,
    borderColor: COLORS.red,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: height * 0.02,
    fontFamily: 'Poppins-Bold',
    color: COLORS.gold,
  },
  adminEmail: {
    fontSize: height * 0.016,
    color: COLORS.textMuted,
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },
  removeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.03,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.red,
  },
  removeButtonText: {
    color: COLORS.gold,
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.016,
  },
});