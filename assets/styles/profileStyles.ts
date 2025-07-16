import { StyleSheet } from "react-native"
import { moderateScale, moderateVerticalScale, scale, verticalScale } from "react-native-size-matters"


const profileStyles=StyleSheet.create({
    profileContainer: {
        borderWidth: 1,
        width: '90%',
        marginTop: verticalScale(20),
        marginHorizontal: verticalScale(10),
        alignSelf: 'center',
        borderRadius: moderateScale(7),
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(15),
      },
      profileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(20),
      },
      profilePicContainer: {
        width: moderateScale(45, 0.6),
        height: moderateVerticalScale(45, 0.4),
        borderRadius: moderateScale(30),
      },
      userIconStyle: {
        width: scale(26),
        height: verticalScale(26),
      },
      
      profilePhone: {
        marginTop: verticalScale(5),
    
      },
      editIconStyle: {
        width: scale(24),
        height: verticalScale(24),
      },
      menuContainer: {
        borderWidth: 1,
        width: '90%',
        marginTop: verticalScale(20),
        marginHorizontal: verticalScale(10),
        alignSelf: 'center',
        borderRadius: moderateScale(7),
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(20),
      },
      menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(18),
        paddingBottom: verticalScale(16),
      },
      menuIconContainer: {
        width: moderateScale(40, 0.6),
        height: moderateVerticalScale(40, 0.4),
        borderRadius: moderateScale(30),
      },
      menuIconStyle: {
        width: scale(26),
        height: verticalScale(26),
      },
      menuIconStyleAlt: {
        width: scale(24),
        height: verticalScale(24),
      },
})
export default profileStyles;