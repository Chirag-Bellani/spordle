import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import mainStyles from '../../assets/styles/mainStyles';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import CustomCheckBox from '../../components/checkbox';
import PrimaryButton from '../../components/primaryButton';

import {icons} from '../../constants/Icon';
import {
  getCourtByBoxId,
  getSlotDetailByDate,
} from '../../services/bookingService';
import {formatTimeTo12Hour} from '../../utils/timeCoverterUtil';
import NoDataContainer from '../../components/noDataContainer';
import SlotContainerSkeleton from './slotContainerSkeleton';
import DateSlider from '../../utils/dateSelectorUtil';
import slotBookingStyles from '../../assets/styles/slotBookingStyles';
import ScreenWrapper from '../../components/screenWrapper';
import {AppStackScreenProps} from '../../navigation/navigationTypes';
import {Box} from '../types/box';
import {courtItem} from '../types/court';
import {Slot, SlotCountMap} from '../types/slot';
import {SelectedSlotType} from '../types/slot';

const SlotBooking: React.FC<AppStackScreenProps<'SlotBooking'>> = ({
  navigation,
  route,
}) => {
  const {boxInfo} = route?.params;

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
  );
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [availableCourts, setAvailableCourts] = useState<courtItem[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlotType>({});
  const [slotDetail, setSlotDetail] = useState<Slot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<number[]>([]);
  const [totalBookingAmount, setTotalBookingAmount] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);

  // date slection function
  const handleDateSelection = (date: string) => {
    setSelectedDate(date);
    if (selectedCourt) {
      fetchAvailableAndBookedSlots(date, selectedCourt);
    }
  };
  // court selection function
  const handleCourtSelection = (court: courtItem) => {
    setSelectedCourt(court.id);
    if (selectedDate) {
      fetchAvailableAndBookedSlots(selectedDate, court.id);
    }
  };
  // api call to fetch available and booked slots
  const fetchAvailableAndBookedSlots = async (
    date: string,
    courtId: number | null,
  ) => {
    if (!courtId) return;

    const formData = new FormData();
    formData.append('booking_date', date);
    formData.append('box_court_id', courtId);
    try {
      const response = await getSlotDetailByDate(formData);

      setSlotDetail(response.all_slots);
      setBookedSlots(response.booked_slot);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
    } finally {
      setLoading(false);
    }
  };
  // api call to fetch available courts
  const fetchCourtByBoxId = async (boxData: Box): Promise<void> => {
    const formData = new FormData();
    formData.append('box_id', boxData.id);

    try {
      const response = await getCourtByBoxId(formData);
      if (response) {
        setAvailableCourts(response);
        setSelectedCourt(response[0].id);
        await fetchAvailableAndBookedSlots(selectedDate, response[0].id);
      } else {
        console.error('Error occurred:', response.error);
      }
    } catch (error) {
      console.error('Failed to fetch box data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourtByBoxId(boxInfo);
  }, []);

  const handleSlotSelection = (slotId: number, slotPrice: string) => {
    if (!selectedCourt || !selectedDate) return; // ✅ guard clause for safety
    const numericPrice = parseFloat(slotPrice); // Ensure it's treated as a number
    setSelectedSlot(prevState => {
      const updatedSlots = {...prevState};

      // Initialize date entry if it doesn't exist
      if (!updatedSlots[selectedDate]) {
        updatedSlots[selectedDate] = {};
      }

      // Initialize court entry if it doesn't exist
      if (!updatedSlots[selectedDate][selectedCourt]) {
        updatedSlots[selectedDate][selectedCourt] = [];
      }

      const courtSlots = updatedSlots[selectedDate][selectedCourt];

      // Add or remove slot ID
      if (courtSlots.includes(slotId)) {
        updatedSlots[selectedDate][selectedCourt] = courtSlots.filter(
          id => id !== slotId,
        );

        // **Subtract slot price when removed**
        setTotalBookingAmount(prevAmount =>
          (parseFloat(prevAmount) - numericPrice).toFixed(2),
        );

        // Remove court entry if no slots remain
        if (updatedSlots[selectedDate][selectedCourt].length === 0) {
          delete updatedSlots[selectedDate][selectedCourt];
        }
      } else {
        updatedSlots[selectedDate][selectedCourt].push(slotId);
        // **Add slot price when added**
        setTotalBookingAmount(prevAmount =>
          (parseFloat(prevAmount) + numericPrice).toFixed(2),
        );
      }

      // Remove date entry if no courts remain
      if (Object.keys(updatedSlots[selectedDate]).length === 0) {
        delete updatedSlots[selectedDate];
      }

      return updatedSlots;
    });
  };

  const isSlotSelected = (slotId: number) => {
    if (!selectedCourt || !selectedDate) return false;
    const dateEntry = selectedSlot[selectedDate];

    if (!dateEntry) return false; // No slots for the selected date

    // Check if the court exists and contains the slotId
    return dateEntry[selectedCourt]?.includes(slotId) || false;
  };

  const hasSlotsInCourt = (courtId: number) => {
    const dateEntry = selectedSlot[selectedDate];

    if (!dateEntry) return false; // No slots for the selected date

    return !!dateEntry[courtId] && dateEntry[courtId].length > 0;
  };

  const slotCount: SlotCountMap = useMemo(() => {
    const slotCountMap: SlotCountMap = {};

    Object.keys(selectedSlot).forEach(date => {
      const courts = selectedSlot[date];
      const totalSlots = Object.values(courts).reduce(
        (sum, slots) => sum + slots.length,
        0,
      );

      if (totalSlots > 0) {
        slotCountMap[date] = totalSlots;
      }
    });

    return slotCountMap;
  }, [selectedSlot]);

  return (
    <ScreenWrapper
      safeTop={true}
      safeBottom={true}
      scrollable={false}
      padding={false}
      withHeader={true}>
      <View>
        {/* Date picker  */}
        <View style={slotBookingStyles.datePickerContainer}>
          <Text
            style={[
              mainStyles.fontInriaSansRegular,
              mainStyles.darkTextColor,
              mainStyles.fontSize20,
            ]}>
            Date
          </Text>
          <DateSlider
            onDateSelected={handleDateSelection}
            countLabel={slotCount}
          />
        </View>
        {/* Court slection container */}

        <View style={slotBookingStyles.courtSelectionContainer}>
          <Text
            style={[
              mainStyles.darkTextColor,
              mainStyles.fontInriaSansRegular,
              mainStyles.fontSize20,
            ]}>
            Court
          </Text>

          <View style={slotBookingStyles.rowWithGap}>
            {loading ? (
              // Skeleton Loader for Court Selection
              Array.from({length: 4}).map((_, index) => (
                <View
                  key={index}
                  style={slotBookingStyles.courtSelectionContainerSkeleton}
                />
              ))
            ) : availableCourts.length > 0 ? (
              availableCourts.map(court => (
                <TouchableOpacity
                  key={court.id}
                  onPress={() => handleCourtSelection(court)}
                  style={[
                    mainStyles.secondaryBorderColor,
                    mainStyles.borderWidth1,
                    selectedCourt === court.id &&
                      mainStyles.primaryBackgroundColor,
                    slotBookingStyles.courtSelectionButton,
                  ]}>
                  <View>
                    {hasSlotsInCourt(court.id) && (
                      <View
                        style={[
                          slotBookingStyles.courtHasSlotsIndicator,
                          mainStyles.primaryBackgroundColor,
                          selectedCourt === court.id &&
                            mainStyles.secondaryBackgroundColor,
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        mainStyles.primaryTextColor,
                        mainStyles.fontSize14,
                        mainStyles.fontNunitoMedium,
                        selectedCourt === court.id && {color: '#FFFFFF'},
                      ]}>
                      {court?.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No courts available</Text>
            )}
          </View>
        </View>
        {/* banner container */}
        <View
          style={[
            mainStyles.infoBackgroundColor,
            mainStyles.widthFull,
            slotBookingStyles.bannerContainer,
          ]}>
          <Text
            style={[
              mainStyles.secondaryTextColor,
              mainStyles.fontNunitoSemibold,
              {fontSize: moderateScale(15, 0.8)},
            ]}>
            Be The First! Reserve This Court Before Anyone
          </Text>
        </View>
        {/* booking container */}
        <ScrollView
          style={{maxHeight: verticalScale(300)}}
          contentContainerStyle={{
            paddingBottom: verticalScale(100),
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {loading ? (
            // Skeleton Loader for Court Selection
            Array.from({length: 4}).map((_, index) => (
              <SlotContainerSkeleton key={index} />
            ))
          ) : selectedDate && selectedCourt && slotDetail.length > 0 ? (
            slotDetail.map((slot, index) => (
              <View
                key={index}
                style={slotBookingStyles.slotSelectionContainer}>
                <View style={[mainStyles.flexContainer]}>
                  <View>
                    <Text
                      style={[
                        mainStyles.fontInriaSansRegular,
                        mainStyles.fontSize16,
                        mainStyles.darkTextColor,
                      ]}>
                      {formatTimeTo12Hour(slot?.get_single_slot?.start_time)} -{' '}
                      {formatTimeTo12Hour(slot?.get_single_slot?.end_time)}
                    </Text>
                    <Image
                      source={
                        slot?.get_single_slot?.start_time >= '19:00:00'
                          ? icons.moonIcon
                          : icons.sunIcon
                      }
                      style={slotBookingStyles.dayNightIconContainer}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => handleSlotSelection(slot?.id, slot?.rate)}
                    disabled={bookedSlots.includes(slot?.id)}
                    style={[
                      mainStyles.borderWidth1,
                      slotBookingStyles.slotButton,
                      !bookedSlots.includes(slot.id)
                        ? isSlotSelected(slot.id)
                          ? {
                              backgroundColor: '#FDEBE9',
                              borderColor: '#FF4F0A',
                            } // Selected slot
                          : [
                              mainStyles.secondaryInfoBackgroundColor,
                              mainStyles.infoBorderColor,
                            ] // Available slot
                        : [
                            {backgroundColor: '#D3D3D3'},
                            mainStyles.primaryBorderColor,
                          ], // Booked slot
                    ]}>
                    {slot?.discount ? (
                      <Text
                        style={[
                          mainStyles.infoTextColor,
                          mainStyles.fontInriaSansBold,
                          mainStyles.fontSize16,
                          bookedSlots.includes(slot.id) &&
                            mainStyles.lightTextColor,
                        ]}>
                        {slot.discount}% Discount
                      </Text>
                    ) : null}
                    <Text
                      style={[
                        mainStyles.lightTextColor,
                        mainStyles.fontNunitoRegular,
                        mainStyles.fontSize14,
                      ]}>
                      {!bookedSlots.includes(slot.id)
                        ? ` ₹ ${slot?.rate || '---'}`
                        : ''}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <NoDataContainer
              style={{marginTop: verticalScale(50)}}
              noDataText={'No slots available'}
            />
          )}
        </ScrollView>
      </View>
      {/* Bottom info container */}
      <View
        style={[
          mainStyles.secondaryBackgroundColor,
          mainStyles.dropShadowEffect,
          slotBookingStyles.bottomInfoContainer,
        ]}>
        <View style={slotBookingStyles.rowContainer}>
          <View style={slotBookingStyles.rowWithGap}>
            <CustomCheckBox
              style={slotBookingStyles.bookedCheckBox}
              disabled={true}
            />
            <Text
              style={[
                mainStyles.fontNunitoSemibold,
                mainStyles.fontSize14,
                mainStyles.darkTextColor,
              ]}>
              Booked
            </Text>
          </View>
          <View style={slotBookingStyles.rowWithGap}>
            <CustomCheckBox
              style={[
                mainStyles.borderWidth1,
                mainStyles.secondaryInfoBackgroundColor,
                mainStyles.infoBorderColor,
              ]}
            />
            <Text
              style={[
                mainStyles.fontNunitoSemibold,
                mainStyles.fontSize14,
                mainStyles.darkTextColor,
              ]}>
              Available
            </Text>
          </View>
          <View style={slotBookingStyles.rowWithGap}>
            <CustomCheckBox
              style={[
                mainStyles.borderWidth1,
                slotBookingStyles.selectedCheckBox,
              ]}
              disabled={true}
            />
            <Text
              style={[
                mainStyles.fontNunitoSemibold,
                mainStyles.fontSize14,
                mainStyles.darkTextColor,
              ]}>
              Selected
            </Text>
          </View>
        </View>

        <View
          style={[mainStyles.flexContainer, {marginTop: verticalScale(16)}]}>
          {totalBookingAmount === '0' ? (
            <Text
              style={[
                mainStyles.fontInriaSansRegular,
                mainStyles.fontSize16,
                mainStyles.primaryTextColor,
              ]}
              numberOfLines={2}>
              No Slots Selected!!
            </Text>
          ) : (
            <Text
              style={[
                mainStyles.fontInriaSansRegular,
                mainStyles.fontSize20,
                mainStyles.primaryTextColor,
              ]}>
              TOTAL : ₹ {totalBookingAmount}
            </Text>
          )}

          <PrimaryButton
            title={'CONTINUE'}
            style={slotBookingStyles.continueButton}
            disabled={Object.keys(selectedSlot).length === 0}
            onPress={() =>
              navigation.navigate('BookingConfirmation', {
                slotBookingData: selectedSlot,
                boxData: boxInfo,
                totalAmountToBePaid: totalBookingAmount,
              })
            }
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SlotBooking;
