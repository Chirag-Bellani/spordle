import { StyleSheet } from 'react-native';
import { moderateScale, moderateVerticalScale, scale, verticalScale } from 'react-native-size-matters';
import { COLORS } from '../../constants/color';
import { FONTS } from '../../constants/font';

const otpStyles = StyleSheet.create({
  foregroundImage: {
    borderRadius: moderateScale(50),
    marginTop: verticalScale(100),
  },
  otpLabelContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phoneNumberText: {
    fontFamily: FONTS.nunitoSemiBold,
    fontSize: scale(12),
    color: COLORS.darkText,
    textDecorationLine: 'underline',
  },
  otpInputContainer: {
    width: '90%',
    marginTop: verticalScale(7),
    marginBottom:verticalScale(12),
    flexDirection:'row',
    gap:scale(10),
    // marginHorizontal:scale(10),
    alignSelf:'center'
  },
  otpField: {
    width: moderateScale(48),
    height: moderateVerticalScale(44),
    borderRadius: moderateScale(8),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    fontFamily: FONTS.nunitoMedium,
    fontSize: scale(16),
    marginRight:scale(20),
    color: COLORS.darkText,
  },
  otpFieldError: {
    borderColor: COLORS.errorColor, // Highlight border if there's an error
  },
  errorText: {
    color: COLORS.errorColor,
    fontSize: scale(12),
    fontFamily: FONTS.nunitoRegular,
    marginTop: verticalScale(5),
    textAlign: 'left',
  },
  
});

export default otpStyles;
