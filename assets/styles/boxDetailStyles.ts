import { Dimensions, StyleSheet } from "react-native";
import { moderateScale, moderateVerticalScale, scale, verticalScale } from "react-native-size-matters";
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const sliderHeight = screenHeight / 3;

const boxDetailStyles=StyleSheet.create({
    sliderContainer: {
        height: sliderHeight,
      },
    
      image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      },
      paginationContainer: {
        position: 'absolute',
        bottom: -16,
        alignSelf: 'center',
        // paddingVertical: 8,
      },
      paginationDot: {
        width: scale(5),
        height: verticalScale(5),
        borderRadius: moderateScale(6),
        marginHorizontal: scale(-3),
      },
      content: {
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(14),
      },
      locationButton: {
        borderRadius: moderateScale(7),
        width: '97%',
        borderWidth: 1,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(12),
        marginTop: verticalScale(10),
        flexDirection: 'row',
        gap: scale(10),
      },
      offerContainer: {
        // height:verticalScale(55),
        width: '97%',
        alignSelf: 'center',
        backgroundColor: '#C1F5CF',
        marginTop: verticalScale(15),
        borderRadius: moderateScale(8),
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(10),
        gap: scale(12),
      },
      sportItem:{
        alignItems: 'center',
        justifyContent:'center',
        marginRight: scale(15),
        marginBottom: verticalScale(10),
        width:scale(85),
        height:verticalScale(60),
        borderRadius:moderateScale(4)
      },
      sportsContainer: {
        marginTop: verticalScale(10),
        flexDirection: 'row',
        justifyContent:'space-evenly',
        flexWrap: 'wrap',
      },
      sportLogo:{
        width:scale(22),
        height:verticalScale(22),
        marginBottom:verticalScale(5)
      },
      amenityItem:{
        alignItems: 'center',
        flexDirection:'row',
        marginRight: scale(20),
        gap:scale(10),
        marginBottom: verticalScale(10),
      },
      amenityIcon: {
        width: moderateScale(22),
        height: moderateVerticalScale(22),
        resizeMode: 'cover'
        
    },
      reviewContainer:{
        paddingTop:verticalScale(5),
        paddingBottom:verticalScale(10),
        paddingHorizontal:scale(12),
        marginTop:verticalScale(16),
        borderRadius:moderateScale(9),
      },
      profilePic:{
        width:moderateScale(32),
        height:moderateVerticalScale(32),
        borderRadius:moderateScale(20)
      },
      topIconsContainer: {
        position: 'absolute',
        top: verticalScale(36),
        left: scale(20),
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      rightIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10), // Note: if 'gap' is not supported, use margin on children
      },
      iconButton: {
        width: moderateScale(26,0.8),
        height: moderateVerticalScale(26,0.6),
        borderRadius: moderateScale(20),
        alignItems: 'center',
        justifyContent: 'center',
      },
      
      mapViewContainer: {
        marginTop:verticalScale(20),
      },
      mapWrapper: {
        width:moderateScale(360), // Adjust width as needed
        height: verticalScale(300),  // Adjust height as needed
        // borderRadius: moderateScale(10), // This applies the rounded corners
        overflow: 'hidden', // Ensures MapView follows the border radius
      },
      map: {
        width:moderateScale(370),
        height: verticalScale(300),
        alignSelf:'center'
      },
      
      gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width:moderateScale(400),
        height: verticalScale(120), // Adjust height of fade effect
      },
})

export default boxDetailStyles