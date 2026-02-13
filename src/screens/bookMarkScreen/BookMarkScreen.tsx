import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import SearchBar from '../../components/SearchBar';
import BoxCard from '../homeScreen/BoxCard';
import { useFocusEffect } from '@react-navigation/native';
import navigationString from '../../constants/navigationString';
import { useAuth } from '../../context/AuthContext';
import PullToRefreshWrapper from '../../components/PullToRefreshWrapper';
import { boxDetails } from '../../services';
import { COLORS } from '../../constants/color';
import NetInfoComponent from '../../components/NetInfoComponent';
import { Box } from '../../types/Box';
import { TabWithStackNavProp } from '../../navigation/navigationTypes';
import CardSkeleton from '../../skeleton/CardSkeleton';

import LottiLoader from '../../components/LottiLoader';
type BookMarkScreenNav = TabWithStackNavProp<'Bookmark'>;

const BookMarkScreen: React.FC<{
  navigation: BookMarkScreenNav;
}> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isBoxBookmarked, bookmarkedBoxIds } = useAuth();

  // Track previous bookmark count to detect additions
  const previousBookmarkCountRef = useRef(bookmarkedBoxIds.size);

  useFocusEffect(
    React.useCallback(() => {
      // Check if bookmarks were added (count increased)
      const bookmarksAdded =
        bookmarkedBoxIds.size > previousBookmarkCountRef.current;

      // Show loader if bookmarks were added, otherwise don't show loader
      fetchBookmarks(bookmarksAdded);

      // Update the previous count
      previousBookmarkCountRef.current = bookmarkedBoxIds.size;
    }, [bookmarkedBoxIds]),
  );

  const fetchBookmarks = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const formData = new FormData();
      formData.append('latitude', String(23.101423));
      formData.append('longitude', String(70.0328314));

      const response = await boxDetails(formData);

      if (response?.success && Array.isArray(response?.data)) {
        const bookmarkedBoxes = response.data.filter((box: Box) =>
          isBoxBookmarked(box.id),
        );

        setBookmarks(bookmarkedBoxes);
      } else {
        setBookmarks([]);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkChange = (boxId: number, isBookmarked: boolean) => {
    if (!isBookmarked) {
      // Immediately remove without loading
      setBookmarks(prev => prev.filter((box: Box) => box.id !== boxId));
    }
  };

  const handleBoxPress = (item: Box) => {
    navigation.navigate(navigationString.BOXDETAILS, { item });
  };

  const onRefresh = async () => {
    await fetchBookmarks(false);
  };

  const filteredBookmarks = bookmarks.filter((box: Box) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const title = box.title?.toLowerCase() || '';
    const address = box.address?.toLowerCase() || '';
    const sports = box.get_selected_available_sport || [];
    const sportNames = sports
      .map(
        s =>
          s.get_single_sports?.name?.toLowerCase() ||
          s.name?.toLowerCase() ||
          '',
      )
      .join(' ');

    return (
      title.includes(query) ||
      address.includes(query) ||
      sportNames.includes(query)
    );
  });

  const data = [1, 2, 3, 4];
  const renderSkeleton = () => {
    return <CardSkeleton />;
  };

  const renderBookmarkCard = ({ item }: { item: Box }) => {
    const images = item.get_selected_box_images?.map(img => img.image) || [];
    const rating = parseFloat(item.avg_rating) || 0;
    const distance = parseFloat(String(item?.distance ?? '0')).toFixed(2);
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
          bookable={item?.is_bookable}
          isBookmarked={isBookmarked}
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
    <View style={styles.container}>
      <NetInfoComponent onReconnect={() => fetchBookmarks(false)} />
      <SearchBar
        placeholder="Search bookmarks..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <LottiLoader />
      ) : filteredBookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📌</Text>
          <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No bookmarks match your search'
              : 'Start bookmarking your favorite boxes!'}
          </Text>
        </View>
      ) : (
        <PullToRefreshWrapper
          type="list"
          data={filteredBookmarks}
          renderItem={renderBookmarkCard}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default BookMarkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: moderateScale(15),
  },
  loader: {
    marginTop: verticalScale(50),
  },
  listContent: {
    paddingHorizontal: moderateScale(4),
    paddingBottom: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(40),
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: verticalScale(16),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  emptyText: {
    fontSize: moderateScale(14),
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
