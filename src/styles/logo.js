import { Dimensions, Platform, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("window");

export const logoStyle = StyleSheet.create({
  logoS: {
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
    height: height * 0.1,
    resizeMode: "contain",
    alignItems: "center",
  },
  logoB: {
    marginTop: height * 0.1,
    marginBottom: height * 0.05,
    height: height * 0.23,
    resizeMode: "contain",
  },
  logoM: {
    marginTop: height * 0.03,
    marginBottom: height * 0.04,
    height: height * 0.18,
    resizeMode: "contain",
  },
  escudo: {
    height: height * 0.20,
    width: height * 0.20,
    marginTop: height * 0.05,
    resizeMode: "contain",
  },
});