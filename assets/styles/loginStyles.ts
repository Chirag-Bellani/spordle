import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import {FONTS} from '../../constants/font';

const loginStyles = StyleSheet.create({
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.secondary,
    borderTopLeftRadius: moderateScale(50),
    borderTopRightRadius: moderateScale(50),
    height: verticalScale(110),
    padding: moderateScale(25),
  },
  heading: {
    color: COLORS.darkText,
    fontFamily: FONTS.inriaSansBold,
    fontSize: scale(20),
    marginTop: verticalScale(5),
    marginBottom: verticalScale(20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    borderRadius: moderateScale(6),
    width: '100%',
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    paddingVertical: verticalScale(3),
    marginVertical: verticalScale(5),
    paddingHorizontal: moderateScale(10),
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    borderRightWidth: 1,
    borderRightColor: COLORS.borderColor,
    paddingRight: scale(10),
  },
  countryCode: {
    color: COLORS.darkText,
    fontFamily: FONTS.nunitoMedium,
    fontSize: scale(13),
  },
  flagIcon: {
    height: moderateScale(18),
    width: moderateScale(24),
  },
  input: {
    color: COLORS.darkText,
    fontFamily: FONTS.nunitoMedium,
    fontSize: scale(15),
    minHeight: verticalScale(30),
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(7),
    marginTop: verticalScale(10),
    width: '90%',
    marginLeft: scale(5),
  },
  termsText: {
    color: COLORS.lightText,
    textAlign: 'center',
  },
  linkText: {
    color: COLORS.linkingColor,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginTop: verticalScale(20),
    width: '100%',
  },
  crossButton: {
    position: 'absolute',
    top: verticalScale(130),
    right: scale(22),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    height: moderateScale(42),
    width: moderateScale(42),
    borderRadius: moderateScale(50),
    elevation: 9,
  },
  crossIcon: {
    height: moderateScale(24),
    width: moderateScale(24),
  },
});
export default loginStyles;
