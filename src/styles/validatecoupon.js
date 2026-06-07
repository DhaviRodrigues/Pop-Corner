import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const validateStyle = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.gold,
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginRight: 40, 
  },
  inputCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.red,
    marginBottom: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  instructionText: {
    color: '#CCC',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.orange,
    paddingHorizontal: 15,
    height: 55,
    justifyContent: 'center',
    marginBottom: 25,
  },
  inputField: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    letterSpacing: 2,
    outlineStyle: 'none',
  },
  

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  popupContainer: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: '#FFF', // Fundo Branco solicitado
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    borderWidth: 3,
    // A cor da borda será injetada dinamicamente via JS (Vermelho ou Verde/Dourado)
  },
  popupTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
  },
  popupMessage: {
    color: COLORS.textMuted, // Cor do texto solicitada
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  popupBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  popupBtnText: {
    color: '#FFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  }
});