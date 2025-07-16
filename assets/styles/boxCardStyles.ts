import {StyleSheet} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import {COLORS} from '../../constants/color';
import {FONTS} from '../../constants/font';

const boxCardStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(10),
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(4),
    paddingTop: verticalScale(10),

    width: scale(305),
    alignSelf: 'center',

    // Shadow for Android
    elevation: 5,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4}, // Increase height for better visibility
    shadowOpacity: 0.2, // Increase opacity
    shadowRadius: moderateScale(6), // Increase radius
  },
  sliderContainer: {
    height: verticalScale(130),
    alignSelf: 'center',
    width: scale(290),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(9),
    overflow: 'hidden',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: moderateScale(9),
  },
  paginationContainer: {
    position: 'absolute',
    bottom: verticalScale(-18),
    alignSelf: 'center',
  },
  paginationDotActive: {
    width: moderateScale(5),
    height: moderateVerticalScale(5),
    borderRadius: scale(4),
    marginHorizontal: scale(-10),
    backgroundColor: COLORS.primary,
  },
  paginationDotInactive: {
    width: moderateScale(5),
    height: moderateVerticalScale(5),
    borderRadius: scale(4),
    backgroundColor: COLORS.secondary,
  },
  cardLabel: {
    position: 'absolute',
    alignSelf: 'flex-start',
    top: verticalScale(10),
    left: scale(5),
    backgroundColor: 'rgba(237, 130, 53, 0.58)',
    padding: scale(3),
    borderRadius: moderateScale(5),
  },
  labelText: {
    color: COLORS.secondary,
    fontFamily: FONTS.nunitoRegular,
    fontSize: scale(12),
  },
  sportsCategoryLabel: {
    position: 'absolute',
    alignSelf: 'flex-start',
    bottom: verticalScale(5),
    left: scale(5),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(3),
  },
  categoryIcon: {
    width: scale(15),
    height: verticalScale(15),
  },
  categorySeparator: {
    color: COLORS.secondary,
    fontSize: moderateScale(12),
  },
  bookMarkContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: verticalScale(10),
    right: scale(10),
  },
  bookmarkIcon: {
    width: scale(20),
    height: verticalScale(20),
  },
  bookmarkIconToggled: {
    width: scale(20),
    height: verticalScale(20),
  },
  detailsContainer: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(8),
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: verticalScale(14),
    borderBottomColor: COLORS.lightBorder,
    borderBottomWidth: 1,
  },
  titleContainer: {
    width: '70%',
  },
  boxTitle: {
    fontFamily: FONTS.inriaSansRegular,
    fontSize: scale(18),
    color: COLORS.darkText,
  },
  rating: {
    fontFamily: FONTS.nunitoMedium,
    fontSize: scale(13),
    color: COLORS.darkText,
  },
  address: {
    fontFamily: FONTS.nunitoSemiBold,
    fontSize: scale(13),
    color: COLORS.lightText,
    marginTop: verticalScale(4),
  },
  secondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(10),
  },
  price: {
    fontFamily: FONTS.nunitoBold,
    fontSize: scale(13),
    color: COLORS.darkText,
  },
  offers: {
    fontFamily: FONTS.nunitoMedium,
    fontSize: scale(13),
    color: COLORS.darkText,
  },
  offerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(6),
  },
  offerIcon: {
    width: scale(20),
    height: verticalScale(20),
  },
});

export default boxCardStyles;
