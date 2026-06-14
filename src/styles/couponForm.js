import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "@/constants/colors";
const { height, width } = Dimensions.get('window');

export const placeholderColor = '#AAAAAA';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').TextStyle} TextStyle
 * @typedef {import('react-native').ImageStyle} ImageStyle
 * @typedef {import('react-native').NamedStyles<{
 *   headerContainer: ViewStyle;
 *   backButton: ViewStyle;
 *   backEmoji: TextStyle;
 *   logoImage: ImageStyle;
 *   pageTitle: TextStyle;
 *   formContainer: ViewStyle;
 *   inputWrapper: ViewStyle;
 *   inputText: TextStyle;
 *   inputRow: ViewStyle;
 *   inputHalf: ViewStyle;
 *   sliderRow: ViewStyle;
 *   sliderItem: ViewStyle;
 *   sliderTrack: ViewStyle;
 *   sliderTrackActive: ViewStyle;
 *   sliderThumb: ViewStyle;
 *   sliderThumbActive: ViewStyle;
 *   sliderLabel: TextStyle;
 *   textAreaWrapper: ViewStyle;
 *   textAreaHeader: ViewStyle;
 *   textAreaHeaderText: TextStyle;
 *   textAreaInput: TextStyle;
 *   confirmButton: ViewStyle;
 *   confirmButtonText: TextStyle;
 *   scrollContentInner: ViewStyle;
 * }>} CouponFormStyles
 */

/** @type {CouponFormStyles} */
export const couponFormStyle = StyleSheet.create({

  // ─── Header ───────────────────────────────────────────────────────────────

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
    height: height * 0.13,
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backEmoji: {
    fontSize: 18,
    color: '#FFFEB2',
    lineHeight: 20,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  logoImage: {
    width: width * 0.4,
    height: height * 0.1,
    resizeMode: 'contain',
  },

  // ─── Título ────────────────────────────────────────────────────────────────

  pageTitle: {
    color: '#FFFEB2',
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.028,
    textAlign: 'center',
    marginBottom: height * 0.025,
    paddingHorizontal: 24,
  },

  // ─── Formulário ────────────────────────────────────────────────────────────

  formContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: height * 0.058,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  inputText: {
    fontSize: height * 0.016,
    color: '#333333',
    fontFamily: 'Poppins-SemiBold',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputHalf: {
    flex: 1,
  },

  // ─── Sliders ───────────────────────────────────────────────────────────────

  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  sliderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderTrack: {
    width: 42,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  sliderTrackActive: {
    backgroundColor: '#FFFEB2',
  },
  sliderThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: 'flex-start',
  },
  sliderThumbActive: {
    backgroundColor: '#B22300',
    alignSelf: 'flex-end',
  },
  sliderLabel: {
    color: '#FFFEB2',
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.016,
  },

  // ─── Observações ───────────────────────────────────────────────────────────

  textAreaWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  textAreaHeader: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  textAreaHeaderText: {
    fontSize: height * 0.016,
    color: '#333333',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  textAreaInput: {
    height: height * 0.14,
    paddingHorizontal: 14,
    paddingTop: 10,
    fontSize: height * 0.015,
    color: '#333333',
    fontFamily: 'Poppins-SemiBold',
    textAlignVertical: 'top',
  },

  // ─── Botão Confirmar ───────────────────────────────────────────────────────

  confirmButton: {
    backgroundColor: '#FFFEB2',
    borderRadius: height * 0.04,
    height: height * 0.07,
    marginHorizontal: 40,
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  confirmButtonText: {
    color: '#1A1A1A',
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.025,
  },

  // ─── Scroll ────────────────────────────────────────────────────────────────

  scrollContentInner: {
    paddingBottom: height * 0.18,
  },

    backButtonContainer: {
      position: "absolute",
      top: height * 0.06,
      left: width * 0.05,
      zIndex: 99,
    },
    scrollContent: { 
      paddingBottom: height * 0.2, 
      paddingTop: height * 0.02 
    },
    formContainer: {
      width: width * 0.9,
      alignSelf: "center",
      alignItems: "center",
    },
    titleText: {
      marginVertical: height * 0.03,
      textAlign: "center",
      fontFamily: "Poppins-Bold",
    },
    row: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "center",
      gap: 10,
      marginVertical: height * 0.010,
    },
    halfInput: { flex: 1 },
    fullInput: { width: "100%", marginVertical: height * 0.010 },
    grayBoxContainer: {
      width: "100%",
      backgroundColor: COLORS.textMuted,
      borderRadius: 20,
      padding: width * 0.04,
      marginTop: height * 0.02,
      marginBottom: height * 0.02,
    },
    grayBoxTitle: {
      color: COLORS.black,
      marginBottom: height * 0.015,
      fontSize: width * 0.042,
      fontFamily: "Poppins-Bold",
    },
    errorText: {
      color: COLORS.gold,
      fontSize: width * 0.035,
      textAlign: "center",
      marginTop: 10,
      marginBottom: 10,
      fontFamily: "Poppins-SemiBold",
    },
    dropdownWrapper: {
      width: "100%", 
      marginVertical: height * 0.010,
      zIndex: 99,
      elevation: 15,
    },
    inputDisabled: {
    opacity: 0.6,
    backgroundColor: '#E8E8E8',
  },
});