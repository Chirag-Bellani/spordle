import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import HeaderComp from '../../components/HeaderComp';
import { moderateScale, scale } from 'react-native-size-matters';
import { COLORS } from '../../constants/color';
import { useEffect, useState } from 'react';
import BoxCard from './BoxCard';
import { useAuth } from '../../context/AuthContext';
import { boxDetails } from '../../services';
import navigationString from '../../constants/navigationString';
import SearchBar from '../../components/SearchBar';
import {
  AppStackRouteProp,
  AppStackScreenProps,
} from '../../navigation/navigationTypes';
import imagePath from '../../constants/imagePath';
import { FONTS } from '../../constants/font';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GoBack from '../../components/GoBack';
import { Box } from '../../types/Box';
import CardSkeleton from '../../skeleton/CardSkeleton';
/* -------------------- TYPES -------------------- */

type Sport = {
  id: number;
  name: string;
  image: string;
};

type BoxResponse = {
  data: Box[];
};

type SportFilterScreenProps = {
  route: AppStackRouteProp<'SportFilterScreen'>;
  navigation: AppStackScreenProps<'SportFilterScreen'>['navigation'];
};

/* -------------------- COMPONENT -------------------- */

const SportFilterScreen = ({ route, navigation }: SportFilterScreenProps) => {
  const { sport } = route.params;
  const insets = useSafeAreaInsets();

  const [isSelected, setIsSelected] = useState<number | null>(null);
  const [boxData, setBoxData] = useState<BoxResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { isLocation, isBoxBookmarked } = useAuth();
  const lat = isLocation?.latitude;
  const long = isLocation?.longitude;

  const getBoxDetails = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('latitude', String(lat));
      formData.append('longitude', String(long));

      if (isSelected) {
        formData.append('sport_id', String(isSelected));
      }

      const result: BoxResponse = await boxDetails(formData);
      setBoxData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBoxDetails();
  }, [isSelected]);

  /* ❌ NO API CALL ON PULL */
  const onRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setBoxData(prev =>
        prev
          ? {
              ...prev,
              data: [...prev.data], // ✅ new reference → re-render
            }
          : prev,
      );
      setIsRefreshing(false);
    }, 500);
  };

  const renderItem = ({ item }: { item: Sport }) => {
    const isActive = isSelected === item.id;

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          setIsSelected(prev => (prev === item.id ? null : item.id))
        }
      >
        <View
          style={[
            styles.iconContainer,
            isActive && styles.iconContainerSelected,
          ]}
        >
          <Image source={{ uri: item.image }} style={styles.icon} />
        </View>
        <Text style={[styles.name, isActive && styles.nameSelected]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleBookmarkChange = (boxId: number, isBookmarked: boolean) => {
    setBoxData(prev =>
      prev
        ? {
            ...prev,
            data: prev.data.map(box =>
              box.id === boxId
                ? { ...box, is_bookmark: isBookmarked ? 1 : 0 }
                : box,
            ),
          }
        : prev,
    );
  };

  const handleBoxPress = (item: Box) => {
    navigation.navigate(navigationString.BOXDETAILS, {
      item,
      onBookmarkChange: handleBookmarkChange,
    });
  };

  const data = [1, 2, 3];

  const renderSkeleton = () => {
    return <CardSkeleton />;
  };

  const boxes: Box[] = boxData?.data || [];

  const filteredBoxes = boxes.filter(box => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      box.title?.toLowerCase().includes(query) ||
      box.address?.toLowerCase().includes(query) ||
      box.get_selected_available_sport
        ?.map(s => s.get_single_sports?.name?.toLowerCase())
        .join(' ')
        .includes(query)
    );
  });

  const renderBoxCard = ({ item }: { item: Box }) => {
    const images = item.get_selected_box_images?.map(img => img.image) || [];
    const rating = parseFloat(item.avg_rating || '0') || 0;
    const distance = item.distance ? item.distance.toString() : '0.00';
    const price = item.price_start_from
      ? `INR ${parseFloat(item.price_start_from).toFixed(2)} Onwards`
      : 'Price on request';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleBoxPress(item)}
      >
        <BoxCard
          boxId={item.id}
          images={images}
          title={item.title || 'Untitled'}
          location={`${item.address || 'Unknown Address'} (${distance} Kms)`}
          rating={rating}
          discount="Upto 30% Off"
          price={price}
          bookable={item.is_bookable}
          isBookmarked={isBoxBookmarked(item.id)}
          onBookmarkChange={handleBookmarkChange}
          sports={
            Array.isArray(item.get_selected_available_sport)
              ? item.get_selected_available_sport.map(sport => sport)
              : []
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.Maincontainer, { marginBottom: insets.bottom }]}>
      <HeaderComp headerText="Select Sport" />
      <GoBack />

      <View style={styles.container}>
        <SearchBar
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View>
          <Text style={styles.sportText}>Available Sports</Text>

          <FlatList
            data={sport}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flex: 1,
            paddingBottom: insets.bottom + moderateScale(300),
            paddingHorizontal: moderateScale(7),
            backgroundColor: COLORS.secondary,
          }}
        >
          {isLoading && !isRefreshing ? (
            // <View
            //   style={{
            //     flex: 1,
            //     marginTop: moderateVerticalScale(250),
            //     justifyContent: 'center',
            //     alignItems: 'center',
            //   }}
            // >
            //   <ActivityIndicator size={40} color={COLORS.primary} />
            // </View>
            <FlatList data={data} renderItem={renderSkeleton} />
          ) : filteredBoxes.length > 0 ? (
            filteredBoxes.map(item => (
              <View key={item.id.toString()}>{renderBoxCard({ item })}</View>
            ))
          ) : (
            <View
              style={{
                flex: 1,
                marginTop: moderateScale(100),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                style={{
                  width: moderateScale(130),
                  height: moderateScale(130),
                }}
                source={imagePath.noData1}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default SportFilterScreen;

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  container: {
    margin: moderateScale(10),
  },
  sportText: {
    margin: moderateScale(12),
    fontSize: scale(14),
    fontWeight: 'bold',
    fontFamily: FONTS.nunitoBold,
  },
  item: {
    gap: moderateScale(9),
    width: Dimensions.get('window').width / 4.8,
    alignItems: 'center',
    marginVertical: moderateScale(8),
    marginLeft: moderateScale(5),
    marginBottom: moderateScale(12),
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: scale(12),
    backgroundColor: COLORS.itemBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(6),
    borderWidth: moderateScale(2),
    borderColor: 'transparent',
  },
  iconContainerSelected: {
    borderColor: COLORS.primary,
  },
  icon: {
    width: moderateScale(25),
    height: moderateScale(25),
    resizeMode: 'contain',
  },
  name: {
    fontSize: moderateScale(12),
    fontWeight: '400',
    color: COLORS.darkText,
  },
  nameSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
