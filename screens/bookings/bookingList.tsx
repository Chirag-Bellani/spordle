import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import mainStyles from '../../assets/styles/mainStyles';
import SearchInput from '../../components/searchInput';
import NoDataContainer from '../../components/noDataContainer';
import bookingListStyles from '../../assets/styles/bookingListStyles';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import MainHeader from '../../components/mainHeader';
import {getBookingList} from '../../services/bookingService';
import BookingCardSkeleton from './bookingCardSkeleton';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {COLORS} from '../../constants/color';
import ScreenWrapper from '../../components/screenWrapper';
import {
  AppStackParamList,
  AppStackScreenProps,
} from '../../navigation/navigationTypes';
import {BookingResponse} from '../types/booking';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const bookingCategories = ['Upcoming', 'Completed', 'Cancelled'] as const;

type BookingCategory = (typeof bookingCategories)[number];
type BookingCardProps = {
  item: BookingResponse;
  navigation: NativeStackNavigationProp<AppStackParamList>;
};
const HEADER_HEIGHT = verticalScale(60); // height of the header
const SCROLL_THRESHOLD = verticalScale(60);

const BookingCard: React.FC<BookingCardProps> = ({item, navigation}) => {
  return (
    <TouchableOpacity
      style={[
        bookingListStyles.bookingCardContainer,
        mainStyles.secondaryBackgroundColor,
        mainStyles.dropShadowEffect,
        {elevation: 4},
        mainStyles.widthFull,
        mainStyles.flexContainer,
      ]}
      onPress={() =>
        navigation.navigate('BookingDetail', {bookingDetail: item})
      }
      activeOpacity={0.8}>
      {item?.get_selected_box?.get_selected_box_images?.length > 0 && (
        <Image
          source={{uri: item.get_selected_box.get_selected_box_images[0].image}}
          style={bookingListStyles.courtImage}
        />
      )}
      <View style={bookingListStyles.bookingCardContent}>
        {/* Booking card category header */}
        <View
          style={[
            mainStyles.flexContainer,
            {justifyContent: 'flex-start', gap: scale(10)},
            bookingListStyles.categoryHeaderContainer,
          ]}>
          {/* available sports */}

          {item?.get_selected_box?.get_selected_available_sport?.map(
            (sport, index) => (
              <Image
                key={sport?.id}
                source={{uri: sport?.get_single_sports?.image}}
                style={bookingListStyles.sportsCategoryImage}
              />
            ),
          )}

          {/* <Text
            style={[
              mainStyles.successTextColor,
              mainStyles.fontNunitoSemibold,
              mainStyles.fontSize12,
              item.category === 'Completed' && mainStyles.warningTextColor,
              item.category === 'Cancelled' && mainStyles.errotTextColor,
            ]}
          >
            {item.category === 'Upcoming' ? 'Confirmed' : item.category || 'N/A'}
          </Text> */}
        </View>
        {/* Box title, address and slot count */}
        <View style={bookingListStyles.titleAddressContainer}>
          <View style={bookingListStyles.titleAddressInnerContainer}>
            <Text
              style={[
                mainStyles.darkTextColor,
                mainStyles.fontInriaSansRegular,
                mainStyles.fontSize16,
              ]}
              numberOfLines={1}>
              {item?.get_selected_box?.title}
            </Text>
            <View
              style={[
                mainStyles.flexContainer,
                bookingListStyles.addressContainer,
              ]}>
              <Text
                style={[
                  mainStyles.lightTextColor,
                  mainStyles.fontNunitoSemibold,
                  mainStyles.fontSize12,
                  bookingListStyles.addressText,
                ]}
                numberOfLines={2}>
                {item?.get_selected_box?.address}
              </Text>
              <View
                style={[
                  bookingListStyles.slotCountContainer,
                  mainStyles.successBackgroudColor,
                ]}>
                <Text style={bookingListStyles.slotCountText}>
                  +{item?.slot_count || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Bookings: React.FC<AppStackScreenProps<'BookingDetail'>> = ({
  navigation,
}) => {
  const [search, setSearch] = useState<string>('');
  const isFocused = useIsFocused();
  const [selecedBookingCategory, setSelectedBookingCategory] =
    useState<BookingCategory>('Upcoming');
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<BookingResponse>>(null);
  const skeletonListRef = useRef<FlatList<number>>(null);
  const [bookingData, setBookingData] = useState<BookingResponse[]>([]);
  const [filteredBookingData, setFilteredBookingData] = useState<
    BookingResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(true);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const searchTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT + verticalScale(15)],
    extrapolate: 'clamp',
  });

  // Animate the filter container similarly to search input.
  // For example, it can move up along with the search input.
  const filterTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT + verticalScale(15)],
    extrapolate: 'clamp',
  });

  const handleScrollToTop = () => {
    flatListRef.current &&
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
  };

  // Listen for scrollY changes to show/hide the "Move to Top" button
  useEffect(() => {
    const listenerId = scrollY.addListener(({value}) => {
      if (value > SCROLL_THRESHOLD && !showScrollToTop) {
        setShowScrollToTop(true);
      } else if (value <= SCROLL_THRESHOLD && showScrollToTop) {
        setShowScrollToTop(false);
      }
    });
    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY, showScrollToTop]);

  const renderBookingCard = ({item}: {item: BookingResponse}) => (
    <BookingCard item={item} navigation={navigation} />
  );

  const fetchBookingList = async () => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append('booking_status', selecedBookingCategory);
    try {
      const response = await getBookingList(formData);
      if (response) {
        setBookingData(response);
        setFilteredBookingData(response);
      } else {
        console.error('Error occurred:', response.error);
      }
    } catch (error) {
      console.error('Failed to fetch booking list :', error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingList();
    setSearch('');
  }, [isFocused, selecedBookingCategory]);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredBookingData(bookingData); // Show all data if search input is empty
    } else {
      const filteredData = bookingData?.filter(box =>
        box?.get_selected_box?.title.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredBookingData(filteredData);
    }
  };

  return (
    <ScreenWrapper
      safeTop={true}
      safeBottom={true}
      scrollable={false}
      padding={false}
      withHeader={false}>
      <Animated.View
        style={[
          styles.animatedHeader,

          {transform: [{translateY: headerTranslateY}]},
        ]}>
        <MainHeader
          headerType="booking"
          isFetchingLocation={false}
          location={[]}
        />
      </Animated.View>
      <View style={bookingListStyles.innerContainer}>
        <Animated.View
          style={[
            styles.animatedSearch,
            {transform: [{translateY: searchTranslateY}]},
          ]}>
          <SearchInput
            value={search}
            onChangeText={handleSearchChange}
            onFocus={undefined}
            onBlur={undefined}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.animatedFilter,
            {transform: [{translateY: filterTranslateY}]},
          ]}>
          <View style={bookingListStyles.filterContainer}>
            {bookingCategories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  bookingListStyles.filterButton,
                  mainStyles.disabledBackgroundColor,
                  selecedBookingCategory === cat &&
                    mainStyles.primaryBackgroundColor,
                ]}
                onPress={() => setSelectedBookingCategory(cat)}
                activeOpacity={0.8}>
                <Text
                  style={[
                    mainStyles.lightTextColor,
                    mainStyles.fontInriaSansRegular,
                    mainStyles.fontSize14,
                    selecedBookingCategory === cat &&
                      bookingListStyles.filterTextActive,
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
        {isLoading && bookingData.length === 0 ? (
          // Show Skeleton Loader (initial data fetch)
          <Animated.FlatList<number>
            data={[1, 1, 1, 1, 1]} // Dummy data for skeleton
            ref={skeletonListRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: verticalScale(50),
              paddingBottom: verticalScale(100),
            }}
            renderItem={() => <BookingCardSkeleton />}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {
                useNativeDriver: true,
              },
            )}
            scrollEventThrottle={16}
          />
        ) : isLoading && bookingData.length !== 0 ? (
          // Show Activity Indicator when switching categories and data exists
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          // Show the list only when loading is false & data exists
          <Animated.FlatList
            ref={flatListRef}
            data={filteredBookingData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderBookingCard}
            contentContainerStyle={{
              paddingTop: verticalScale(50),
              paddingHorizontal: verticalScale(5),
              paddingBottom: verticalScale(100),
              flexGrow: 1,
            }}
            ListEmptyComponent={
              <NoDataContainer
                style={bookingListStyles.noDataContainer}
                noDataText={'No bookings yet!!'}
              />
            }
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchBookingList}
              />
            }
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: true},
            )}
            scrollEventThrottle={16}
          />
        )}
      </View>
      {showScrollToTop && (
        <TouchableOpacity
          style={mainStyles.scrollToTopButton}
          activeOpacity={0.8}
          onPress={handleScrollToTop}>
          <Text
            style={[
              mainStyles.darkTextColor,
              mainStyles.fontNunitoBold,
              mainStyles.fontSize12,
            ]}>
            Move to Top
          </Text>
        </TouchableOpacity>
      )}
    </ScreenWrapper>
  );
};

export default Bookings;
const styles = StyleSheet.create({
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 10,
  },
  animatedSearch: {
    top: HEADER_HEIGHT - verticalScale(15),
    left: 0,
    right: 0,
    paddingHorizontal: scale(5),
    zIndex: 12,
  },
  animatedFilter: {
    top: HEADER_HEIGHT - verticalScale(15),
    left: 0,
    right: 0,
    zIndex: 12,
    paddingBottom: verticalScale(6),
  },
  loadingContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '80%',
    left: 0,
    right: 0,
    transform: [{translateY: 300}],
    zIndex: 44, // Ensure it appears above the list
  },
});
