import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
  Image,
  ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import GetLocation from 'react-native-get-location';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import ButtonComp from '../../components/ButtonComp';
import { COLORS } from '../../constants/color';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import navigationString from '../../constants/navigationString';
import Geocoder from 'react-native-geocoding';
import imagePath from '../../constants/imagePath';
import StatusComp from '../../components/StatusComp';
import Config from 'react-native-config';

// Initialize Geocoder once
if (!(Geocoder as any).isInitialized) {
  Geocoder.init(Config.GOOGLE_MAPS_API_KEY || '');
  (Geocoder as any).isInitialized = true;
}

const EnableLocation = () => {
  const navigation = useNavigation<any>();
  const { setIsLocation, updateSelectedCity } = useAuth();

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        BackHandler.exitApp();
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
      return () => sub.remove();
    }, []),
  );

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

    Alert.alert('Location Required', 'Please enable location permission', [
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
      { text: 'Cancel', style: 'cancel' },
    ]);

    return false;
  };

  // CRITICAL FIX: Update BOTH isLocation AND selectedCity
  const saveLocation = async (lat: number, lng: number) => {
    try {
      const geo = await Geocoder.from(lat, lng);

      const fullAddress = geo.results[0].formatted_address;
      const parts = fullAddress.split(',').map((p: string) => p.trim());
      const shortAddress = parts.slice(0, 2).join(', ');

      // Update isLocation
      setIsLocation({
        latitude: lat,
        longitude: lng,
        address: shortAddress || 'Nearby',
      });

      // CRITICAL: Update selectedCity
      await updateSelectedCity({
        id: Date.now(),
        name: shortAddress || 'Nearby',
        formattedAddress: fullAddress,
        lat,
        lng,
      });
    } catch (error) {
      console.error('❌ EnableLocation Geocoding error:', error);

      const fallbackAddress = 'Nearby';

      setIsLocation({
        latitude: lat,
        longitude: lng,
        address: fallbackAddress,
      });

      await updateSelectedCity({
        id: Date.now(),
        name: fallbackAddress,
        formattedAddress: fallbackAddress,
        lat,
        lng,
      });
    } finally {
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: navigationString.BOTTOMTAB }],
      });
    }
  };

  const enableLocation = async () => {
    if (loading) return;

    const ok = await requestPermission();
    if (!ok) return;

    setLoading(true);

    Geolocation.getCurrentPosition(
      pos => {
        saveLocation(pos.coords.latitude, pos.coords.longitude);
      },
      async error => {
        try {
          const loc = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          });

          saveLocation(loc.latitude, loc.longitude);
        } catch (err) {
          console.error(' Both location methods failed:', err);
          setLoading(false);
          navigation.navigate(navigationString.LOCATION);
        }
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <View style={styles.container}>
      <StatusComp />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Set your location to start exploring stuff near you
        </Text>
      </View>

      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={imagePath.locationMap}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <ButtonComp
          btnText={loading ? 'Fetching Location...' : 'Enable Device Location'}
          onPress={enableLocation}
          btnStyle={styles.primaryBtn}
          btnTextStyle={styles.primaryBtnText}
          disabled={loading}
        />

        <View style={{ height: verticalScale(14) }} />

        <ButtonComp
          btnText="Enter Your Location Manually"
          onPress={() => navigation.navigate(navigationString.LOCATION)}
          btnStyle={styles.outlineBtn}
          btnTextStyle={styles.outlineBtnText}
          disabled={loading}
        />
      </View>

      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

export default EnableLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: moderateScale(20),
  },

  header: {
    marginTop: verticalScale(40),
    alignItems: 'center',
  },

  title: {
    fontSize: scale(18),
    textAlign: 'center',
    color: COLORS.darkText,
    fontWeight: '500',
  },

  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: verticalScale(280),
  },

  buttonContainer: {
    paddingBottom: verticalScale(30),
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(12),
  },
  primaryBtnText: {
    fontSize: scale(14),
    color: COLORS.secondary,
  },
  outlineBtn: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    shadowColor: 'transparent',
    overflow: 'hidden',
  },
  outlineBtnText: {
    fontSize: scale(14),
    color: COLORS.primary,
  },

  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});
