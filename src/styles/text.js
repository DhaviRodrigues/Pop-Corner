import { Dimensions, Platform, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("window");
import { COLORS } from "@/constants/colors";

export const textStyle = StyleSheet.create({
  message: {
    fontSize: height * 0.014,
    color: COLORS.gold,
    maxHeight: "90%",
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
    fontSize: height * 0.03,
    color: COLORS.gold,
    textShadowColor: COLORS.primary,
    textShadowRadius: 10,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  filmesMovieTitle: {
    color: "#FFFEB2",
    fontSize: height * 0.015,
    fontWeight: "bold",
    marginTop: height * 0.01,
    textAlign: "center",
  },
  filmesDetailsButtonText: {
    color: COLORS.gold,
    textAlign: "center",
    fontSize: height * 0.014,
    fontWeight: "bold",
  },
  filmesTagText: {
    fontSize: height * 0.01,
    fontWeight: "bold",
    color: "#000",
  },
  profileText: {
    fontSize: height * 0.025,
    maxWidth: "80%",
    paddingTop: height * 0.05,
    color: COLORS.gold,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  detailsRatingScore: {
    color: "#FFFEB2",
    fontSize: 20,
    fontWeight: "bold",
  },
  detailsRatingCount: {
    color: "#FFFEB2",
    fontSize: 16,
  },
  detailsSectionTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
    fontFamily: "Poppins-Bold",
  },
  detailsUserStars: {
    fontSize: 28,
    color: "#B22300",
    fontFamily: "Poppins-Bold",
  },
  detailsReviewUser: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#000",
    fontFamily: "Poppins-Bold",
  },
  detailsReviewStars: {
    color: "#B22300",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  detailsReviewText: {
    fontSize: 11,
    color: "#555",
    marginTop: 2,
    fontFamily: "Poppins-Regular",
  },
  detailsInfoLabel: {
    color: "#FFFEB2",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  detailsInfoValue: {
    fontWeight: "normal",
    fontFamily: "Poppins-Regular",
  },
  detailsTitleText: {
    color: "#FFFEB2",
    fontSize: height * 0.022,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  detailsSynopsisText: {
    lineHeight: 22,
    color: "#000",
    textAlign: "left",
    fontSize: height * 0.018,
    fontFamily: "Poppins-Regular",
  },
  profileName: {
    fontSize: height * 0.022,
    marginTop: height * 0.015,
    color: COLORS.gold,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
});
