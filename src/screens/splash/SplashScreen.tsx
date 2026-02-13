import { ImageBackground, StyleSheet, View } from 'react-native';
import { moderateScale, scale} from 'react-native-size-matters';
import imagePath from '../../constants/imagePath';
import StatusComp from '../../components/StatusComp';
import { COLORS } from '../../constants/color';
import LottieView from 'lottie-react-native';
const SplashScreen = () => {
 
  return (
    <View style={styles.container}>
      <ImageBackground
        source={imagePath.splashBackground}
        style={styles.image}
      />
      {/* <StatusComp barColor={COLORS.primary} /> */}
     <View style={{flex:1,position:'absolute',justifyContent:'center',alignItems:'center',zIndex:12}}>
       <LottieView
        source={require('../../assets/animation/boxbooking.json')}
        autoPlay
        loop
        style={{ width:moderateScale(800), height: moderateScale(800) }}
      />
     </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  image: {
    resizeMode: 'cover',
    width: moderateScale(412),
    height: moderateScale(1000),
    backgroundColor: COLORS.primary,
  },
  text: {
    fontSize: scale(60),
    fontWeight: 'bold',
    fontFamily: 'Inria Sans',
    color: COLORS.secondary,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
