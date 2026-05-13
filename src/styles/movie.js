import { Dimensions, Platform, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("window");
import { COLORS } from "@/constants/colors";

export const movieStyle = StyleSheet.create({
  filmesContainer: {
    flex: 1,
    backgroundColor: "#B22300",
  },
  filmesHeader: {
    paddingHorizontal: "5%",
    paddingTop: height * 0.02,
    alignItems: "center",
  },
  filmesLogo: {
    width: height * 0.2,
    height: height * 0.08,
    resizeMode: "contain",
    marginBottom: height * 0.02,
  },

  filmesListContent: {
    paddingHorizontal: "4%",
    paddingBottom: height * 0.22,
  },
  filmesRow: {
    justifyContent: "space-between",
  },
  filmesCard: {
    backgroundColor: "#2A0800",
    width: "48%",
    borderRadius: height * 0.02,
    padding: "2%",
    marginVertical: height * 0.012,
    borderWidth: 4,
    borderColor: "#FE481B",
    alignItems: "center",
  },
  filmesPoster: {
    width: "100%",
    height: height * 0.25,
    borderRadius: height * 0.015,
  },
  filmesMovieTitle: {
    color: "#FFFEB2",
    fontSize: height * 0.015,
    fontWeight: "bold",
    marginTop: height * 0.01,
    textAlign: "center",
  },
  filmesRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.006,
  },
  filmesRatingLabel: {
    color: "#FFFEB2",
    fontSize: height * 0.011,
    fontWeight: "bold",
  },
  filmesTagRow: {
    flexDirection: "row",
    gap: 5,
    marginBottom: height * 0.012,
  },
  filmesTagYellow: {
    backgroundColor: "#FFFEB2",
    borderRadius: height * 0.02,
    paddingHorizontal: "4%",
    paddingVertical: "1%",
  },
  filmesTagRed: {
    backgroundColor: "#B22300",
    borderRadius: height * 0.02,
    paddingHorizontal: "4%",
    paddingVertical: "1%",
  },
  filmesTagText: {
    fontSize: height * 0.01,
    fontWeight: "bold",
    color: "#000",
  },
  filmesDetailsButton: {
    backgroundColor: "#B22300",
    width: "60%",
    paddingVertical: height * 0.01,
    borderRadius: height * 0.015,
  },
  filmesSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: height * 0.015,
    marginLeft: "10%", 
  },
  filmesInputWrapper: {
    width: '120%',
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 12, 
  },
  filmesDetailsButtonText: {
    color: "#FFFEB2",
    textAlign: "center",
    fontSize: height * 0.014,
    fontWeight: "bold",
  },
  filmesFooterBtn: {
    alignItems: "center",
    marginVertical: height * 0.025,
  },
  filmesStarsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 3,
    gap: 1,
  },
  filmesSingleStarContainer: {
    position: "relative",
  },
  filmesStarBackground: {
    color: "#4A2010",
    fontSize: height * 0.014,
  },
  
 filmesStarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
  },
  filmesStarForeground: {
    color: "#FFFEB2",
    fontSize: height * 0.014,
  },
  detailsHeaderPill: {
    backgroundColor: "#2A0800",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: height * 0.03,
    alignSelf: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.03,
    borderWidth: 2,
    borderColor: "#FE481B",
  },
  detailsTitleText: {
    color: "#FFFEB2",
    fontSize: height * 0.022,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsPoster: {
    width: width * 0.55,
    height: height * 0.35,
    borderRadius: height * 0.02,
    alignSelf: 'center',
    zIndex: 1,
  },
  detailsRatingCard: {
    backgroundColor: "#B22300",
    width: width * 0.6,
    marginTop: -height * 0.03,
    paddingTop: height * 0.04,
    paddingBottom: height * 0.015,
    borderRadius: height * 0.03,
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "#FFFEB2",
    zIndex: 0,
  },
  detailsInfoRow: {
    backgroundColor: "#2A0800",
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
    borderRadius: height * 0.015,
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.01,
  },
  detailsInfoText: {
    color: "#FFFEB2",
    marginLeft: width * 0.03,
    fontWeight: "bold",
    fontSize: height * 0.016,
  },
});
