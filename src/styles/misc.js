import { Dimensions, Platform, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("window");
import { COLORS } from "@/constants/colors";

export const miscStyle = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primary,
    overflow: "hidden",
    alignItems: "center",
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
      marginBottom: height * 0.037,
  },
  sectionBadge: {
      backgroundColor: COLORS.gold,
      alignSelf: 'flex-start',
      paddingHorizontal: height * 0.02,
      paddingTop: height * 0.007,
      paddingVertical: height * 0.007,
      paddingLeft: height * 0.025,
      borderRadius: height * 0.012,
      marginBottom: height * 0.02,
      marginLeft: height * 0.016,
  },
  sectionBadgeText: {
      color: COLORS.primary,
      fontFamily: 'Poppins-SemiBold',
      fontSize: height * 0.021,
  },
  carouselContainer: {
      paddingHorizontal: height * 0.016,
      gap: height * 0.016,
  },
  movieCard: {
      width: height * 0.2,
      height: height * 0.3,
      borderWidth: height * 0.006,
      borderColor: COLORS.gold,
      borderRadius: height * 0.012,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
  },
  movieCardIcon: {
      width: height * 0.1,
      height: height * 0.1,
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
