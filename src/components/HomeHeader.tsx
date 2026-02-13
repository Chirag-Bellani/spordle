import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { icon } from '../constants/icon';
import { COLORS } from '../constants/color';
import navigationString from '../constants/navigationString';
import { useAuth } from '../context/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface SelectedCity {
  name: string;
}

interface HomeHeaderProps {
  currentRoute: string;
  selectedCity?: SelectedCity | null;
}

type RootStackParamList = {
  LocationScreen: undefined;
  NotificationScreen: undefined;
  ProfileScreen: undefined;
};

const HomeHeader: React.FC<HomeHeaderProps> = ({
  currentRoute,
  selectedCity,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isLocation } = useAuth();

  const getHeaderTitle = (): string => {
    switch (currentRoute) {
      case navigationString.BOOKMARKSCREEN:
        return 'Bookmarks';
      case navigationString.BOOKING:
        return 'My Bookings';
      case navigationString.HOMESCREEN:
      default:
        if (selectedCity?.name) {
          return selectedCity.name;
        }
        if (isLocation?.address) {
          return isLocation.address;
        }
        return 'Select City';
    }
  };

  const displayTitle = getHeaderTitle();

  const formatTitle = (title: string): string => {
    return title.replace(',', '\n');
  };

  return (
    <View style={styles.container}>
      {currentRoute === navigationString.HOMESCREEN ? (
        <TouchableOpacity
          style={styles.leftSection}
          onPress={() => navigation.navigate('LocationScreen')}
          activeOpacity={0.7}
        >
          <Image source={icon.locationIcon} style={styles.icon} />
          <Text numberOfLines={2}>{getHeaderTitle().replace(',', '\n')}</Text>
          <Image source={icon.downArrowIcon} style={styles.icon} />
        </TouchableOpacity>
      ) : (
        <View style={styles.leftSection}>
          <Text style={styles.locationText}>{displayTitle}</Text>
        </View>
      )}

      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationScreen')}
          style={styles.iconButton}
        >
          <Image source={icon.notificationIcon} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileScreen')}
          style={styles.iconButton}
        >
          <Image source={icon.userIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: moderateScale(15),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(10),
    backgroundColor: COLORS.secondary,
    elevation: 3,
    height: verticalScale(90),
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: {
    width: moderateScale(22),
    height: moderateScale(22),
    marginHorizontal: moderateScale(4),
  },
  locationText: {
    fontSize: moderateScale(16),
    marginHorizontal: moderateScale(6),
    color: COLORS.darkText,
  },
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: moderateScale(15) },
});
