import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import ImageComp from '../../components/ImageComp';
import ButtonComp from '../../components/ButtonComp';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../../navigation/navigationTypes';
import { COLORS } from '../../constants/color';
import Geolocation from 'react-native-geolocation-service';
import GetLocation from 'react-native-get-location';
import { useAuth } from '../../context/AuthContext';
import Geocoder from 'react-native-geocoding';
import Config from 'react-native-config';

// Initialize Geocoder once
if (!(Geocoder as any).isInitialized) {
  Geocoder.init(Config.GOOGLE_MAPS_API_KEY || '');
  (Geocoder as any).isInitialized = true;
}

const OnboardingScreen: React.FC<AuthStackScreenProps<'OnboardingScreen'>> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { setIsLocation, updateSelectedCity } = useAuth();

  useEffect(() => {
    fetchLocation();
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) showSettingsAlert();
    else showRetryAlert();
    return false;
  };

  const showRetryAlert = () => {
    Alert.alert('Location Required', 'Enable location to find nearby box', [
      { text: 'Retry', onPress: fetchLocation },
      {
        text: "I'M Sure",
        style: 'cancel',
        onPress: () => navigation.navigate('LoginScreen'),
      },
    ]);
  };

  const showSettingsAlert = () => {
    Alert.alert(
      'Permission Blocked',
      'Location permission is blocked. Please enable it from settings.',
      [
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
        {
          text: 'Go Further',
          style: 'cancel',
          onPress: () => navigation.navigate('LoginScreen'),
        },
      ],
    );
  };
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
        address: shortAddress || 'Nearby' 
      });

 
      await updateSelectedCity({
        id: Date.now(),
        name: shortAddress || 'Nearby',
        formattedAddress: fullAddress,
        lat,
        lng,
      });

      navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
    } catch (error) {
      console.error('❌ Onboarding Geocoding error:', error);
      
      const fallback = 'Nearby';
      
      setIsLocation({ 
        latitude: lat, 
        longitude: lng, 
        address: fallback 
      });

      await updateSelectedCity({
        id: Date.now(),
        name: fallback,
        formattedAddress: fallback,
        lat,
        lng,
      });

      navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
    }
  };

  const fetchLocation = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      pos => saveLocation(pos.coords.latitude, pos.coords.longitude),
      async () => {
        try {
          const loc = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          });
          saveLocation(loc.latitude, loc.longitude);
        } catch (error) {
          console.error('❌ Error fetching location:', error);
        }
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <View style={styles.container}>
      <ImageComp />
      <View style={styles.middleSection}>
        <Text style={styles.headText}>
          Find Players In {'\n'}Your Neighbourhood
        </Text>
        <Text style={styles.subText}>Just like you did as a kid!</Text>
      </View>
      <View style={[styles.bottomSection, { marginBottom: insets.bottom + 20 }]}>
        <Text style={styles.actionText}>Let's Get Playing!</Text>
        <ButtonComp btnText="GO" onPress={() => navigation.navigate('LoginScreen')} />
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  middleSection: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(90),
  },
  headText: {
    fontSize: scale(26),
    fontFamily: 'Inria Sans',
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.darkText,
    marginBottom: moderateVerticalScale(10),
    lineHeight: scale(32),
  },
  subText: {
    fontSize: scale(16),
    fontFamily: 'Nunito',
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.lightText,
    lineHeight: moderateScale(20),
  },
  bottomSection: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  actionText: {
    fontSize: moderateScale(16),
    fontFamily: 'Inria Sans',
    fontWeight: '400',
    textAlign: 'center',
    color: COLORS.darkText,
    marginBottom: moderateVerticalScale(12),
  },
});
