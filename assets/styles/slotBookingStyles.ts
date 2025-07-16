import {StyleSheet} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';

const bookingListStyles = StyleSheet.create({
  customHeaderStyles: {
    height: verticalScale(80),
    paddingTop: verticalScale(20),
    gap: scale(110),
  },
  courtSelectionContainerSkeleton: {
    width: moderateScale(35),
    height: moderateVerticalScale(35),
    backgroundColor: '#E0E0E0', // Skeleton background
    borderRadius: moderateScale(5),
    opacity: 0.6,
  },
  courtSelectionButton: {
    borderRadius: moderateScale(5),
    height: moderateVerticalScale(35),
    width: moderateScale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  courtHasSlotsIndicator: {
    height: verticalScale(4),
    width: moderateScale(4),
    borderRadius: moderateScale(10),
    position: 'absolute',
    right: moderateScale(-7),
    top: moderateVerticalScale(-3),
  },
  slotButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(25),
    paddingHorizontal: scale(6),
    borderRadius: moderateScale(5),
    width: '50%',
  },
  bottomInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: verticalScale(110),
    width: '100%',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    paddingBottom: verticalScale(30),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  courtSelectionContainer: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(20),
  },
  datePickerContainer: {
    paddingHorizontal: scale(12),
  },
  bannerContainer: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    marginVertical: verticalScale(12),
  },
  slotSelectionContainer: {
    marginTop: verticalScale(10),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
  },
  dayNightIconContainer: {
    width: scale(24),
    height: verticalScale(24),
    marginTop: verticalScale(5),
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rowWithGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  bookedCheckBox: {
    backgroundColor: '#D3D3D3',
  },
  selectedCheckBox: {
    backgroundColor: '#FDEBE9',
    borderColor: '#FF4F0A',
  },
  continueButton: {
    width: '50%',
  },
});
export default bookingListStyles;
