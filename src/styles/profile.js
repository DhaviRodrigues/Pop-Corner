import { COLORS } from "@/constants/colors";
import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");

export const profileStyle = StyleSheet.create({
  configTitle: {
    fontSize: height * 0.022,
    color: COLORS.white,
    marginBottom: height * 0.014,
    fontFamily: 'Poppins-SemiBold',
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.02,
  },
  configLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  configIcon: {
    marginRight: 15,
    height: height * 0.05,
    width: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: height * 0.03,
    height: height * 0.03,
    resizeMode: 'contain',
  },
  configTextContent: {
    flex: 1,
  },
  configLabel: {
    fontSize: height * 0.018,
    color: COLORS.white,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  configDescription: {
    fontSize: height * 0.013,
    color: COLORS.white,
    fontFamily: 'Poppins-Light',
  },
});
