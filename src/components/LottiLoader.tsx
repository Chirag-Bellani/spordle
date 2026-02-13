import { StyleSheet, Text, View } from 'react-native';

import LottieView from 'lottie-react-native';
import { moderateScale } from 'react-native-size-matters';

const LottiLoader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 12,
      }}
    >
      <LottieView
        source={require('../assets/animation/boxloader.json')}
        autoPlay
        loop
        style={{ width: moderateScale(150), height: moderateScale(150) }}
      />
    </View>
  );
};

export default LottiLoader;

const styles = StyleSheet.create({});
