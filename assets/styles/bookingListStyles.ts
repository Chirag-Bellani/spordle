import {StyleSheet} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import mainStyles from './mainStyles';

const bookingListStyles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: scale(12),
    marginVertical: verticalScale(10),
  },
  filterButton: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(12),
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: scale(8),
    paddingBottom: verticalScale(20),
  },
  noDataContainer: {
    // flex:1,
    alignSelf: 'center',
    justifyContent: 'center',
    transform: [{translateY: 100}],
  },
  bookingCardContainer: {
    borderRadius: moderateScale(7),
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(7),
    paddingVertical: verticalScale(7),
    alignSelf: 'center',
    // Shadow for Android
    elevation: 5,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4}, // Adjusted height for better visibility
    shadowOpacity: 0.2, // Increased opacity for better contrast
    shadowRadius: moderateScale(6), // Increased radius for a softer shadow
  },
  courtImage: {
    width: scale(90),
    height: verticalScale(100),
    borderRadius: moderateScale(7),
    resizeMode: 'cover',
  },
  bookingCardContent: {
    flex: 1,
    paddingLeft: scale(10),
  },
  categoryHeaderContainer: {
    paddingBottom: verticalScale(12),
  },
  sportsCategoryImage: {
    width: scale(16),
    height: verticalScale(16),
  },
  titleAddressContainer: {
    flexDirection: 'row',
  },
  titleAddressInnerContainer: {
    width: '70%',
  },
  addressContainer: {
    ...mainStyles.flexContainer,
    width: '100%',
    gap: scale(30),
  },
  addressText: {
    paddingTop: verticalScale(7),
  },
  slotCountContainer: {
    width: moderateScale(24, 0.8),
    height: moderateVerticalScale(24),
    borderRadius: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotCountText: {
    color: '#ffffff',
    fontSize: scale(12),
  },
  dateSlotContainer: {
    paddingTop: verticalScale(16),
    width: '100%',
  },
});
export default bookingListStyles;
