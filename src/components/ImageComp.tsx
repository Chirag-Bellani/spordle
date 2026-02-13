import { StyleSheet, View, ImageBackground, Image } from 'react-native';
import imagePath from '../constants/imagePath';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import StatusComp from './StatusComp';
import { COLORS } from '../constants/color';

const ImageComp = () => {
  return (
    <View style={styles.mapContainer}>
     
      <ImageBackground
        source={imagePath.mapBackground}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <StatusComp />
        <View style={styles.imageWrapper}>
          <Image
            source={imagePath.onBoardingImage}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default ImageComp;

const styles = StyleSheet.create({
  // Map Section Styles
  mapContainer: {
    flex: 0.6,
    position: 'relative',
  },
  bgImage: {
    height: moderateScale(350),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -moderateScale(107) }, // Half of image width
      { translateY: -moderateScale(107) }, // Half of image height
    ],
    // Alternative positioning for better centering
    marginTop: verticalScale(20),
  },
  profileImage: {
    width: moderateScale(200),
    height: moderateScale(200),
    borderRadius: moderateScale(107), 
    borderColor:COLORS.secondary,
   
  },
});
