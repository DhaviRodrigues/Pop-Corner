import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const commentModerationStyle = StyleSheet.create({

  // ─── Layout ────────────────────────────────────────────────────────────────

  scrollContentInner: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: height * 0.18,
  },

  // ─── Título ────────────────────────────────────────────────────────────────

  pageTitle: {
    color: '#FFFEB2',
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.03,
    textAlign: 'center',
    marginVertical: height * 0.018,
  },

  // ─── Header ────────────────────────────────────────────────────────────────

  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginTop: 10,
    height: height * 0.16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backEmoji: {
    fontSize: 20,
    color: '#FFFEB2',
    textAlign: 'center',
    lineHeight: 22,
  },
  logoImage: {
    width: width * 0.4,
    height: height * 0.12,
    resizeMode: 'contain',
  },
  titleLogo: {
    width: width * 0.36,
    height: height * 0.12,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 8,
  },

  // ─── SearchBar ─────────────────────────────────────────────────────────────

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: height * 0.03,
    paddingHorizontal: 14,
    height: height * 0.062,
    width: 300,
    marginHorizontal: 16,
    marginBottom: height * 0.02,
  },
  inputText: {
    flex: 1,
    fontSize: height * 0.016,
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  searchEmoji: {
    fontSize: 16,
    marginRight: 8,
    color: '#FFFEB2',
  },

  // ─── FilterTabs ────────────────────────────────────────────────────────────

  tabsScroll: {
    marginBottom: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 62,
    alignItems: 'center',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 140,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    gap: 10,
  },
  filterTabActive: {
    backgroundColor: '#FFFEB2',
    borderColor: '#FFFEB2',
  },
  filterTabText: {
    fontSize: height * 0.015,
    color: '#20201f',
    fontFamily: 'Poppins-SemiBold',
  },
  filterTabTextActive: {
    color: '#8B0000',
  },
  filterTabBadge: {
    backgroundColor: '#B22300',
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterTabBadgeActive: {
    backgroundColor: '#8B0000',
  },
  filterTabBadgeText: {
    color: '#FFFEB2',
    fontSize: height * 0.012,
    fontFamily: 'Poppins-SemiBold',
  },
  filterTabBadgeTextActive: {
    color: '#FFFEB2',
  },

  // ─── SelectAllBar ──────────────────────────────────────────────────────────

  selectAllBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    width: '94%',
    maxWidth: 600,
    height: 50,
    marginBottom: 14,
    marginTop: 18,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    zIndex: 2,
  },

  contentWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },

  topControls: {
    width: '100%',
    alignItems: 'center',
  },

  listWrapper: {
    flex: 1,
    width: '100%',
  },

  flatList: {
    flex: 1,
    width: '100%',
  },

  selectAllLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FFFEB2',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxTick: {
    color: '#FFFEB2',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  selectAllText: {
    color: '#FFFEB2',
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.015,
  },
  orderText: {
    color: '#FFFEB2',
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.015,
  },

  // ─── CommentCard ───────────────────────────────────────────────────────────

  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 12,
    gap: 8,
  },
  cardCircleSelect: {
    width: 20,
    height: 20,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FFFEB2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCircleSelectSelected: {
    backgroundColor: '#6C3483',
    borderColor: '#6C3483',
  },
  cardCircleSelectTick: {
    color: '#FFFEB2',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  cardSelected: {
    borderWidth: 1,
    borderColor: '#6C3483',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFEB2',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardLeftTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C0392B',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    color: '#FFFEB2',
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.018,
  },
  authorName: {
    color: '#1A1A1A',
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.016,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
    marginTop: 2,
  },
  star: {
    fontSize: 12,
  },
  starFilled: {
    color: '#C0392B',
  },
  starEmpty: {
    color: '#CCCCCC',
  },
  cardRightTop: {
    alignItems: 'flex-end',
    gap: 2,
  },
  verPostText: {
    color: '#8B0000',
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.012,
    textDecorationLine: 'underline',
  },

  // ─── StatusBadge ───────────────────────────────────────────────────────────

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  statusBadgeText: {
    fontSize: height * 0.013,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },

  // ─── Corpo do card ─────────────────────────────────────────────────────────

  cardBodyText: {
    fontSize: height * 0.014,
    color: '#333333',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
    lineHeight: height * 0.022,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardBottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  dateText: {
    color: '#888888',
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.011,
  },
  tagBadge: {
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.012,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    height: height * 0.042,
    borderRadius: height * 0.025,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  approveBtnBg: {
    backgroundColor: '#27AE60',
  },
  rejectBtnBg: {
    backgroundColor: '#1A1A1A',
  },
  archiveBtnBg: {
    backgroundColor: '#6C3483',
  },
  actionBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: height * 0.014,
    color: '#FFFFFF',
  },
});