import { COLORS } from "@/constants/colors";
import { Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("window");

export const buttonStyle = StyleSheet.create({
  button: {
    borderRadius: height * 0.022,
    height: height * 0.07,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: height * 0.0158,
    width: width * 0.48,
  },
  buttonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: height * 0.027,
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
    height: height * 0.05,
    boxShadow: "0px 9px 20px 15px rgba(0, 0, 0, 0.20)",
    shadowColor: COLORS.black,
    backgroundColor: COLORS.black,
  },
  buttonVoltarText: {
    color: COLORS.gold,
    fontFamily: "Poppins-SemiBold",
    fontSize: height * 0.020,
    textAlign: "center",
  },
  buttonGenre: {
    borderRadius: height * 0.06,
    paddingHorizontal: height * 0.02,
    paddingVertical: height * 0.01,
    marginVertical: height * 0.01,
    marginHorizontal: height * 0.005,
    backgroundColor: COLORS.black,
  },
  buttonGenreText: {
    color: COLORS.gold,
    fontFamily: "Poppins-SemiBold",
    fontSize: height * 0.02,
    textAlign: "center",
    borderRadius: 50,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: height * 0.02,
    paddingVertical: height * 0.012,
    alignSelf: 'center',
    width: '40%',
    height: height * 0.06,
    marginTop: height * 0.03,
    marginHorizontal: height * 0.02,
  },
  logoutText: {
    fontSize: height * 0.018,
    color: COLORS.black,
    marginLeft: height * 0.01,
    fontFamily: 'Poppins-Semibold',
  },
});