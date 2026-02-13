import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import BoxCard from './BoxCard';
import navigationString from '../../constants/navigationString';
import { useAuth } from '../../context/AuthContext';
import { boxDetails } from '../../services';
import { Box } from '../../types/Box';
import { AppStackScreenProps } from '../../navigation/navigationTypes';

import LottieView from 'lottie-react-native';
import { COLORS } from '../../constants/color';

type BoxListProps = {
  selectedSport?: number | null;
  searchQuery?: string;
  navigation: AppStackScreenProps<'BoxDetails'>['navigation'];
  boxDetailLoader: boolean;
  setBoxDetailLoader: React.Dispatch<React.SetStateAction<boolean>>;

  SportLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const BoxList = forwardRef(
  (
    {
      selectedSport,
      searchQuery,
      navigation,
      boxDetailLoader,
      setBoxDetailLoader,
      SportLoading,
      setLoading,
    }: BoxListProps,
    ref,
  ) => {
    const { initializeBookmarks, isBoxBookmarked } = useAuth();
    const [boxes, setBoxes] = useState<Box[]>([]);

    console.log(selectedSport, 'adshgedhv');
    useEffect(() => {
      if (selectedSport !== null) {
        setBoxDetailLoader(true);
      }
      fetchBoxes(true);
    }, [selectedSport]);

    const fetchBoxes = async (showLoader = true) => {
      if (showLoader)
        try {
          const formData = new FormData();
          formData.append('latitude', String(23.101423));
          formData.append('longitude', String(70.0328314));

          if (selectedSport) {
            formData.append('sport_id', String(selectedSport));
          }

          const response = await boxDetails(formData);
          console.log(response, 'sportsss');
          if (response?.success && Array.isArray(response?.data)) {
            setBoxes(response.data);
            initializeBookmarks(response.data);
          } else {
            setBoxes([]);
          }
        } catch (error) {
          console.error(' Error fetching boxes:', error);
          setBoxes([]);
        } finally {
          setBoxDetailLoader(false);
          setLoading(false);
        }
    };
    useImperativeHandle(ref, () => ({
      handleRefresh: async () => {
        await fetchBoxes();
      },
    }));

    // Update local box state when bookmark changes
    const handleBookmarkChange = (boxId: number, isBookmarked: boolean) => {
      setBoxes(prevBoxes =>
        prevBoxes.map(box =>
          box.id === boxId
            ? { ...box, is_bookmark: isBookmarked ? 1 : 0 }
            : box,
        ),
      );
    };

    const handleBoxPress = (item: Box) => {
      navigation.navigate(navigationString.BOXDETAILS, {
        item,
        onBookmarkChange: handleBookmarkChange, // 🔥 ADD THIS
      });
    };

    // Search & filter logic
    const filteredBoxes = boxes.filter(box => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      const title = box.title?.toLowerCase() || '';
      const address = box.address?.toLowerCase() || '';
      const sports = box.get_selected_available_sport || [];
      const sportNames = sports
        .map(s => (s.name || '').toLowerCase())
        .join(' ');

      return (
        title.includes(query) ||
        address.includes(query) ||
        sportNames.includes(query)
      );
    });

    const renderBoxCard = ({ item }: { item: Box }) => {
      const images = item.get_selected_box_images?.map(img => img.image) || [];
      const rating = parseFloat(item.avg_rating) || 0;
      const distance = parseFloat(item.distance || '0').toFixed(2);
      const price = item.price_start_from
        ? `INR ${parseFloat(item.price_start_from).toFixed(2)} Onwards`
        : 'Price on request';

      const isBookmarked = isBoxBookmarked(item.id);

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
            isBookmarked={isBookmarked}
            onBookmarkChange={handleBookmarkChange}
            // availableSport={item.get_selected_available_sport}
            sports={
              Array.isArray(item.get_selected_available_sport)
                ? item.get_selected_available_sport.map(sport => sport)
                : []
            }
          />
        </TouchableOpacity>
      );
    };

    if (boxDetailLoader) {
      return (
        <View style={{ marginTop: moderateScale(56) }}>
          <LottieView
            source={require('../../assets/animation/boxloader.json')}
            autoPlay
            loop
            style={{ width: moderateScale(150), height: moderateScale(150) }}
          />
        </View>
      );
    }

    // Show empty state
    if (filteredBoxes.length === 0 && !SportLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No boxes match your search'
              : selectedSport
              ? 'No boxes available for this sport'
              : 'No boxes available'}
          </Text>
        </View>
      );
    }

    return (
      <>
        {/* {filteredBoxes.map(item => (
          <View key={item.id?.toString() || Math.random().toString()}>
            {renderBoxCard({ item })}

          </View> */}

        {/* ))} */}
        <FlatList
          data={filteredBoxes}
          renderItem={renderBoxCard}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          ListFooterComponent={
            <Text
              style={{
                marginTop: moderateScale(40),
                color: COLORS.lightBorder,
                fontSize: moderateScale(35),
                fontWeight: '900',
                fontStyle: 'italic',
              }}
            >
              Box Booking
            </Text>
          }
        />
      </>
    );
  },
);

export default BoxList;

const styles = StyleSheet.create({
  loader: {
    marginTop: verticalScale(50),
  },
  emptyContainer: {
    paddingVertical: verticalScale(40),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: moderateScale(14),
    color: '#888',
    textAlign: 'center',
  },
});
