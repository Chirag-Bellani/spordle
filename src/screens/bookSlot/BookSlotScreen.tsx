import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import moment from 'moment';

import HeaderComp from '../../components/HeaderComp';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { icon } from '../../constants/icon';
import imagePath from '../../constants/imagePath';
import GoBack from '../../components/GoBack';
import { boxByCourt, boxCourtBySlot } from '../../services';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/color';
import NetInfoComponent from '../../components/NetInfoComponent';
import { AppStackScreenProps } from '../../navigation/navigationTypes';
import { SelectedSlotType, Slot } from '../../types/slot';
import { Court, courtItem, NormalizedSlot } from '../../types/court';
import navigationString from '../../constants/navigationString';

const BookSlotScreen: React.FC<AppStackScreenProps<'BookSlotScreen'>> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const boxIdFromParams = route?.params?.box?.id;

  const [dates, setDates] = useState<
    {
      day: string;
      date: string;
      month: string;
      fullDate: string;
    }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format('YYYY-MM-DD'),
  );
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [courtData, setCourtData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [boxName, setBoxName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<NormalizedSlot[]>([]);
  const [slotCountsByDate, setSlotCountsByDate] = useState<{
    [key: string]: number;
  }>({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  // build next 7 dates
  useEffect(() => {
    const tempDates = [];
    for (let i = 0; i < 7; i++) {
      const date = moment().add(i, 'days');
      tempDates.push({
        day: date.format('ddd'),
        date: date.format('DD'),
        month: date.format('MMM'),
        fullDate: date.format('YYYY-MM-DD'),
      });
    }
    setDates(tempDates);
  }, []);

  useEffect(() => {
    if (boxIdFromParams) {
      fetchCourts(boxIdFromParams);
    } else {
      setError('No box ID found. Cannot fetch courts.');
    }
  }, [boxIdFromParams]);

  // refresh when screen focuses
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (selectedCourt && selectedDate) {
        fetchSlots(selectedCourt, selectedDate);
      }
    });
    return unsubscribe;
  }, [navigation, selectedCourt, selectedDate]);

  const fetchCourts = async (box_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('box_id', box_id.toString());

      const response = await boxByCourt(formData);

      if (response?.success) {
        let courts = [];
        let extractedBoxName = '';

        if (Array.isArray(response.data)) {
          courts = response.data;
          extractedBoxName = courts[0]?.box_name || courts[0]?.box?.name || '';
        } else if (response.data?.courts) {
          courts = response.data.courts;
          extractedBoxName = response.data.box_name || '';
        } else if (response.data?.box_courts) {
          courts = response.data.box_courts;
          extractedBoxName = response.data.box_name || '';
        } else if (response.data?.data) {
          courts = response.data.data.courts || response.data.data;
          extractedBoxName = response.data.data.box_name || '';
        }

        setCourtData(courts);
        setBoxName(extractedBoxName || 'Court');

        if (courts.length > 0) {
          setSelectedCourt(courts[0].id);
        } else {
          setError('No courts available for this box.');
          setInitialLoadComplete(true); // ADD THIS LINE - Mark as complete even with no courts
        }
      } else {
        setError(response?.message || 'Failed to fetch courts.');
        setInitialLoadComplete(true); // ADD THIS LINE
      }
    } catch (err) {
      console.error('Courts API Error:', err);
      setError('Something went wrong while fetching courts.');
      setInitialLoadComplete(true); // ADD THIS LINE
    } finally {
      setLoading(false);
    }
  };

  // When switching court: only clear selections for current date and update counts
  const handleCourtSelect = (court: Court): void => {
  if (selectedCourt !== court.id) {
    setSelectedCourt(court.id);
    // ❌ selectedSlots ko touch hi nahi karna
  }
};

  useEffect(() => {
    if (selectedCourt && selectedDate) {
      fetchSlots(selectedCourt, selectedDate);
    }
  }, [selectedCourt, selectedDate]);

  const getNormalizedSlotId = (slot: {
    slot_id?: number;
    box_court_slot_id?: number;
    id?: number;
  }) => {
    return slot?.slot_id ?? slot?.box_court_slot_id ?? slot?.id ?? null;
  };

  // Fetch slots and normalize them
  const fetchSlots = async (courtId: number, date: string) => {
    setSlotLoading(true);
    setSlotData([]);
    setBookedSlots([]);

    try {
      const payload = {
        booking_date: date,
        box_court_id: courtId,
      };

      const response = await boxCourtBySlot(payload);

      if (response?.success) {
        let slotsRaw = [];
        let bookedRaw = [];

        if (response.data?.all_slots) {
          slotsRaw = response.data.all_slots;
        } else if (Array.isArray(response.data)) {
          slotsRaw = response.data;
        } else if (response.slots) {
          slotsRaw = response.slots;
        } else if (response.data?.data) {
          slotsRaw = response.data.data.all_slots || response.data.data || [];
        }

        if (response.data?.booked_slot) {
          bookedRaw = Array.isArray(response.data.booked_slot)
            ? response.data.booked_slot
            : [response.data.booked_slot];
        } else if (response.booked_slot) {
          bookedRaw = Array.isArray(response.booked_slot)
            ? response.booked_slot
            : [response.booked_slot];
        } else if (response.data?.booked) {
          bookedRaw = Array.isArray(response.data.booked)
            ? response.data.booked
            : [response.data.booked];
        }

        // Normalize slots into a consistent shape
        const normalizedSlots = slotsRaw.map((s: Slot) => {
          const normalized_id = getNormalizedSlotId(s);
          return {
            raw: s,
            normalized_id,
            id: s.id,
            rate: parseFloat(s.rate),
            slot_id: s.slot_id,
            box_court_slot_id: s.box_court_slot_id,
            get_single_slot: s.get_single_slot,
          };
        });

        setSlotData(normalizedSlots);
        setBookedSlots(bookedRaw);

        normalizedSlots.forEach((ns: NormalizedSlot) => {
          const isBooked = checkBookedByNormalizedId(
            ns.normalized_id,
            bookedRaw,
          );
        });
      } else {
        setSlotData([]);
        setBookedSlots([]);
      }
    } catch (err) {
      console.error(' Slot API Error:', err);
      setSlotData([]);
      setBookedSlots([]);
    } finally {
      setSlotLoading(false);
      setInitialLoadComplete(true); // Mark initial load as complete
    }
  };

  const checkBookedByNormalizedId = (
    normalizedId: number | string | null | undefined,
    bookedArray = bookedSlots,
  ) => {
    if (normalizedId === null || normalizedId === undefined) return false;

    return bookedArray.some((b: Slot) => {
      if (b === null || b === undefined) return false;

      // If booked entry is primitive number/string
      if (typeof b === 'number' || typeof b === 'string') {
        // compare loosely (string/number)
        return String(b) === String(normalizedId);
      }

      // If booked entry is object, check common fields
      if (typeof b === 'object') {
        return (
          String(b.id) === String(normalizedId) ||
          String(b.slot_id) === String(normalizedId) ||
          String(b.box_court_slot_id) === String(normalizedId) ||
          String(b.box_court_id) === String(normalizedId)
        );
      }

      return false;
    });
  };

  // public helper used in UI
  const isSlotBooked = (
    slotNormalizedId: number | string | null | undefined,
  ) => {
    const booked = checkBookedByNormalizedId(slotNormalizedId, bookedSlots);

    return booked;
  };

  // toggle selection by normalized id
  const toggleSlotSelection = (slotNormalized: Slot) => {
    // slotNormalized is an object from normalized slotData
    const normalizedId = slotNormalized.normalized_id || null;
    if (normalizedId === null || normalizedId === undefined) {
      Alert.alert(
        'Invalid slot',
        'Cannot select this slot. Missing identifier.',
      );
      return;
    }

    const booked = isSlotBooked(normalizedId);
    if (booked) {
      Alert.alert(
        'Slot Already Booked',
        'This slot is already booked. Please select another slot.',
        [{ text: 'OK' }],
      );
      return;
    }

    setSelectedSlots((prev: NormalizedSlot[]) => {
      // check exists for current date and same normalized id
      const exists: NormalizedSlot | undefined = prev.find(
        (s: NormalizedSlot) =>
          String(s.normalized_id) === String(normalizedId) &&
          s.date === selectedDate &&
          s.court_id === selectedCourt,
      );

      let updated: NormalizedSlot[];
      if (exists) {
        updated = prev.filter(
          (s: NormalizedSlot) =>
            !(
              String(s.normalized_id) === String(normalizedId) &&
              s.date === selectedDate &&
              s.court_id === selectedCourt
            ),
        );
      } else {
        // add new selected slot (store useful metadata)
        const single = slotNormalized.get_single_slot || {};
        const newEntry: NormalizedSlot = {
          normalized_id: normalizedId,
          rate: parseFloat(slotNormalized.rate) || 0,
          slot_id: slotNormalized.slot_id,
          start_time: single.start_time || '',
          end_time: single.end_time || '',
          name: single.name || '',
          date: selectedDate,
          court_id: selectedCourt as number,
        };
        updated = [...prev, newEntry];
      }

      updateSlotCounts(updated);
      return updated;
    });
  };

  // Check selection for CURRENT date only by normalized id
  const isSlotSelected = (
    slotNormalizedId: number | string | null | undefined,
  ) => {
    return selectedSlots.some(
      s =>
        String(s.normalized_id) === String(slotNormalizedId) &&
        s.date === selectedDate &&
        s.court_id === selectedCourt,
    );
  };

  const updateSlotCounts = (slots: NormalizedSlot[]): void => {
    const counts: { [key: string]: number } = {};
    slots.forEach((slot: NormalizedSlot) => {
      const date: string = slot.date;
      counts[date] = (counts[date] || 0) + 1;
    });

    setSlotCountsByDate(counts);
  };
  const getSlotCountForDate = (date: string): number => {
    const count = slotCountsByDate[date] || 0;

    return count;
  };

  const calculateTotal = (): number => {
    return selectedSlots.reduce(
      (sum: number, slot: NormalizedSlot) => sum + (Number(slot.rate) || 0),
      0,
    );
  };

  const getSlotStatusStyle = (
    slotNormalizedId: number | string | null | undefined,
  ): {
    bg: string;
    border: string;
    textColor: string;
    opacity: number;
  } => {
    const booked: boolean = isSlotBooked(slotNormalizedId);
    const selected: boolean = isSlotSelected(slotNormalizedId);

    if (booked) {
      return {
        bg: COLORS.borderColor,
        border: COLORS.borderColor,
        textColor: COLORS.secondary,
        opacity: 1,
      };
    } else if (selected) {
      return {
        bg: COLORS.itemBackground,
        border: COLORS.primary,
        textColor: COLORS.darkText,
        opacity: 1,
      };
    } else {
      return {
        bg: COLORS.secondaryInfoColor,
        border: COLORS.linkingColor,
        textColor: COLORS.darkText,
        opacity: 1,
      };
    }
  };
  const getSlotIcon = (slotName: string) => {
    try {
      if (!slotName) return icon.moonIcon;
      const match = slotName.match(/(\d{1,2})(?:-\d{1,2})?\s*(AM|PM)/i);
      if (!match) {
        return icon.moonIcon;
      }

      let hour = parseInt(match[1], 10);
      const period = match[2].toUpperCase();

      if (period === 'PM' && hour !== 12) {
        hour += 12;
      }
      if (period === 'AM' && hour === 12) {
        hour = 0;
      }

      const totalMinutes = hour * 60;
      const start = 7 * 60;
      const end = 19 * 60;

      return totalMinutes >= start && totalMinutes < end
        ? icon.sunIcon
        : icon.moonIcon;
    } catch (error) {
      console.error('Error parsing slot time:', error);
      return icon.moonIcon;
    }
  };

  const handleContinue = (): void => {
    if (selectedSlots.length === 0) {
      Alert.alert(
        'No Slots Selected',
        'Please select at least one slot to continue.',
      );
      return;
    }

    const total: number = calculateTotal();
    const selectedCourtData: courtItem | undefined = courtData.find(
      (c: courtItem) => c.id === selectedCourt,
    );

    navigation.navigate(navigationString.CONFIRMATIONBOOKINGSCREEN, {
      box: route?.params?.box,
      totalAmount: total,
      selectedSlots: selectedSlots,
      selectedDate: selectedDate,
      selectedCourt: selectedCourtData,
      boxCourtId: selectedCourt,
    });
  };

  const getTimeRange = (): string => {
    if (selectedSlots.length === 0) return '';

    const currentDateSlots: NormalizedSlot[] = selectedSlots.filter(
      (s: NormalizedSlot) =>
        s.date === selectedDate && s.court_id === selectedCourt,
    );

    if (currentDateSlots.length === 0) return '';

    const sortedSlots: NormalizedSlot[] = [...currentDateSlots].sort(
      (a: NormalizedSlot, b: NormalizedSlot) => {
        const timeA = moment(a.start_time, 'HH:mm:ss');
        const timeB = moment(b.start_time, 'HH:mm:ss');
        return timeA.diff(timeB);
      },
    );

    const firstSlot: NormalizedSlot = sortedSlots[0];
    const lastSlot: NormalizedSlot = sortedSlots[sortedSlots.length - 1];

    if (firstSlot && lastSlot) {
      const startTime: string = moment(firstSlot.start_time, 'HH:mm:ss').format(
        'hh:mm A',
      );
      const endTime: string = moment(lastSlot.end_time, 'HH:mm:ss').format(
        'hh:mm A',
      );
      return `${startTime} to ${endTime}`;
    }
    return '';
  };
  return (
    <View style={styles.container}>
      <NetInfoComponent
        onReconnect={() => {
          if (selectedCourt && selectedDate) {
            fetchSlots(selectedCourt, selectedDate);
          }
          if (boxIdFromParams) {
            fetchCourts(boxIdFromParams);
          }
        }}
      />
      <HeaderComp headerText={'Book Slot'} />
      <GoBack />

      <View style={styles.fixedSection}>
        <Text style={styles.sectionTitle}>Date</Text>
        <FlatList
          data={dates}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.fullDate}
          contentContainerStyle={styles.dateListContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dateBox,
                item.fullDate === selectedDate && styles.dateBoxSelected,
              ]}
              onPress={() => setSelectedDate(item.fullDate)}
            >
              {getSlotCountForDate(item.fullDate) > 0 && (
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeText}>
                    {getSlotCountForDate(item.fullDate)}
                  </Text>
                </View>
              )}
              <Text
                style={[
                  styles.day,
                  item.fullDate === selectedDate && styles.daySelected,
                ]}
              >
                {item.day}
              </Text>
              <Text
                style={[
                  styles.date,
                  item.fullDate === selectedDate && styles.dateSelected,
                ]}
              >
                {item.date}
              </Text>
              <Text
                style={[
                  styles.month,
                  item.fullDate === selectedDate && styles.dateSelected,
                ]}
              >
                {item.month}
              </Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.courtWrapper}>
          <Text style={styles.sectionTitle}>Court</Text>
          <View style={styles.courtContainer}>
            {courtData.length > 0 ? (
              courtData.map((court: courtItem) => {
                const hasSelectedSlots = selectedSlots.some(
                  (slot: NormalizedSlot) =>
                    slot.date === selectedDate && slot.court_id === court.id,
                );
                return (
                  <TouchableOpacity

                    key={court.id}
                    style={[
                      styles.courtBox,
                      selectedCourt === court.id &&
                        // hasSelectedSlots &&
                        {
                          backgroundColor:  selectedCourt === court.id ? COLORS.primary :COLORS.primary,
                        },
                    ]}
                    onPress={() => handleCourtSelect(court)}
                  >
                    {hasSelectedSlots && <View style={styles.courtBadge} />}
                    <Text
                      style={[
                        styles.courtText,
                        selectedCourt === court.id && {
                          color: selectedCourt === court.id ? 'white' : 'gray',
                        },
                      ]}
                    >
                      {court.name || `C${court.id}`}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.noSlotsText}>
                {loading ? 'Loading courts...' : 'No court available'}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            Be The First! Reserve This Court Before Anyone
          </Text>
        </View>
      </View>
      <ScrollView
        style={styles.slotsScrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.slotsContent}
      >
        {!initialLoadComplete || slotLoading ? (
          // Show loading state
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading slots...</Text>
          </View>
        ) : slotData.length > 0 ? (
          // Show slots when data is available
          slotData.map((item: Slot) => {
            const slotInfo = item.get_single_slot || {};
            const startTime = slotInfo.start_time
              ? moment(slotInfo.start_time, 'HH:mm:ss').format('hh:mm A')
              : '';
            const isSelected = isSlotSelected(item.normalized_id);
            const isBooked = isSlotBooked(item.normalized_id);
            const statusStyle = getSlotStatusStyle(item.normalized_id);

            return (
              <View
                key={String(item.normalized_id) + '_' + String(item.id)}
                style={styles.slotRow}
              >
                <View style={styles.timeSection}>
                  <Text style={styles.timeText}>
                    {startTime} -{' '}
                    {slotInfo.end_time
                      ? moment(slotInfo.end_time, 'HH:mm:ss').format('hh:mm A')
                      : ''}
                  </Text>
                  <Image
                    source={getSlotIcon(slotInfo.name)}
                    style={styles.icon}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.slotCard,
                    {
                      backgroundColor: statusStyle.bg,
                      borderColor: statusStyle.border,
                      opacity: statusStyle.opacity,
                    },
                  ]}
                  onPress={() => toggleSlotSelection(item)}
                  activeOpacity={isBooked ? 1 : 0.7}
                  disabled={isBooked}
                >
                  <Text
                    style={[
                      styles.availableText,
                      {
                        color: statusStyle.textColor,
                        fontWeight: isBooked ? '600' : '400',
                      },
                    ]}
                  >
                    {isBooked ? 'Booked' : `₹${item.rate}`}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          // Show no data image when load is complete and no data
          <View style={styles.noDataContainer}>
            <Image
              source={imagePath.noData1}
              style={styles.profileImage}
              resizeMode="contain"
            />
            <Text style={styles.noDataImageText}>No slots available</Text>
          </View>
        )}
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendBox,
              {
                backgroundColor: COLORS.borderColor,
                borderColor: COLORS.borderColor,
              },
            ]}
          />
          <Text style={styles.legendText}>Booked</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendBox,
              {
                backgroundColor: COLORS.secondaryInfoColor,
                borderColor: COLORS.linkingColor,
              },
            ]}
          />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendBox,
              {
                backgroundColor: COLORS.itemBackground,
                borderColor: COLORS.primary,
              },
            ]}
          />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>
      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        {selectedSlots.length > 0 ? (
          <View style={styles.footerLeft}>
            <Text style={styles.totalLabel}>
              TOTAL : ₹{calculateTotal().toFixed(2)}
            </Text>
            <Text style={styles.timeRange}>{getTimeRange()}</Text>
          </View>
        ) : (
          <Text style={styles.noDataText}>No Slot Selected!!</Text>
        )}

        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedSlots.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedSlots.length === 0}
        >
          <Text style={styles.continueButtonText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  fixedSection: {
    borderBottomColor: COLORS.secondary,
  },
  sectionTitle: {
    fontFamily: 'Inria Sans',
    fontSize: scale(18),
    fontWeight: '600',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
    paddingHorizontal: moderateScale(15),
    color: COLORS.darkText,
  },
  dateListContainer: {
    paddingHorizontal: moderateScale(10),
  },
  dateBox: {
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(12),
    alignItems: 'center',
    marginHorizontal: moderateScale(5),
    minWidth: moderateScale(65),
    backgroundColor: '#FAFAFA',
    position: 'relative',
    marginTop: verticalScale(10),
  },
  dateBadge: {
    position: 'absolute',
    top: -10,
    right: -6,
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(12),
    minWidth: moderateScale(22),
    height: moderateScale(22),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(5),
    zIndex: 10,
    elevation: 3,
  },
  dateBadgeText: {
    color: COLORS.secondary,
    fontSize: scale(12),
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  dateBoxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  day: {
    fontSize: scale(13),
    color: COLORS.primary,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  daySelected: {
    color: COLORS.secondary,
  },
  date: {
    fontSize: scale(20),
    fontWeight: '700',
    color: COLORS.darkText,
    marginVertical: verticalScale(2),
    fontFamily: 'Inter',
  },
  dateSelected: {
    color: COLORS.secondary,
  },
  month: {
    fontSize: scale(13),
    color: '#666',
    fontFamily: 'Inter',
  },
  courtWrapper: {
    marginTop: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  courtContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: moderateScale(15),
    marginBottom: verticalScale(5),
  },
  courtBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(16),
    marginRight: moderateScale(10),
    marginBottom: moderateScale(10),
    backgroundColor: '#FAFAFA',
    marginTop: verticalScale(10),
    position: 'relative',
  },

  courtBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  courtText: {
    fontWeight: '600',
    // color: '#gray',
    fontFamily: 'Inter',
    fontSize: scale(15),
  },

  noDataText: {
    color: COLORS.primary,
    fontSize: scale(18),
    fontFamily: 'Inter',
  },
  infoBanner: {
    backgroundColor: COLORS.infoColor,
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(11),
    marginHorizontal: moderateScale(10),
    marginVertical: verticalScale(10),
    borderRadius: moderateScale(4),
  },
  infoBannerText: {
    color: COLORS.secondary,
    fontSize: scale(14),
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  slotsScrollView: {
    flex: 1,
  },
  slotsContent: {
    paddingHorizontal: moderateScale(15),
    paddingBottom: verticalScale(20),
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  timeSection: {
    marginRight: moderateScale(10),
  },
  timeText: {
    fontSize: scale(12),
    color: COLORS.darkText,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  icon: {
    width: scale(26),
    height: scale(26),
    tintColor: COLORS.warning,
  },
  slotCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(16),
    width: moderateScale(150),
    height: moderateScale(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableText: {
    fontSize: scale(14),
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  noSlotsText: {
    textAlign: 'center',
    color: '#999',
    marginTop: verticalScale(30),
    fontSize: scale(15),
    fontFamily: 'Inter',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(15),
    backgroundColor: COLORS.secondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: moderateScale(12),
  },
  legendBox: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderWidth: 2,
    borderRadius: moderateScale(4),
    marginRight: moderateScale(6),
  },
  legendText: {
    fontSize: scale(16),
    color: COLORS.darkText,
    fontFamily: 'Nunito',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(15),
    backgroundColor: COLORS.secondary,
  },
  footerLeft: {
    flex: 1,
  },
  totalLabel: {
    fontSize: scale(18),
    color: COLORS.darkText,
    fontWeight: '400',
    fontFamily: 'Inria Sans',
  },
  timeRange: {
    fontSize: scale(12),
    color: COLORS.primary,
    marginTop: verticalScale(4),
    fontFamily: 'Inria Sans',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: moderateScale(40),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(8),
    elevation: 2,
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.borderColor,
  },
  continueButtonText: {
    color: COLORS.secondary,
    fontSize: scale(16),
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  profileImage: {
    width: moderateScale(140),
    height: moderateScale(140),
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(50),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(100),
  },
  loadingText: {
    fontSize: scale(16),
    color: COLORS.darkText,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  noDataImageText: {
    fontSize: scale(16),
    color: '#999',
    fontFamily: 'Inter',
    fontWeight: '500',
    marginTop: verticalScale(15),
    textAlign: 'center',
  },
});

export default BookSlotScreen;
