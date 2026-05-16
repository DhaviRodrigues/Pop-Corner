import { COLORS } from "@/constants/colors";
import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const buttonStyle = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  buttonY: {
    backgroundColor: COLORS.gold,
  },
  buttonYText: {
    color: COLORS.black,
  },
  buttonBText: {
    color: COLORS.gold,
  },
  buttonB: {
    backgroundColor: COLORS.black,
  },
  buttonVoltar: {
    width: "30%",
    boxShadow: "0px 9px 20px 15px rgba(0, 0, 0, 0.20)",
    shadowColor: COLORS.black,
    backgroundColor: COLORS.black,
  },
  buttonVoltarText: {
    color: COLORS.gold,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  buttonGenre: {
    backgroundColor: COLORS.black,
  },
  buttonGenreText: {
    color: COLORS.gold,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    borderRadius: 50,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.gold,
    alignSelf: "center",
    width: "40%",
    paddingVertical: height * 0.02,
    marginTop: height * 0.02,
    borderRadius: 12,
  },
  logoutText: {
    color: COLORS.black,
    fontFamily: "Poppins-Semibold",
  },
});