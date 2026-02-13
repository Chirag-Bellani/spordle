import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import HeaderComp from '../../components/HeaderComp';
import ButtonComp from '../../components/ButtonComp';
import CheckBox from '@react-native-community/checkbox';
import CancelPolicyComp from '../../components/CancelPolicyComp';
import { icon } from '../../constants/icon';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import navigationString from '../../constants/navigationString';
import moment from 'moment';
import GoBack from '../../components/GoBack';
import { addBooking } from '../../services';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/color';
import NetInfoComponent from '../../components/NetInfoComponent';
import {
  AppStackScreenProps,
  TabWithStackNavProp,
} from '../../navigation/navigationTypes';
import { Box } from '../../types/Box';
import { NormalizedSlot } from '../../types/court';
import { courtItem } from '../../types/court';
import ToastUtil from '../../utils/toastUtil';

// Define the payment button type
type PaymentButtonType = 'left' | 'right';

// Define the slots by date structure
interface SlotsByDate {
  [date: string]: {
    [courtId: number]: number[];
  };
}

// Define the booking payload structure
interface BookingPayload {
  box_id: number;
  selectedSlots: SlotsByDate;
}

// Define the API response structure
interface BookingApiResponse {
  status?: boolean;
  success?: boolean;
  message?: string;
  data?: any;
}

// Define the API error structure
interface BookingApiError {
  response?: {
    data?: {
      message?: string;
      [key: string]: any;
    };
  };
  message?: string;
}
// type ComfirmationNav = TabWithStackNavProp<'Booking'>;

const ConfirmationBookingScreen: React.FC<
  AppStackScreenProps<'ConfirmationBookingScreen'>
> = ({ route, navigation }) => {
  const [activeButton, setActiveButton] = useState<PaymentButtonType>('left');
  const [agree, setAgree] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const isProcessing = useRef<boolean>(false);

  // Extract route params with proper types
  const box: Box | undefined = route?.params?.box;
  const totalAmount: number = route?.params?.totalAmount || 0;
  const selectedSlots: NormalizedSlot[] = route?.params?.selectedSlots || [];
  const selectedDate: string = route?.params?.selectedDate;
  const selectedCourt: courtItem | undefined = route?.params?.selectedCourt;
  const boxCourtId: number | null = route?.params?.boxCourtId;
  const imageUrl: string | undefined = box?.get_selected_box_images?.[0]?.image;

  const handlePress = (buttonName: PaymentButtonType): void => {
    setActiveButton(buttonName);
  };

  const handlePayment = async (): Promise<void> => {
    if (!agree) {
      Alert.alert(
        'Agreement Required',
        'Please agree to the terms before continuing.',
      );
      return;
    }

    if (selectedSlots.length === 0) {
      Alert.alert('No Slots Selected', 'Please select at least one slot.');
      return;
    }

    if (!box?.id) {
      Alert.alert('Error', 'Box information is missing.');
      return;
    }

    isProcessing.current = true;
    setLoading(true);

    try {
      const slotsByDate: SlotsByDate = {};

      selectedSlots.forEach((slot: NormalizedSlot, index: number) => {
        const slotDate: string = slot.date || selectedDate;

        if (!slotDate) {
          console.warn(
            `Slot ${slot.slot_id} has no date, using selectedDate: ${selectedDate}`,
          );
        }

        // Initialize date entry if it doesn't exist
        if (!slotsByDate[slotDate]) {
          slotsByDate[slotDate] = {};
        }

        // Get court ID for this slot
        const courtId: number = slot.court_id || boxCourtId || 0;

        // Initialize court entry if it doesn't exist
        if (!slotsByDate[slotDate][courtId]) {
          slotsByDate[slotDate][courtId] = [];
        }

        // Add slot ID to the array
        if (slot.slot_id) {
          slotsByDate[slotDate][courtId].push(slot.slot_id);
        }
      });

      const payload = {
        box_id: box?.id,
        selectedSlots: slotsByDate,
      };
 
      const response: BookingApiResponse = await addBooking(payload);

      if (response?.status === true || response?.success) {
        ToastUtil.success(
          'Booking Confirmed! 🎉',
          
        );
        navigation.navigate(navigationString.ADDRATINGANDREVIEW, {
            bookingId: response.data.booking_id,
        
        });
      } else {
        // Reset on failure
        isProcessing.current = false;
        setLoading(false);

        ToastUtil.error(
          response?.message || 'Please try again later.',
        );
      }
    } catch (error) {
      ToastUtil.error(
        'Booking API Error: ' + (error as BookingApiError).message,
      );

      // Reset on error
      isProcessing.current = false;
      setLoading(false);

      const apiError = error as BookingApiError;

      if (apiError.response?.data) {
        const serverMessage: string =
          apiError.response.data.message ||
          JSON.stringify(apiError.response.data, null, 2);
        Alert.alert('Server Error', serverMessage);
      } else {
        Alert.alert(
          'Error',
          apiError.message ||
            'Something went wrong while processing your booking. Please try again.',
        );
      }
    }
  };

  const isValid: boolean = agree && !loading;

  // Show all dates if multiple dates are selected
  const getFormattedDates = (): string => {
    // Get unique dates from selected slots
    const uniqueDates: string[] = [
      ...new Set(
        selectedSlots.map((slot: NormalizedSlot) => slot.date || selectedDate),
      ),
    ].sort();

    if (uniqueDates.length === 0) {
      return selectedDate ? moment(selectedDate).format('DD MMM YYYY') : '';
    }

    if (uniqueDates.length === 1) {
      return moment(uniqueDates[0]).format('DD MMM YYYY');
    }

    // Multiple dates
    return uniqueDates
      .map((date: string) => moment(date).format('DD MMM YYYY'))
      .join(', ');
  };

  // Get slot time range considering multiple dates
  const getSlotTimeRange = (): string => {
    if (selectedSlots.length === 0) return '';

    // Group slots by date
    const slotsByDate: { [date: string]: NormalizedSlot[] } = {};
    selectedSlots.forEach((slot: NormalizedSlot) => {
      const date: string = slot.date || selectedDate;
      if (!slotsByDate[date]) {
        slotsByDate[date] = [];
      }
      slotsByDate[date].push(slot);
    });

    // If multiple dates, show count
    const dateCount: number = Object.keys(slotsByDate).length;
    if (dateCount > 1) {
      return `${selectedSlots.length} slots across ${dateCount} dates`;
    }

    // Single date - show time range
    const sortedSlots: NormalizedSlot[] = [...selectedSlots].sort(
      (a: NormalizedSlot, b: NormalizedSlot) => {
        const aTime: string = a.start_time || '00:00:00';
        const bTime: string = b.start_time || '00:00:00';
        return aTime.localeCompare(bTime);
      },
    );

    const firstSlot: NormalizedSlot = sortedSlots[0];
    const lastSlot: NormalizedSlot = sortedSlots[sortedSlots.length - 1];

    if (!firstSlot.start_time || !lastSlot.end_time) {
      return `${selectedSlots.length} slot(s)`;
    }

    const startTime: string = moment(firstSlot.start_time, 'HH:mm:ss').format(
      'hh:mm A',
    );
    const endTime: string = moment(lastSlot.end_time, 'HH:mm:ss').format(
      'hh:mm A',
    );

    return `${startTime} - ${endTime}`;
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container]}>
      <NetInfoComponent
        onReconnect={() => {
          console.log('Internet reconnected on Confirmation screen');
        }}
      />
      <HeaderComp headerText="Confirmation" />
      <GoBack />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!loading}
      >
        {/* Box Info */}
        <View style={styles.cartContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.boxImage} />
          ) : (
            <View style={styles.noImagePlaceholder}>
              <Text style={styles.noImageText}>No Image</Text>
            </View>
          )}

          <View style={styles.cartDetails}>
            <Text numberOfLines={1} style={styles.boxName}>
              {box?.title || 'Title Here..'}
            </Text>

            <View style={styles.locationRow}>
              <Image source={icon.locationIcon} style={styles.locationIcon} />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.boxPrice}
              >
                {box?.address || 'Location Address Here...'}
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Details Section */}
        <View style={styles.bookingDetailsContainer}>
          <Text style={styles.bookingDetailsTitle}>Booking Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{getFormattedDates()}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Court:</Text>
            <Text style={styles.detailValue}>
              {selectedCourt?.name || 'N/A'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{getSlotTimeRange()}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Slots:</Text>
            <Text style={styles.detailValue}>
              {selectedSlots.length} slot(s)
            </Text>
          </View>
        </View>

        {/* Offer Section */}
        <TouchableOpacity style={styles.offerContainer} disabled={loading}>
          <Text style={styles.offerText}>APPLY OFFERS</Text>
          <Image source={icon.rightArrow} style={styles.rightArrow} />
        </TouchableOpacity>

        {/* Payment Buttons */}
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentText}>Payment</Text>
          <View style={styles.paymentButtons}>
            <TouchableOpacity
              style={[
                styles.button,
                activeButton === 'left'
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() => handlePress('left')}
              disabled={loading}
            >
              <Text
                style={[
                  styles.buttonText,
                  activeButton === 'left'
                    ? styles.activeButtonText
                    : styles.inactiveButtonText,
                ]}
              >
                20%
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                activeButton === 'right'
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={() => handlePress('right')}
              disabled={loading}
            >
              <Text
                style={[
                  styles.buttonText,
                  activeButton === 'right'
                    ? styles.activeButtonText
                    : styles.inactiveButtonText,
                ]}
              >
                100%
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Section */}
        <View style={styles.totalContainer}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>COURT FEE</Text>
            <Text style={styles.feeAmount}>₹ {totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>CONVENIENCE FEE</Text>
            <Text style={styles.feeAmount}>₹ 0.00</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={[styles.feeLabel, styles.totalText]}>TOTAL</Text>
            <Text style={[styles.feeAmount, styles.totalText]}>
              ₹ {totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Terms & Checkbox */}
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={agree}
            onValueChange={setAgree}
            style={styles.checkbox}
            disabled={loading}
          />
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.link}>Terms of Service</Text> &{' '}
            <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
        </View>

        {/* Cancellation Policy */}
        <CancelPolicyComp policyList={box?.get_box_cancellation_policy} />
      </ScrollView>

      {/* Bottom Button */}
      <View
        style={[
          styles.bottomButtonContainer,
          {
            marginBottom:
              insets.bottom > 24 ? insets.bottom : moderateScale(12),
          },
        ]}
      >
        <ButtonComp
          btnText={
            loading
              ? 'Processing...'
              : `PAY ₹ ${totalAmount.toFixed(2)} SECURELY`
          }
          disabled={!isValid}
          onPress={handlePayment}
        />
        {loading && (
          <View style={styles.buttonLoader}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}
      </View>

      {/* Full Screen Loader Overlay */}
      {loading && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Processing your booking...</Text>
            <Text style={styles.loaderSubText}>Please wait</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ConfirmationBookingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  scrollArea: { flex: 1, marginTop: verticalScale(10) },
  scrollContent: { alignItems: 'center', paddingBottom: verticalScale(120) },
  cartContainer: {
    flexDirection: 'row',
    width: '92%',
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: moderateScale(12),
    elevation: 3,
    shadowColor: COLORS.darkText,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: verticalScale(20),
  },
  boxImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(12),
  },
  noImagePlaceholder: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(12),
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: moderateScale(12),
    color: '#999',
  },
  cartDetails: { flex: 1, justifyContent: 'flex-start' },
  boxName: {
    fontSize: moderateScale(18),
    color: COLORS.darkText,
    fontWeight: '600',
    fontFamily: 'Inria Sans',
    marginBottom: verticalScale(8),
  },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationIcon: {
    width: moderateScale(18),
    height: moderateScale(18),
    marginRight: moderateScale(6),
    tintColor: '#777',
  },
  boxPrice: { flex: 1, fontSize: moderateScale(14), color: '#333' },
  bookingDetailsContainer: {
    width: '92%',
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    padding: moderateScale(15),
    marginBottom: verticalScale(20),
  },
  bookingDetailsTitle: {
    fontSize: moderateScale(18),
    color: COLORS.darkText,
    fontWeight: '600',
    fontFamily: 'Inria Sans',
    marginBottom: verticalScale(12),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(6),
  },
  detailLabel: {
    fontSize: moderateScale(14),
    color: '#666',
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: moderateScale(14),
    color: COLORS.darkText,
    fontFamily: 'Inter',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  offerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '92%',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(15),
    height: verticalScale(45),
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    marginBottom: verticalScale(20),
  },
  offerText: { fontSize: moderateScale(16), color: COLORS.primary },
  rightArrow: { width: moderateScale(20), height: moderateScale(20) },
  paymentContainer: {
    width: '92%',
    marginBottom: verticalScale(25),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentText: {
    fontSize: moderateScale(20),
    color: COLORS.darkText,
    fontFamily: 'Inria Sans',
    fontWeight: '400',
  },
  paymentButtons: { flexDirection: 'row', justifyContent: 'flex-start' },
  button: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(5),
    marginRight: moderateScale(10),
  },
  activeButton: { backgroundColor: COLORS.itemBackground },
  inactiveButton: { backgroundColor: '#F2F2F2' },
  buttonText: { fontSize: moderateScale(14) },
  activeButtonText: { color: COLORS.primary, fontWeight: '700' },
  inactiveButtonText: { color: COLORS.primary },
  totalContainer: {
    width: '92%',
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: moderateScale(8),
    padding: moderateScale(15),
    backgroundColor: COLORS.secondary,
    marginBottom: verticalScale(20),
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(4),
  },
  feeLabel: { fontSize: moderateScale(14), color: COLORS.darkText },
  feeAmount: {
    fontSize: moderateScale(14),
    color: COLORS.darkText,
    fontWeight: '600',
  },
  totalText: { fontWeight: '700', color: '#444' },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '92%',
    marginBottom: verticalScale(20),
  },
  checkbox: { marginRight: moderateScale(10) },
  termsText: { flex: 1, fontSize: moderateScale(13), color: '#333' },
  link: { color: COLORS.linkingColor, textDecorationLine: 'underline' },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? verticalScale(25) : verticalScale(15),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  buttonLoader: {
    position: 'absolute',
    right: moderateScale(40),
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loaderCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(15),
    padding: moderateScale(30),
    alignItems: 'center',
    minWidth: moderateScale(200),
    elevation: 10,
    shadowColor: COLORS.darkText,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  loaderText: {
    marginTop: verticalScale(15),
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.darkText,
    textAlign: 'center',
  },
  loaderSubText: {
    marginTop: verticalScale(5),
    fontSize: moderateScale(13),
    color: '#666',
    textAlign: 'center',
  },
});
