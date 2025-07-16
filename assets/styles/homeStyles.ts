import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';

const HEADER_HEIGHT = moderateVerticalScale(60); // height of the header
const homeStyles = StyleSheet.create({
  sportsContainer: {
    marginTop: verticalScale(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '110%',
  },
  sportItem: {
    alignItems: 'center',
    //  marginHorizontal:scale(17),
    marginRight: scale(20),
    marginBottom: verticalScale(12),
  },
  sportItemSelected: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: scale(5),
    borderColor: COLORS.primary,
  },
  sportLogoBackground: {
    width: moderateScale(40, 0.3),
    height: moderateVerticalScale(40, 0.3),
    borderRadius: moderateScale(30),
    backgroundColor: COLORS.itemBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(4),
  },
  sportLogo: {
    width: scale(24),
    height: scale(24),
    resizeMode: 'contain',
  },
  searchAndListContainer: {
    marginTop: verticalScale(5),
    paddingHorizontal: scale(10),
  },
  flatListContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(300),
  },

  animatedFilter: {
    top: HEADER_HEIGHT - moderateVerticalScale(110),
    left: 0,
    right: 0,
    paddingHorizontal: scale(5),
    zIndex: 12,
  },
  animatedSlider: {
    top: HEADER_HEIGHT - moderateVerticalScale(120),
    left: 0,
    right: 0,
    paddingHorizontal: scale(5),
    marginTop: verticalScale(60),
    zIndex: 12,
  },
  animatedSearch: {
    top: HEADER_HEIGHT - moderateVerticalScale(60),
    left: 0,
    right: 0,
    paddingHorizontal: scale(5),
    marginHorizontal: scale(10),
    marginTop: verticalScale(-30),
    zIndex: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '80%',
    left: 0,
    right: 0,
    transform: [{translateY: 100}],
    zIndex: 44, // Ensure it appears above the list
  },
});
export default homeStyles;
