import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import {FONTS} from '../../constants/font';

const {height} = Dimensions.get('window');

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    //marginTop: moderateVerticalScale(50),
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  widthFull: {
    width: '100%',
  },
  dropShadowEffect: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  darkTextColor: {
    color: COLORS.darkText,
  },
  lightTextColor: {
    color: COLORS.lightText,
  },
  primaryTextColor: {
    color: COLORS.primary,
  },
  secondaryTextColor: {
    color: COLORS.secondary,
  },
  successTextColor: {
    color: COLORS.success,
  },

  infoTextColor: {
    color: COLORS.infoColor,
  },
  errotTextColor: {
    color: COLORS.errorColor,
  },
  warningTextColor: {
    color: COLORS.warning,
  },
  linkTextColor: {
    color: COLORS.linkingColor,
  },
  primaryBorderColor: {
    borderColor: COLORS.borderColor,
  },
  secondaryBorderColor: {
    borderColor: COLORS.lightBorder,
  },
  infoBorderColor: {
    borderColor: COLORS.infoColor,
  },

  borderWidth1: {
    borderWidth: 1,
  },
  primaryBackgroundColor: {
    backgroundColor: COLORS.primary,
  },
  secondaryBackgroundColor: {
    backgroundColor: COLORS.secondary,
  },
  infoBackgroundColor: {
    backgroundColor: COLORS.infoColor,
  },
  secondaryInfoBackgroundColor: {
    backgroundColor: COLORS.secondaryInfoColor,
  },
  disabledBackgroundColor: {
    backgroundColor: COLORS.disabled,
  },
  successBackgroudColor: {
    backgroundColor: COLORS.success,
  },
  iconBackgroundColor: {
    backgroundColor: COLORS.lightBorder,
  },
  itemBackgroundColor: {
    backgroundColor: COLORS.itemBackground,
  },
  fontNunitoBold: {
    fontFamily: FONTS.nunitoBold,
  },
  fontNunitoRegular: {
    fontFamily: FONTS.nunitoRegular,
  },
  fontNunitoSemibold: {
    fontFamily: FONTS.nunitoSemiBold,
  },
  fontNunitoMedium: {
    fontFamily: FONTS.nunitoMedium,
  },
  fontInriaSansBold: {
    fontFamily: FONTS.inriaSansBold,
  },
  fontInriaSansRegular: {
    fontFamily: FONTS.inriaSansRegular,
  },
  fontInriaSansLight: {
    fontFamily: FONTS.inriaSansLight,
  },
  fontSize24: {
    fontSize: scale(24),
  },

  fontSize22: {
    fontSize: scale(22),
  },
  fontSize20: {
    fontSize: scale(20),
  },
  fontSize18: {
    fontSize: scale(18),
  },
  fontSize14: {
    fontSize: scale(14),
  },
  fontSize16: {
    fontSize: scale(16),
  },
  fontSize12: {
    fontSize: scale(12),
  },
  fontSize11: {
    fontSize: scale(11),
  },

  marginTop10: {
    marginTop: verticalScale(10),
  },
  marginTop20: {
    marginTop: verticalScale(20),
  },
  paddingTop10: {
    paddingTop: verticalScale(10),
  },

  scrollToTopButton: {
    position: 'absolute',
    bottom: verticalScale(20),
    backgroundColor: 'rgba(52, 52, 52, 0.54)',
    paddingVertical: verticalScale(7),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(10),
    zIndex: 15,
    alignSelf: 'center',
  },
});
export default mainStyles;
