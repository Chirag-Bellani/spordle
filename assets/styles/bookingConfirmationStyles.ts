import {StyleSheet} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';

const bookingConfirmationStyles = StyleSheet.create({
  subHeader: {
    height: verticalScale(80),
    paddingTop: verticalScale(20),
  },
  scrollViewContent: {
    paddingHorizontal: scale(18),
    paddingBottom: verticalScale(70),
  },
  bookingCardContainer: {
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
  },
  bookingImage: {
    width: moderateScale(95),
    height: moderateVerticalScale(104),
    borderRadius: moderateScale(10),
    resizeMode: 'cover',
  },
  bookingDetailsContainer: {
    paddingLeft: scale(12),
  },
  bookingTitleContainer: {
    width: '70%',
  },
  addressContainer: {
    gap: scale(5),
    marginBottom: verticalScale(10),
  },
  locationIcon: {
    width: scale(20),
    height: verticalScale(18),
    marginTop: verticalScale(5),
  },
  dateSlotContainer: {
    width: '90%',
  },
  offersContainer: {
    width: '100%',
    marginVertical: verticalScale(12),
    borderWidth: 1,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(7),
  },
  paymentOptionContainer: {
    flexDirection: 'row',
    gap: scale(12),
  },
  paymentOptionButton: {
    paddingVertical: verticalScale(7),
    paddingHorizontal: scale(14),
    borderRadius: moderateScale(5),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentDetailsContainer: {
    borderWidth: 1,
    marginVertical: scale(15),
    borderRadius: moderateScale(8),
    gap: verticalScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
  },
  tncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
    width: '92%',
    gap: scale(12),
  },
  cancellationContainer: {
    marginVertical: verticalScale(12),
  },
  cancellationItem: {
    marginLeft: scale(10),
    gap: verticalScale(10),
  },
  bulletPoint: {
    fontSize: scale(9),
  },
  primaryButton: {
    position: 'absolute',
    bottom: verticalScale(10),
    width: '95%',
  },
});

export default bookingConfirmationStyles;
