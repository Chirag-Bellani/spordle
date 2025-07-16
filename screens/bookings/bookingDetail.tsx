import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import mainStyles from '../../assets/styles/mainStyles';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import boxCardStyles from '../../assets/styles/boxCardStyles';
import {images} from '../../constants/image';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {handleShowLocation} from '../../utils/showLocationUtil';
import ScreenWrapper from '../../components/screenWrapper';
import {AppStackScreenProps} from '../../navigation/navigationTypes';
import {BoxImage} from '../types/boxImage';
import {BookingItem} from '../types/booking';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const sliderHeight = screenHeight / 3;

interface AnimatedHeaderProps {
  scrollY: Animated.Value;
  boxDetail?: BookingItem;
}
const BookingDetail: React.FC<AppStackScreenProps<'BookingDetail'>> = ({
  navigation,
  route,
}) => {
  const {bookingDetail} = route.params;
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Animate slider (opacity and scale)
  const sliderOpacity = scrollY.interpolate({
    inputRange: [0, sliderHeight / 2, sliderHeight],
    outputRange: [1, 0.6, 0],
    extrapolate: 'clamp',
  });

  const renderItem = ({item}: {item: BoxImage}) => {
    return (
      <View>
        <Image source={{uri: item.image}} style={styles.image} />
      </View>
    );
  };

  // top Animated Header
  const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
    scrollY,
    boxDetail,
  }) => {
    const headerTranslateY = scrollY.interpolate({
      inputRange: [0, sliderHeight],
      outputRange: [-150, 0],
      extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
      inputRange: [0, sliderHeight + 30],
      outputRange: [0.6, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: verticalScale(90),
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(4),
            paddingTop: verticalScale(17),
            transform: [{translateY: headerTranslateY}],
            opacity: headerOpacity,
            elevation: 5,
            zIndex: 10,
            gap: scale(7),
          },
          mainStyles.primaryBackgroundColor,
        ]}>
        <EvilIcons
          name="chevron-left"
          size={38}
          color={'white'}
          onPress={() => navigation.goBack()}
        />
        <View>
          <Text
            style={[
              mainStyles.fontSize16,
              mainStyles.fontNunitoRegular,
              {color: 'white'},
            ]}>
            {boxDetail?.get_selected_box?.title}
          </Text>
          <Text
            style={[
              mainStyles.fontSize14,
              mainStyles.fontNunitoRegular,
              {color: 'white'},
            ]}>
            {boxDetail?.get_selected_box?.address}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScreenWrapper
      safeTop={false}
      safeBottom={true}
      scrollable={false}
      padding={false}
      withHeader={false}
      keyboardAvoiding={false}
      statusBarTranslucent
      statusBarBackgroundColor="transparent"
      statusBarStyle="light-content">
      <AnimatedHeader scrollY={scrollY} boxDetail={bookingDetail} />
      <Animated.ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: verticalScale(100)}}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}>
        {/* Top slider  */}
        <Animated.View
          style={[styles.sliderContainer, {opacity: sliderOpacity}]}>
          <Carousel
            ref={carouselRef}
            data={bookingDetail?.get_selected_box?.get_selected_box_images}
            renderItem={renderItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth}
            onSnapToItem={index => setActiveSlide(index)}
            inactiveSlideScale={1} // Keep inactive slides full size
            inactiveSlideOpacity={1}
          />
          <Pagination
            dotsLength={
              bookingDetail?.get_selected_box.get_selected_box_images?.length
            }
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            dotStyle={[styles.paginationDot, mainStyles.primaryBackgroundColor]}
            inactiveDotStyle={mainStyles.secondaryBackgroundColor}
            inactiveDotOpacity={1}
            inactiveDotScale={1}
          />
          {/* top navigating icons container */}
          <View style={styles.topIconsContainer}>
            <TouchableOpacity
              style={[styles.iconButton, mainStyles.secondaryBackgroundColor]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}>
              <EvilIcons name="chevron-left" size={moderateScale(28)} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* You can add more content below the slider */}
        <View style={styles.content}>
          <View style={[boxCardStyles.firstRow, {borderBottomWidth: 0}]}>
            <View style={boxCardStyles.titleContainer}>
              <Text style={boxCardStyles.boxTitle} numberOfLines={2}>
                {bookingDetail?.get_selected_box?.title || '---'}
              </Text>
              <Text style={boxCardStyles.address} numberOfLines={3}>
                {bookingDetail?.get_selected_box?.address || '----'}
              </Text>
            </View>
            <Text style={boxCardStyles.rating}>
              ⭐ {bookingDetail?.get_selected_box?.avg_rating || '4.5'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.locationButton, mainStyles.primaryBorderColor]}
            onPress={() =>
              handleShowLocation(
                bookingDetail?.get_selected_box?.latitude,
                bookingDetail?.get_selected_box?.longitude,
              )
            }>
            <Image
              source={images.googleMapsPin}
              style={{
                width: moderateScale(15, 0.8),
                height: moderateVerticalScale(20),
              }}
            />
            <Text
              style={[
                mainStyles.fontNunitoRegular,
                mainStyles.fontSize14,
                mainStyles.darkTextColor,
              ]}>
              Show in Map
            </Text>
          </TouchableOpacity>

          {/* booked Slot details */}

          <View
            style={[
              styles.cardContainer,
              mainStyles.dropShadowEffect,
              mainStyles.secondaryBackgroundColor,
              mainStyles.marginTop20,
            ]}>
            {/* Booking Details Section */}

            <Text
              style={[
                mainStyles.fontInriaSansBold,
                mainStyles.darkTextColor,
                mainStyles.fontSize18,
              ]}>
              Booking Details:
            </Text>

            {bookingDetail?.get_bookings_details?.map((booking, index) => (
              <React.Fragment key={index}>
                <View style={styles.detailsContainer}>
                  <Text
                    style={[
                      mainStyles.fontSize14,
                      mainStyles.lightTextColor,
                      mainStyles.fontNunitoBold,
                      mainStyles.marginTop10,
                    ]}>
                    <Text
                      style={[
                        mainStyles.fontSize14,
                        mainStyles.darkTextColor,
                        mainStyles.fontNunitoRegular,
                      ]}>
                      Booking Date :
                    </Text>{' '}
                    {booking?.booking_date || 'N/A'}
                  </Text>
                  <Text
                    style={[
                      mainStyles.fontSize14,
                      mainStyles.lightTextColor,
                      mainStyles.fontNunitoBold,
                      mainStyles.marginTop10,
                    ]}>
                    <Text
                      style={[
                        mainStyles.fontSize14,
                        mainStyles.darkTextColor,
                        mainStyles.fontNunitoRegular,
                      ]}>
                      Court :
                    </Text>{' '}
                    {booking?.get_selected_box_court?.name || 'N/A'}
                  </Text>

                  {/* Slot Details Section */}

                  {/* <Text
                style={[
                  mainStyles.fontInriaSansBold,
                  mainStyles.darkTextColor,
                  mainStyles.fontSize18,
                ]}>
                Slot Details:
              </Text> */}
                  <View style={styles.tableHeader}>
                    <Text
                      style={[
                        mainStyles.darkTextColor,
                        mainStyles.fontNunitoBold,
                        mainStyles.fontSize14,
                      ]}>
                      Time Slot :
                    </Text>
                  </View>
                  {booking?.get_selected_booking_slot_details.map(
                    (bookedSlot, index) => (
                      <View style={styles.slotRow} key={index}>
                        <Text
                          style={[
                            mainStyles.fontInriaSansRegular,
                            mainStyles.fontSize12,
                            mainStyles.darkTextColor,
                          ]}>
                          {bookedSlot?.get_selected_slot?.start_time} -{' '}
                          {bookedSlot?.get_selected_slot?.end_time}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </React.Fragment>
            ))}
            {/* Total Amount Section */}
            <View style={styles.totalAmountContainer}>
              <Text
                style={[
                  mainStyles.fontInriaSansBold,
                  mainStyles.fontSize20,
                  {color: '#2a9d8f'},
                ]}>
                Total Amount: ₹{bookingDetail?.total_amount || 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </ScreenWrapper>
  );
};

export default BookingDetail;

const styles = StyleSheet.create({
  sliderContainer: {
    height: sliderHeight,
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: -16,
    alignSelf: 'center',
    // paddingVertical: 8,
  },
  paginationDot: {
    width: scale(5),
    height: verticalScale(5),
    borderRadius: moderateScale(6),
    marginHorizontal: scale(-3),
  },
  content: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(14),
  },
  locationButton: {
    borderRadius: moderateScale(7),
    width: '97%',
    borderWidth: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    marginTop: verticalScale(10),
    flexDirection: 'row',
    gap: scale(10),
  },

  sportItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(15),
    marginBottom: verticalScale(10),
    width: scale(85),
    height: verticalScale(60),
    borderRadius: moderateScale(4),
  },
  sportsContainer: {
    marginTop: verticalScale(10),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  sportLogo: {
    width: scale(22),
    height: verticalScale(22),
    marginBottom: verticalScale(5),
  },

  topIconsContainer: {
    position: 'absolute',
    top: verticalScale(36),
    left: scale(20),
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10), // Note: if 'gap' is not supported, use margin on children
  },
  iconButton: {
    width: moderateScale(26, 0.8),
    height: moderateVerticalScale(26, 0.6),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContainer: {
    borderRadius: moderateScale(10),
    padding: scale(16),
    marginVertical: verticalScale(10),
  },
  detailsContainer: {
    marginTop: verticalScale(15),

    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },

  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingVertical: verticalScale(5),
  },

  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(6),
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },

  totalAmountContainer: {
    backgroundColor: '#C1F5CF',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    marginTop: verticalScale(15),
  },
});
