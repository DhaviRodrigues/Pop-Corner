import { Dimensions, Platform, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("window");
import { COLORS } from "@/constants/colors";

export const textStyle = StyleSheet.create({
    message: {
    fontSize: height * 0.014,
    color: COLORS.gold,
    maxHeight:"90%",
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  text: {
    fontSize: height * 0.022,
    maxWidth: "80%",
    color: COLORS.gold,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  underlineText: {
    fontSize: height * 0.014,
    color: COLORS.gold,
    marginBottom: height * 0.01,
    fontFamily: "Poppins-SemiBold",
    textDecorationLine: "underline",
  },
    outBoxMessage: {
    fontSize: height * 0.030,
    color: COLORS.gold,
    textShadowColor: COLORS.primary,
    textShadowRadius: 10,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  filmesMovieTitle: { 
    color: '#FFFEB2', 
    fontSize: height * 0.015, 
    fontWeight: 'bold', 
    marginTop: height * 0.01,
    textAlign: 'center'
  },
  filmesDetailsButtonText: { 
    color: COLORS.gold, 
    textAlign: 'center', 
    fontSize: height * 0.014, 
    fontWeight: 'bold' 
  },
  filmesTagText: { 
    fontSize: height * 0.01, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  profileText: {
    fontSize: height * 0.025,
    maxWidth: "80%",
    paddingTop: height * 0.05,
    color: COLORS.gold,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
});