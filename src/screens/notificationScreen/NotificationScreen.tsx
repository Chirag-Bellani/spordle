import { Image, StyleSheet, Text, View } from 'react-native';
import HeaderComp from '../../components/HeaderComp';
import GoBack from '../../components/GoBack';
import imagePath from '../../constants/imagePath';
import { moderateScale } from 'react-native-size-matters';
import { COLORS } from '../../constants/color';
import NetInfoComponent from '../../components/NetInfoComponent';

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <HeaderComp headerText={'Notification'} />

      <GoBack />
      <NetInfoComponent />
      <View style={styles.v}>
        <Image source={imagePath.noData1} style={styles.notificationImage} />
      </View>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  v: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationImage: {
    width: moderateScale(200),
    height: moderateScale(200),
  },
});
