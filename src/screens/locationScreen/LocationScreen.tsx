import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';

import GetLocation from 'react-native-get-location';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

import { verticalScale, moderateScale } from 'react-native-size-matters';

import HeaderComp from '../../components/HeaderComp';
import StatusComp from '../../components/StatusComp';
import GoBack from '../../components/GoBack';
import SearchBar from '../../components/SearchBar';
import NetInfoComponent from '../../components/NetInfoComponent';

import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/color';
import navigationString from '../../constants/navigationString';
import Config from 'react-native-config';
import { AppStackScreenProps } from '../../navigation/navigationTypes';
import { ChevronRight, LocateFixed } from 'lucide-react-native';

type Prediction = {
  place_id: string;
  description: string;
};

const LocationScreen: React.FC<AppStackScreenProps<'LocationScreen'>> = ({
  navigation,
}) => {
  const { updateSelectedCity } = useAuth();

  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  
  useEffect(() => {
    Geocoder.init(Config.GOOGLE_MAPS_API_KEY || '');
  }, []);

  /** ---------------- SEARCH DEBOUNCE ---------------- */
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setNotFound(false);
      return;
    }

    const timer = setTimeout(() => {
      searchPlaces();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /** ---------------- SEARCH PLACES ---------------- */
  const searchPlaces = async () => {
    try {
      setLoading(true);
      setNotFound(false);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          search,
        )}&types=geocode&components=country:IN&key=${Config.GOOGLE_MAPS_API_KEY}`,
      );

      const data = await response.json();

      if (data?.predictions?.length) {
        setResults(data.predictions);
      } else {
        setResults([]);
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  /** ---------------- SELECT PLACE ---------------- */
  const selectPlace = async (placeId: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${Config.GOOGLE_MAPS_API_KEY}`,
      );

      const data = await response.json();
      if (!data?.result) throw new Error();

      const fullAddress = data.result.formatted_address;
      const parts = fullAddress.split(',').map((p: string) => p.trim());
      const shortName = parts.slice(0, 2).join(', ');

      await updateSelectedCity({
        id: Date.now(),
        name: shortName,
        formattedAddress: fullAddress,
        lat: data.result.geometry.location.lat,
        lng: data.result.geometry.location.lng,
      });

      navigation.navigate(navigationString.BOTTOMTAB);
    } catch {
      Alert.alert('Error', 'Unable to fetch city details');
    } finally {
      setLoading(false);
    }
  };

  /** ---------------- LOCATION PERMISSION ---------------- */
  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

    Alert.alert('Location Required', 'Please enable location permission', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);

    return false;
  };

  /** ---------------- CURRENT LOCATION ---------------- */
  const getCurrentLocation = async () => {
    if (loading) return;

    const ok = await requestPermission();
    if (!ok) return;

    setLoading(true);

    // ✅ Triggers Android system location UI
    Geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude, longitude } = pos.coords;

          const geo = await Geocoder.from(latitude, longitude);
          const fullAddress = geo.results[0].formatted_address;

          const parts = fullAddress.split(',').map(p => p.trim());
          const shortCityName = parts.slice(0, 2).join(', ');

          await updateSelectedCity({
            id: Date.now(),
            name: shortCityName,
            formattedAddress: fullAddress,
            lat: latitude,
            lng: longitude,
          });

          navigation.navigate(navigationString.BOTTOMTAB);
        } catch {
          Alert.alert('Error', 'Unable to fetch address');
        } finally {
          setLoading(false);
        }
      },

      // 🔁 Fallback
      async () => {
        try {
          const loc = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          });

          const geo = await Geocoder.from(loc.latitude, loc.longitude);
          const fullAddress = geo.results[0].formatted_address;

          const parts = fullAddress.split(',').map(p => p.trim());
          const shortCityName = parts.slice(0, 2).join(', ');

          await updateSelectedCity({
            id: Date.now(),
            name: shortCityName,
            formattedAddress: fullAddress,
            lat: loc.latitude,
            lng: loc.longitude,
          });

          navigation.navigate(navigationString.BOTTOMTAB);
        } catch {
          Alert.alert(
            'Turn on Location',
            'Please enable device location to continue',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
        } finally {
          setLoading(false);
        }
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  /** ---------------- RENDER ITEM ---------------- */
  const renderItem = ({ item }: { item: Prediction }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => selectPlace(item.place_id)}
    >
      <Text style={styles.cityText}>{item.description}</Text>
    </TouchableOpacity>
  );

  /** ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      <NetInfoComponent />
      <StatusComp />
      <HeaderComp headerText="Select Location" />
      <GoBack />

      <View style={styles.searchWrapper}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search city or area"
        />
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 15 }} />}

      {!search && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No location selected</Text>
          <Text style={styles.emptySub}>
            Search for a city or use your current location
          </Text>

          <TouchableOpacity
            style={styles.currentLocationCard}
            onPress={getCurrentLocation}
            activeOpacity={0.7}
          >
            <View style={styles.currentLocationLeft}>
              <LocateFixed size={20} color={COLORS.primary} />
              <Text style={styles.currentLocationText}>
                Use current location
              </Text>
            </View>

            <ChevronRight size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}

      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={item => item.place_id}
          renderItem={renderItem}
        />
      )}

      {!loading && notFound && (
        <View style={styles.notFound}>
          <Text>No matching locations found</Text>
        </View>
      )}
    </View>
  );
};

export default LocationScreen;

/** ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  searchWrapper: {
    margin: moderateScale(12),
  },
  listItem: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorder,
  },
  cityText: {
    fontSize: moderateScale(15),
    color: COLORS.darkText,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: verticalScale(60),
    paddingHorizontal: moderateScale(20),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: verticalScale(6),
  },
  emptySub: {
    fontSize: moderateScale(14),
    color: '#777',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  notFound: {
    alignItems: 'center',
    marginTop: verticalScale(30),
  },
  currentLocationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: moderateScale(12),
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(10),
    elevation: 1,
  },
  currentLocationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocationText: {
    marginLeft: moderateScale(10),
    fontSize: moderateScale(15),
    color: COLORS.primary,
    fontWeight: '500',
  },
});
