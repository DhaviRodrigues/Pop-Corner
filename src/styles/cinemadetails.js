import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';

const { width } = Dimensions.get('window');

export const cinemaDetailsStyle = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: COLORS.primary,
    zIndex: 10,
  },
  adminButtonsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  heroImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  contentWrapper: {
    padding: 20,
    paddingBottom: 100,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  cinemaName: {
    color: '#FFF',
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    flex: 1,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#330707',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B22300',
  },
  mapDistanceText: {
    color: '#FFFEB2',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 5,
    fontSize: 12,
  },
  redUnderline: {
    height: 3,
    backgroundColor: '#B22300',
    width: '60%',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginTop: 20,
    marginBottom: 10,
  },
  moviePosterWrapper: {
    alignItems: 'center',
    marginRight: 15,
    width: 100,
  },
  moviePoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieName: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 5,
  },
  btnSessoesWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: COLORS.primaryLight || '#1A1A1A',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#B22300',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  }
});