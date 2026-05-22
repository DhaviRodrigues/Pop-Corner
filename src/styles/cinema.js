import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { Platform } from "react-native";
const { height } = Dimensions.get("window");

export const style = StyleSheet.create({

  filmesHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  filmesLogo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },

  cinemaCardContainer: {
    height: 145, 
    backgroundColor: '#D9D9D9',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  cinemaDetailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    position: 'relative',
    marginRight: 10,
  },
  cinemaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  cinemaNameText: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  partnerBadgeIcon: {
    width: 76,
    height: 40,
    marginTop: 5,
    marginRight: 5,
  },
  redDividerLine: {
    height: 2,
    width: '90%', 
    backgroundColor: '#FF0000',
    marginVertical: 1,
  },
  cinemaAddressText: {
    fontSize: 9,
    color: '#555',
    fontFamily: 'Poppins-Regular',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  cinemaDistanceText: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },

  cinemaStarsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cinemaSingleStarContainer: {
    position: 'relative',
    width: 14,
    height: 14,
  },
  cinemaStarBackground: {
    color: '#0c0000', 
    fontSize: 14,
    position: 'absolute',
  },
  cinemaStarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  cinemaStarForeground: {
    color: '#FF0000', 
    fontSize: 14,
  },

  moviesRowBottom: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: 2,
    left: 100,
  },
  miniPosterImage: {
    width: 45,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#000',
  },

  cinemaRightActionContainer: {
    width: 130,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainerWithButton: {
    width: 125,
    height: 100,
    position: 'relative', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  cinemaMainImageRight: {
    width: "100%",
    height: "130%",
    borderRadius: 6,
    marginTop: 5,
    backgroundColor: '#000',
    left: 10,
  },
  seeMoreBtnOverlay: {
    position: 'absolute',
    bottom: -15,           
    backgroundColor: '#B22300',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,          
    elevation: 5,
    left: 35,    
  },
  seeMoreBtnText: {
    color: '#FFFEB2',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  mapButtom:{
    width: 280, 
    height: 70, 
    resizeMode: 'contain' 
  },

  mapContainer: { flex: 1, backgroundColor: "#000" },
  backButtonMap: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1000,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 50,
  },
  backIconMap: { 
    width: 50,
    height: 50,
  },
  navbarWrapperMap: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 1000,
  },
  retryContainer: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
    padding: 20,
    borderRadius: 12,
    zIndex: 2000,
    alignItems: "center",
    width: "80%",
    maxWidth: 350,
  },
  retryText: {
    color: "#FFF",
    fontFamily: "Poppins-Regular",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#FFFEB2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#000",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },

  adminFab: {
    position: "absolute",
    bottom: 90, 
    right: 20,
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#B22300", 
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    elevation: 6, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  adminFabText: {
    color: "#FFF",
    fontSize: 34,
    fontFamily: "Poppins-Bold",
    lineHeight: 38, 
  },
})

export const popupStyles = {
  container: {
    backgroundColor: "#B22300", // Cor Primária
    padding: "12px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "15px",
    minWidth: "280px",
  },
  textSection: {
    flex: 1,
    textAlign: "left",
  },
  title: {
    margin: "0 0 5px 0",
    color: "#FFF",
    fontFamily: "Poppins-Bold, sans-serif",
    fontSize: "16px",
    lineHeight: "1.2",
  },
  image: {
    width: "130px",
    height: "100px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  starsContainer: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "8px",
  },
  button: {
    backgroundColor: "#FFFEB2",
    color: "#000",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    fontFamily: "Poppins-Bold, sans-serif",
    fontWeight: "bold",
    cursor: "pointer",
    width: "90%",
    fontSize: "12px",
  },
};