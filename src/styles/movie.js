import { Dimensions, Platform, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("window");
import COLORS from "@/constants/colors";

export const movieStyle = StyleSheet.create({
  filmesContainer: { 
    flex: 1, 
    backgroundColor: COLORS.primary 
  },
  filmesHeader: { 
    paddingHorizontal: "5%", 
    paddingTop: height * 0.02, 
    alignItems: 'center' 
  },
  filmesLogo: { 
    width: height * 0.2, 
    height: height * 0.08, 
    resizeMode: 'contain', 
    marginBottom: height * 0.02 
  },
  filmesSearchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    marginBottom: height * 0.015 
  },
  filmesInputWrapper: { 
    flex: 1, 
  },
  filmesListContent: { 
    paddingHorizontal: "4%", 
    paddingBottom: height * 0.22 
  },
  filmesRow: { 
    justifyContent: 'space-between' 
  },
  filmesCard: { 
    backgroundColor: COLORS.primaryDark, 
    width: '48%', 
    borderRadius: height * 0.02, 
    padding: "2%", 
    marginVertical: height * 0.012, 
    borderWidth: 4, 
    borderColor: COLORS.red,
    alignItems: 'center' 
  },
  filmesPoster: { 
    width: '100%', 
    height: height * 0.25, 
    borderRadius: height * 0.015 
  },
  filmesRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.006,
  },
  filmesRatingLabel: { 
    color: COLORS.gold, 
    fontSize: height * 0.011, 
    fontWeight: 'bold' 
  },
  filmesTagRow: { 
    flexDirection: 'row', 
    gap: 5, 
    marginBottom: height * 0.012 
  },
  filmesTagYellow: { 
    backgroundColor: COLORS.gold, 
    borderRadius: height * 0.02, 
    paddingHorizontal: "4%", 
    paddingVertical: "1%" 
  },
  filmesTagRed: { 
    backgroundColor: COLORS.red, 
    borderRadius: height * 0.02, 
    paddingHorizontal: "4%", 
    paddingVertical: "1%" 
  },
  filmesDetailsButton: { 
    backgroundColor: COLORS.red, 
    width: '60%', 
    paddingVertical: height * 0.01, 
    borderRadius: height * 0.015 
  },
  filmesFooterBtn: { 
    alignItems: 'center', 
    marginVertical: height * 0.025 
  },
  filmesStarsWrapper: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginLeft: 3,
    gap: 1, 
  },
  filmesSingleStarContainer: {
    position: 'relative',
  },
  filmesStarBackground: {
    color: COLORS.primaryDark, 
    fontSize: height * 0.014, 
  },
  filmesStarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden', 
  },
  filmesStarForeground: {
    color: COLORS.gold, 
    fontSize: height * 0.014,
  },
});
