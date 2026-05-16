import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";

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
  },
  logoutText: {
    color: COLORS.black,
    fontFamily: "Poppins-Semibold",
  },
  buttonAddWatchlist: {
    backgroundColor: COLORS.gold,
    paddingVertical: 12, 
    width: '65%', 
    borderRadius: 50, 
    alignSelf: "center",
    marginTop: 15,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonAddWatchlistText: {
    color: COLORS.black,
    fontSize: 16, 
    fontFamily: "Poppins-SemiBold", 
    textAlign: "center",
  },
});