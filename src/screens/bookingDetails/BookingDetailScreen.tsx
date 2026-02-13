import React, { useRef, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import Swiper from 'react-native-swiper';
import StatusComp from '../../components/StatusComp';
 
import { moderateScale, verticalScale } from 'react-native-size-matters';
import imagePath from '../../constants/imagePath';
import moment from 'moment';
import GoBack from '../../components/GoBack';
import { COLORS } from '../../constants/color';
import NetInfoComponent from '../../components/NetInfoComponent';
import { AppStackScreenProps } from '../../navigation/navigationTypes';
import { CalendarIcon, ChevronLeft, Star, TimerIcon } from 'lucide-react-native';
import { ProcessedSlot } from '../../types/booking';
const { width } = Dimensions.get('window');

const BookingDetailScreen: React.FC<
  AppStackScreenProps<'BookingDetailScreen'>
> = ({ route, navigation }) => {
  const { booking } = route.params || {};
  const scrollY = useRef(new Animated.Value(0)).current;

  const box = booking?.get_selected_box;
  const bookingDetails = booking?.get_bookings_details || [];
  const images = box?.get_selected_box_images?.map(img => img.image) || [];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [-50, 0],
    extrapolate: 'clamp',
  });

  const handleShowMap = () => {
    if (box?.latitude && box?.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${box.latitude},${box.longitude}`;
      Linking.openURL(url).catch(err =>
        console.error('Failed to open maps:', err),
      );
    } else {
      Alert.alert('Location not available', 'Latitude/Longitude missing.');
    }
  };

  // Process booking data grouped by date
  const bookingsByDate = useMemo(() => {
    const grouped: {
      [key: string]: {
        date: string;
        courts: string[];
        slots: ProcessedSlot[];
        totalAmount: number;
      };
    } = {};

    

    bookingDetails.forEach((detail, index) => {
      const date = detail.booking_date;
      const courtName = detail.get_selected_box_court?.name || 'Unknown Court';
      const bookedSlots = detail.get_selected_booking_slot_details || [];
      const courtDetails =
        detail.get_selected_box_court?.get_box_court_detail || [];

     

      if (!grouped[date]) {
        grouped[date] = {
          date: date,
          courts: [],
          slots: [],
          totalAmount: 0,
        };
      }

      // Add court name if not already added
      if (!grouped[date].courts.includes(courtName)) {
        grouped[date].courts.push(courtName);
      }

      // Process slots
      bookedSlots.forEach((bookedSlot, slotIndex) => {
        const slotId = bookedSlot.slot_id;
        const slotInfo = bookedSlot.get_selected_slot || {};

       

        // Find matching court detail for rate
        const courtSlot = courtDetails.find(cd => cd.slot_id === slotId);
        const rate = courtSlot ? parseFloat(courtSlot.rate ) : 0;

        

        // Extract time information
        let slotName = slotInfo.name || `Slot ${slotId}`;
        let timeRange = 'Time not available';
        let startTime = null;
        let endTime = null;

        if (slotInfo.start_time && slotInfo.end_time) {
          try {
            startTime = slotInfo.start_time;
            endTime = slotInfo.end_time;
            const formattedStart = moment(startTime, 'HH:mm:ss').format(
              'hh:mm A',
            );
            const formattedEnd = moment(endTime, 'HH:mm:ss').format('hh:mm A');
            timeRange = `${formattedStart} - ${formattedEnd}`;
            
          } catch (error) {
            console.log(`Error formatting time:`, error);
          }
        } else {
          console.log(`No time information available`);
        }

        grouped[date].slots.push({
          id: slotId || Math.random(),
          name: slotName,
          timeRange: timeRange,
          rate: rate,
          startTime: startTime,
          endTime: endTime,
        });

        grouped[date].totalAmount += rate;
      });
    });

    // Sort slots within each date
    Object.keys(grouped).forEach(date => {
      grouped[date].slots.sort((a, b) => {
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        return Number(a.id || 0) - Number(b.id || 0);
      });
    });
    return grouped;
  }, [bookingDetails]);

  const totalAmount = useMemo(() => {
    const total = Object.values(bookingsByDate).reduce(
      (sum, dateData) => sum + dateData.totalAmount,
      0,
    );
    return booking?.total_amount || total.toFixed(2);
  }, [bookingsByDate, booking]);

  const sortedDates = useMemo(() => {
    return Object.keys(bookingsByDate).sort();
  }, [bookingsByDate]);

  if (!booking || !box) {
    return (
      <>
        <StatusComp />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No booking details available.</Text>
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <NetInfoComponent />

      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <StatusComp />
      <GoBack />

      <Animated.View
        style={[
          styles.animatedHeader,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={22} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {box.title || 'Venue'}
        </Text>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {/* Image Swiper */}
        <View style={styles.imageContainer}>
          <Swiper autoplay autoplayTimeout={3} showsPagination>
            {images.length > 0 ? (
              images.map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: img }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))
            ) : (
              <Image
                source={{
                  uri: 'https://via.placeholder.com/600x400.png?text=No+Image',
                }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
          </Swiper>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color={COLORS.darkText} />
          </TouchableOpacity>
        </View>

        {/* Title + Rating + Location */}
        <View style={styles.detailBox}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{box.title || 'Untitled'}</Text>
            <View style={styles.ratingBox}>
              <Star size={16} color={COLORS.warning} />
              <Text style={styles.ratingText}>
                {parseFloat(box.avg_rating ).toFixed(2)}
              </Text>
            </View>
          </View>

          <Text style={styles.location}>
            {box.address || 'Unknown Address'}
          </Text>
        </View>

        {/* Show In Map Button */}
        <View style={styles.mapButtonContainer}>
          <TouchableOpacity style={styles.mapButton} onPress={handleShowMap}>
            <Image source={imagePath.googleMapsPin} style={styles.mapIcon} />
            <Text style={styles.mapButtonText}>Show in Map</Text>
          </TouchableOpacity>
        </View>

        {/* Booking Details Card */}
        <View style={styles.bookingCard}>
          <Text style={styles.cardTitle}>Booking Details:</Text>

          {sortedDates.length > 0 ? (
            sortedDates.map((date, index) => {
              const dateData = bookingsByDate[date];

              return (
                <View key={`date-${date}`} style={styles.dateSection}>
                  {/* Date Header */}
                  <View style={styles.dateSectionHeader}>
                    <CalendarIcon
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={styles.dateSectionTitle}>
                      {moment(date).format('DD MMM YYYY')}
                    </Text>
                  </View>

                  {/* Court */}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Court:</Text>
                    <Text style={styles.infoValue}>
                      {dateData.courts.join(', ')}
                    </Text>
                  </View>

                  {/* Time Slots */}
                  <View style={styles.slotsSection}>
                    <Text style={styles.infoLabel}>Time Slot:</Text>

                    {dateData.slots.length > 0 ? (
                      <View style={styles.slotsContainer}>
                        {dateData.slots.map((slot: ProcessedSlot, slotIdx: number) => (
                          <View
                            key={`slot-${date}-${slot.id}-${slotIdx}`}
                            style={styles.slotItem}
                          >
                            <View style={styles.slotInfoRow}>
                              <TimerIcon
                                size={16}
                                color="#666"
                              />
                              <View style={styles.slotTextContainer}>
                                {slot.name &&
                                  slot.name !== `Slot ${slot.id}` && (
                                    <Text style={styles.slotName}>
                                      {slot.name}
                                    </Text>
                                  )}
                                <Text style={styles.slotTime}>
                                  {slot.timeRange}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.slotRate}>
                              ₹{slot.rate.toFixed(2)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.noSlotsText}>-</Text>
                    )}
                  </View>

                  {/* Divider between dates */}
                  {index < sortedDates.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              );
            })
          ) : (
            <Text style={styles.noDataText}>No booking details available</Text>
          )}

          {/* Total Amount */}
          <View style={styles.totalAmountCard}>
            <Text style={styles.totalAmountText}>
              Total Amount: ₹{totalAmount}
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default BookingDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  imageContainer: {
    width: '100%',
    height: verticalScale(220),
    position: 'relative',
  },
  image: {
    width,
    height: '100%',
  },
  backBtn: {
    position: 'absolute',
    top: moderateScale(50),
    left: moderateScale(15),
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.darkText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: moderateScale(90),
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: moderateScale(16),
    paddingHorizontal: moderateScale(15),
    zIndex: 1000,
    elevation: 8,
  },
  headerBackBtn: {
    width: moderateScale(35),
    height: moderateScale(35),
    borderRadius: moderateScale(18),
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  headerTitle: {
    flex: 1,
    color: COLORS.secondary,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  detailBox: {
    paddingHorizontal: moderateScale(15),
    paddingTop: moderateScale(15),
    paddingBottom: moderateScale(10),
    backgroundColor: COLORS.secondary,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(8),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: COLORS.darkText,
    flex: 1,
    paddingRight: moderateScale(10),
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
  },
  ratingText: {
    color: COLORS.darkText,
    marginLeft: moderateScale(4),
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  location: {
    color: '#666',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },
  mapButtonContainer: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(15),
    backgroundColor: COLORS.secondary,
  },
  mapButton: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(14),
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    resizeMode: 'contain',
    marginRight: moderateScale(8),
  },
  mapButtonText: {
    fontSize: moderateScale(16),
    color: COLORS.darkText,
    fontWeight: '500',
  },
  bookingCard: {
    marginHorizontal: moderateScale(15),
    marginTop: verticalScale(15),
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    elevation: 2,
    shadowColor: COLORS.darkText,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: verticalScale(20),
  },
  dateSection: {
    marginBottom: verticalScale(20),
  },
  dateSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(12),
  },
  dateSectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: moderateScale(8),
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: verticalScale(12),
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: moderateScale(15),
    color: COLORS.darkText,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: moderateScale(15),
    color: '#666',
    marginLeft: moderateScale(8),
    flex: 1,
  },
  slotsSection: {
    marginBottom: verticalScale(8),
  },
  slotsContainer: {
    marginTop: verticalScale(8),
  },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(8),
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  slotInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slotTextContainer: {
    marginLeft: moderateScale(8),
    flex: 1,
  },
  slotName: {
    fontSize: moderateScale(13),
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  slotTime: {
    fontSize: moderateScale(14),
    color: '#333',
    fontWeight: '500',
  },
  slotRate: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#00875A',
    marginLeft: moderateScale(8),
  },
  noSlotsText: {
    fontSize: moderateScale(15),
    color: '#999',
    marginTop: verticalScale(8),
    marginLeft: moderateScale(4),
  },
  noDataText: {
    fontSize: moderateScale(15),
    color: '#999',
    textAlign: 'center',
    marginVertical: verticalScale(20),
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: verticalScale(15),
  },
  totalAmountCard: {
    backgroundColor: '#B8F4D4',
    borderRadius: moderateScale(10),
    padding: moderateScale(18),
    marginTop: verticalScale(10),
    alignItems: 'center',
  },
  totalAmountText: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: '#00875A',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: '#888',
  },
});
