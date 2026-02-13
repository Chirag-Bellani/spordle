import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import SearchBar from '../../components/SearchBar';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import moment from 'moment';
import PullToRefreshWrapper from '../../components/PullToRefreshWrapper';
import imagePath from '../../constants/imagePath';
import { bookingList } from '../../services';
import { COLORS } from '../../constants/color';
import NetInfoComponent from '../../components/NetInfoComponent';
import { BottomTabScreenProps, TabWithStackNavProp } from '../../navigation/navigationTypes';
import navigationString from '../../constants/navigationString';
import { BookingDetail, BookingResponse, CourtDetail } from '../../types/booking';
import LottiLoader from "../../components/LottiLoader"
type BookingScreenNav = TabWithStackNavProp<'Booking'>;


const BookingScreen: React.FC<{ navigation: BookingScreenNav , route: BottomTabScreenProps<'Booking'>['route']}> = ({
  navigation,
  route,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeButton, setActiveButton] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate(navigationString.HOMESCREEN);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, []);

  const handlePress = (buttonName: string) => {
    setActiveButton(buttonName);
    fetchBookings(buttonName, { showLoader: true });
  };

  useEffect(() => {
    fetchBookings('upcoming', { showLoader: true });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
     
      fetchBookings(activeButton, { showLoader: false });
    });
    return unsubscribe;
  }, [navigation, activeButton]);

  useEffect(() => {
    if (route?.params?.refresh) {
      fetchBookings('upcoming', { showLoader: false });
      setActiveButton('upcoming');
      navigation.setParams({ refresh: false });
    }
  }, [route?.params?.refresh]);

  // Updated fetch function to support no-loader refresh
  const fetchBookings = async (
    status = 'upcoming',
    options = { showLoader: true },
  ) => {
    const { showLoader } = options;

    if (showLoader) setLoading(true);

    try {
      const formData = new FormData();
      formData.append('booking_status', status);

      const response = await bookingList(formData);

      if (response?.success && Array.isArray(response?.data)) {
        const uniqueBookings = response.data.filter(
          (booking: BookingDetail, index: number, self: BookingDetail[]) =>
            index === self.findIndex(b => b.id === booking.id),
        );
        setBookings(uniqueBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const getSlotTimeInfo = (
    bookedSlotId: number,
    courtDetails: CourtDetail[],
  ) => {
    const courtSlot = courtDetails.find(cd => cd.slot_id === bookedSlotId);
    if (!courtSlot) return null;
    return {
      courtDetailId: courtSlot.id,
      slotId: courtSlot.slot_id,
      rate: courtSlot.rate ?? '0',
    };
  };

  const getBookingStatus = (booking: BookingResponse) => {
    if (booking.deleted_at !== null || booking.booking_status === 'cancelled') {
      return 'cancelled';
    }

    const now = moment();
    const bookingDetails = booking.get_bookings_details || [];
    if (bookingDetails.length === 0) {
      const bookingDate = moment(booking.booking_date, 'YYYY-MM-DD');
      return bookingDate.isSameOrAfter(now, 'day') ? 'upcoming' : 'completed';
    }

    let hasUpcoming = false;
    let hasCompleted = false;

    for (const detail of bookingDetails) {
      const bookingDate = detail.booking_date;
      const bookedSlots = detail.get_selected_booking_slot_details || [];
      const courtDetails =
        detail.get_selected_box_court?.get_box_court_detail || [];
      if (!bookingDate) continue;
      const detailMoment = moment(bookingDate, 'YYYY-MM-DD');

      if (bookedSlots.length === 0) {
        if (detailMoment.isAfter(now, 'day')) hasUpcoming = true;
        else if (detailMoment.isBefore(now, 'day')) hasCompleted = true;
        else hasUpcoming = true;
        continue;
      }

      for (const bookedSlot of bookedSlots) {
        const slotInfo = getSlotTimeInfo(bookedSlot.slot_id, courtDetails);
        const selectedSlot = bookedSlot.get_selected_slot;

        if (selectedSlot && selectedSlot.end_time) {
          const slotEndDateTime = moment(
            `${bookingDate} ${selectedSlot.end_time}`,
            'YYYY-MM-DD HH:mm:ss',
          );
          if (slotEndDateTime.isAfter(now)) hasUpcoming = true;
          else hasCompleted = true;
        } else {
          if (detailMoment.isAfter(now, 'day')) hasUpcoming = true;
          else if (detailMoment.isBefore(now, 'day')) hasCompleted = true;
          else hasUpcoming = true;
        }
      }
    }

    if (hasUpcoming) return 'upcoming';
    return 'completed';
  };

  const filteredBookings = bookings.filter((item: BookingResponse) => {
    const bookingStatus = getBookingStatus(item);
    if (bookingStatus !== activeButton) return false;

    if (searchQuery) {
      const title = item.get_selected_box?.title?.toLowerCase() || '';
      return title.includes(searchQuery.toLowerCase());
    }

    return true;
  });

  const renderBookingCard = ({ item }: { item: BookingResponse }) => {
    const box = item.get_selected_box;
    const imageUrl = box?.get_selected_box_images?.[0]?.image;
    const sports = box?.get_selected_available_sport || [];
    const slotCount = item.slot_count || 0;
    const bookingStatus = getBookingStatus(item);

    let badgeColor = '#00B368';
    if (bookingStatus === 'completed') badgeColor = '#808080';
    else if (bookingStatus === 'cancelled') badgeColor = '#FF0000';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(navigationString.BOOKINGDETAILSCREEN, { booking: item })
        }
      >
        <Image
          source={{ uri: imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />

        <View style={styles.cardContent}>
          <View style={styles.sportIconsContainer}>
            {sports.slice(0, 2).map((sport:Sport, index:number) => {
              const sportIconUrl = sport?.get_single_sports?.image;
              return sportIconUrl ? (
                <Image
                  key={index}
                  source={{ uri: sportIconUrl }}
                  style={styles.sportIcon}
                />
              ) : null;
            })}
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {box?.title || 'N/A'}
          </Text>

          <Text style={styles.address} numberOfLines={2}>
            {box?.address || 'N/A'}
          </Text>
        </View>

        <View style={[styles.badgeContainer, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>+{slotCount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <NetInfoComponent
        onReconnect={() => fetchBookings(activeButton, { showLoader: true })}
      />
      <SearchBar
        placeholder="Search bookings..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.buttonContainer}>
        {['upcoming', 'completed', 'cancelled'].map(name => (
          <TouchableOpacity
            key={name}
            style={[
              styles.button,
              activeButton === name
                ? styles.activeButton
                : styles.inactiveButton,
            ]}
            onPress={() => handlePress(name)}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === name
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        // <ActivityIndicator
        //   size="large"
        //   color={COLORS.primary}
        //   style={{ marginTop: verticalScale(30) }}
        // />
        <LottiLoader/>
      ) : filteredBookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? (
              'No matching bookings found'
            ) : (
              <Image
                source={imagePath.noData1}
                style={styles.profileImage}
                resizeMode="cover"
              />
            )}
          </Text>
        </View>
      ) : (
        <PullToRefreshWrapper
          type="list"
          data={filteredBookings}
          renderItem={renderBookingCard}
          keyExtractor={item => item.id.toString()}
          onRefresh={() => fetchBookings(activeButton, { showLoader: false })}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: moderateScale(15),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(15),
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    marginHorizontal: moderateScale(4),
    borderRadius: moderateScale(50),
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  inactiveButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    fontSize: moderateScale(14),
  },
  activeButtonText: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  inactiveButtonText: {
    color: COLORS.primary,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: moderateScale(4),
    backgroundColor: COLORS.secondary,
    width: '98%',
    height: moderateScale(100),
    borderRadius: moderateScale(10),
    padding: moderateScale(18),
    marginTop: verticalScale(12),
    shadowColor: COLORS.darkText,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(8),
  },
  cardContent: {
    flex: 1,
    marginLeft: moderateScale(10),
  },
  sportIconsContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(4),
  },
  sportIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    marginRight: moderateScale(6),
    borderRadius: moderateScale(2),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: verticalScale(2),
  },
  address: {
    fontSize: moderateScale(12),
    color: COLORS.lightText,
    marginTop: verticalScale(3),
  },
  badgeContainer: {
    borderRadius: 50,
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(6),
    minWidth: moderateScale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(50),
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: COLORS.lightText,
  },
  profileImage: {
    width: moderateScale(140),
    height: moderateScale(140),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
