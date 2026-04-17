import { Dimensions, Platform, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("window");
import COLORS from "@/constants/colors";

export const miscStyle = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  center: {
    alignItems: "center",
    marginTop: height * 0.01,
  },
  formContainer: {
    paddingTop: height * 0.02,
    width: "100%",
    height: "75%",
    alignItems: "center",
    paddingBottom: 20,
  },
  popcorn: {
    position: "absolute",
    width: height * 0.07,
    height: height * 0.07,
    top: -height * 0.04,
    zIndex: 10,
    alignSelf: "center",
  },
  esqueceuSenhaContainer: {
    alignSelf: "flex-end",
    marginRight: "8%",
    marginTop: 10,
  },
    carouselSection: {
      width: '100%',
      marginBottom: 30,
  },
  sectionBadge: {
      backgroundColor: COLORS.gold,
      alignSelf: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 6,
      paddingLeft: 20,
      borderRadius: 10,
      marginBottom: 16,
      marginLeft: 13,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 4.65,
      elevation: 8
  },
  sectionBadgeText: {
      color: COLORS.primary,
      fontFamily: 'Poppins-SemiBold',
      fontSize: 17,
  },
  carouselContainer: {
      paddingHorizontal: 13,
      gap: 13,
  },
  movieCard: {
      width: 140,
      height: 210,
      borderWidth: 5,
      borderColor: COLORS.gold,
      borderRadius: 10,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
  },
  movieCardIcon: {
      width: 60,
      height: 60,
  },
  resendButton: {
    alignSelf: "center",
    marginBottom: height * 0.02,
    marginTop: height * 0.03,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "95%",
    marginTop: height * 0.02,
  },
});
