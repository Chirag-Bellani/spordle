import React, { useState, useEffect, useRef } from 'react';
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
import {
  moderateScale,
  verticalScale,
  scale,
  moderateVerticalScale,
} from 'react-native-size-matters';
import { icon } from '../../constants/icon';
import imagePath from '../../constants/imagePath';
import AnimatedBookNowButton from './AnimatedBookNowButton ';
import { useIsFocused } from '@react-navigation/native';
import CancelPolicyComp from '../../components/CancelPolicyComp';
import GoBack from '../../components/GoBack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ratingReview } from '../../services';
import { COLORS } from '../../constants/color';
import NetInfoComponent from '../../components/NetInfoComponent';
import navigationString from '../../constants/navigationString';
import { ChevronLeft, CircleAlert, MapPin, Star } from 'lucide-react-native';
import { AppStackScreenProps } from '../../navigation/navigationTypes';
import { BookingReview } from '../../types/review';
import MapWebView from '../../components/MapViewComp';
import { useAuth } from '../../context/AuthContext';
import { Heart } from 'lucide-react-native';
import { bookMark } from '../../services';

const { width } = Dimensions.get('window');

const BoxDetails: React.FC<AppStackScreenProps<'BoxDetails'>> = ({
  route,
  navigation,
}) => {
  const { item, onBookmarkChange } = route.params;

  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllSports, setShowAllSports] = useState(false);
  const [bookingRatingReview, setBookingRatingReview] = useState<
    BookingReview[]
  >([]);
  const { updateBookmark } = useAuth();

  const [fav, setFav] = useState<boolean>(Boolean(item?.is_bookmarked));
  const [bookmarkLoading, setBookmarkLoading] = useState<boolean>(false);

  
  const isFocused = useIsFocused();

  const scrollY = useRef(new Animated.Value(0)).current;
  const { isBoxBookmarked } = useAuth();

  useEffect(() => {
    setFav(isBoxBookmarked(item.id));
  }, [isBoxBookmarked, item.id]);

  //  Animated header values
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

  // Reset all "show all" states when screen comes back into focus
  useEffect(() => {
    if (isFocused) {
      setShowAllAmenities(false);
      setShowAllReviews(false);
      setShowAllSports(false);
    }
  }, [isFocused]);

  const handleShowAllReviews = () => {
    navigation.navigate(navigationString.REVIEW, { item, bookingRatingReview });
  };

  useEffect(() => {
    const getBookingRatingReview = async () => {
      try {
        //         const formData = {
        //   box_id: item.id,
        // };
        const formData = new FormData();
        formData.append('box_id', String(item.id));

        const response = await ratingReview(formData);

        if (response?.success) {
          setBookingRatingReview(response.data);
        } else {
          setBookingRatingReview([]);
        }
      } catch (error) {
        console.error('Error fetching booking rating review:', error);
      }
    };
    getBookingRatingReview();
  }, []);

  const handleShowMap = () => {
    if (item?.latitude && item?.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
      Linking.openURL(url).catch(err =>
        console.error('Failed to open maps:', err),
      );
    } else {
      Alert.alert('Location not available', 'Latitude/Longitude missing.');
    }
  };

  const handleBookNow = () => {
    if (isFocused) {
      if (item?.id) {
        navigation.navigate(navigationString.BOOKSLOTSCREEEN, { box: item });
      } else {
        Alert.alert('Error', 'Box ID is missing.');
      }
    } else {
      console.log('Navigation blocked: Screen is not currently focused.');
    }
  };

  if (!item) {
    return (
      <>
        <StatusComp />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No item selected.</Text>
        </View>
      </>
    );
  }
  const handleBookmarkToggle = async (): Promise<void> => {
    if (bookmarkLoading || !item?.id) return;

    const newFavState = !fav;

    try {
      setBookmarkLoading(true);
      setFav(newFavState);

      const formData = new FormData();
      formData.append('box_id', String(item.id));
      formData.append('is_bookmark', newFavState ? '0' : '1');

      const response = await bookMark(formData);

      if (response?.success) {
        updateBookmark(item.id, newFavState);

        // 🔥 Notify Home → BoxList
        if (onBookmarkChange) {
          onBookmarkChange(item.id, newFavState);
        }
      } else {
        setFav(!newFavState);
        Alert.alert('Error', response?.message || 'Failed to update bookmark');
      }
    } catch (error) {
      setFav(!newFavState);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  useEffect(() => {
    setFav(isBoxBookmarked(item.id));
  }, [isBoxBookmarked, item.id]);

  const images = item.get_selected_box_images?.map(img => img.image) || [];
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { marginBottom: insets.bottom }]}>
      <NetInfoComponent
        onReconnect={() => {
          if (item?.id) {
            // re-fetch rating & reviews when internet returns
            // const formData = { box_id: item.id };

            const formData = new FormData();
            formData.append('box_id', String(item.id));
            ratingReview(formData)
              .then(res => {
                if (res?.success) {
                  setBookingRatingReview(res.data);
                }
              })
              .catch(() => {});
          }
        }}
      />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <StatusComp />
      <GoBack />

      {/*  Animated Header Start */}
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

        <Text style={styles.headerTitle} numberOfLines={3} ellipsizeMode="tail">
          {item.title
            ? `${item.title}\n${item.address || ''}`
            : item.address || 'Unknown Address'}
        </Text>
      </Animated.View>

      <Animated.ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {/*  Image Swiper */}
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

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image source={icon.backIcon} style={styles.iconImg} />
          </TouchableOpacity>
          {/* Like + Share */}
          <View style={styles.rightIconGroup}>
            <TouchableOpacity
              style={styles.circleIcon}
              onPress={handleBookmarkToggle}
              disabled={bookmarkLoading}
            >
              {bookmarkLoading ? (
                <Text style={{ fontSize: 16 }}>⏳</Text>
              ) : (
                <Heart
                  size={20}
                  color={fav ? COLORS.primary : COLORS.darkText}
                  fill={fav ? COLORS.primary : 'none'}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.circleIcon}>
              <Image source={imagePath.shareIcon} style={styles.iconImg} />
            </TouchableOpacity>
          </View>
        </View>
        {/*  Title + Location + Rating */}
        <View style={styles.detailBox}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title || 'Untitled'}</Text>
            <View style={styles.ratingBox}>
              <Star size={14} color={COLORS.secondary} />
              <Text style={styles.ratingText}>
                {parseFloat(item.avg_rating ?? 0).toFixed(1)}
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={16} color="#666" />
            <Text style={styles.location}>
              {item.address || 'Unknown Address'}
            </Text>
          </View>
        </View>

        {/* Map Location Button */}
        <View style={styles.form}>
          <TouchableOpacity style={styles.input} onPress={handleShowMap}>
            <Image source={imagePath.googleMapsPin} style={styles.mapPinImg} />
            <Text style={styles.inputText}>Show In Map</Text>
          </TouchableOpacity>
        </View>

        {/* Offer Section */}
        <View style={styles.form}>
          <TouchableOpacity style={styles.offerBtn}>
            <Image source={icon.offerIcon} style={styles.offerIcon} />
            <Text style={styles.offerTxt}>
              Upto 30 % off{'\n'}
              <Text style={styles.offerText}>
                Get 30% off upto ₹2000 on all sports
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Available Sports */}
        <View style={styles.form}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.offerTxt}>Available Sports</Text>

            {Array.isArray(item.get_selected_available_sport) &&
              item.get_selected_available_sport.length > 2 && (
                <TouchableOpacity
                  onPress={() => setShowAllSports(!showAllSports)}
                >
                  <Text style={styles.seeAll}>
                    {showAllSports ? 'Show Less' : 'See All'}
                  </Text>
                </TouchableOpacity>
              )}
          </View>

          {/* Sports Section */}
          <View style={styles.sportsContainer}>
            {Array.isArray(item.get_selected_available_sport) &&
            item.get_selected_available_sport.length > 0 ? (
              (showAllSports
                ? item.get_selected_available_sport
                : item.get_selected_available_sport.slice(0, 2)
              ).map((sportItem, index) => {
                const sport = sportItem?.get_single_sports;
                const imageUri = sport?.image;
                return (
                  <View style={styles.sportCard} key={index}>
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.sportImg}
                        resizeMode="contain"
                        onError={() =>
                          console.warn('Image failed to load:', imageUri)
                        }
                      />
                    ) : (
                      <CircleAlert size={moderateScale(30)} color="#888" />
                    )}
                    <Text style={styles.sportName}>
                      {sport?.name || 'Unknown Sport'}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noSportText}>No sports available</Text>
            )}
          </View>
        </View>

        {/* Amenities Section */}
        <View style={styles.form}>
          <View style={styles.header}>
            <Text style={styles.offerTxt}>Amenities</Text>

            {Array.isArray(item.get_selected_amenities) &&
              item.get_selected_amenities.length > 2 && (
                <TouchableOpacity
                  onPress={() => setShowAllAmenities(!showAllAmenities)}
                >
                  <Text style={styles.seeAll}>
                    {showAllAmenities ? 'Show Less' : 'See All'}
                  </Text>
                </TouchableOpacity>
              )}
          </View>

          <View style={styles.amenitiesContainer}>
            {Array.isArray(item.get_selected_amenities) &&
            item.get_selected_amenities.length > 0 ? (
              (showAllAmenities
                ? item.get_selected_amenities
                : item.get_selected_amenities.slice(0, 2)
              ).map((amenityItem, index) => {
                const amenity = amenityItem?.get_single_amenities;
                const iconUri = amenity?.icon;
                return (
                  <View style={styles.amenityCard} key={index}>
                    {iconUri ? (
                      <Image
                        source={{ uri: iconUri }}
                        style={styles.amenityImg}
                        resizeMode="contain"
                        onError={() =>
                          console.warn('Image failed to load:', iconUri)
                        }
                      />
                    ) : (
                      <CircleAlert size={moderateScale(25)} color="#888" />
                    )}
                    <Text style={styles.amenityName}>
                      {amenity?.name || 'Unknown'}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noSportText}>No amenities available</Text>
            )}
          </View>
        </View>

        {/* Cancellation Policy */}
        <CancelPolicyComp policyList={item.get_box_cancellation_policy} />

        {/* What Client Says */}
        <View style={styles.form}>
          <View style={styles.header}>
            <Text style={styles.offerTxt}>What Client Says</Text>
            {Array.isArray(bookingRatingReview) &&
              bookingRatingReview.length > 0 && (
                <TouchableOpacity onPress={handleShowAllReviews}>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              )}
          </View>

          {Array.isArray(bookingRatingReview) &&
          bookingRatingReview.length > 0 ? (
            <View>
              {bookingRatingReview.slice(0, 2).map((review, index) => {
                const user = review?.get_selected_user;
                const firstLetter =
                  user?.first_name?.charAt(0)?.toUpperCase() || 'U';
                const userName = user?.name || 'Unknown User';
                const reviewText = review?.review || 'No review provided';
                const bookingDate = review?.booking_date || '';

                return (
                  <View style={styles.clientCard} key={index}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarLetter}>{firstLetter}</Text>
                    </View>

                    <View style={styles.clientInfo}>
                      <Text style={styles.userName}>{userName}</Text>
                      {reviewText && reviewText !== 'No review provided' && (
                        <Text style={styles.userReview} numberOfLines={2}>
                          {reviewText}
                        </Text>
                      )}
                    </View>

                    <Text style={styles.reviewDate}>{bookingDate}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.noSportText}>No reviews yet</Text>
          )}
        </View>
        <View style={{ width: '100%', height: moderateScale(180) }}>
          <MapWebView destLat={item.latitude} destLng={item.longitude} />
        </View>
      </Animated.ScrollView>

      {/* Button Section */}
      <View
        style={{
          position: 'absolute',
          bottom: moderateScale(1),
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <AnimatedBookNowButton handleBookNow={handleBookNow} />
      </View>
    </View>
  );
};

export default BoxDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  imageContainer: {
    width: '100%',
    height: verticalScale(180),
    position: 'relative',
  },
  image: {
    width: width,
    height: '100%',
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 3,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  backBtn: {
    position: 'absolute',
    top: moderateScale(45),
    left: moderateScale(15),
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.darkText,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  rightIconGroup: {
    position: 'absolute',
    top: moderateScale(45),
    right: moderateScale(15),
    height: verticalScale(90),
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(10),
  },
  circleIcon: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.darkText,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconImg: {
    width: moderateScale(18),
    height: moderateScale(18),
    resizeMode: 'contain',
  },
  detailBox: {
    padding: 15,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  ratingBox: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    color: COLORS.secondary,
    marginLeft: 4,
    fontSize: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  location: {
    color: '#666',
    fontSize: 14,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  form: {
    flex: 1,
    marginTop: verticalScale(20),
    width: '95%',
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(16),
    fontSize: scale(14),
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPinImg: {
    width: moderateScale(24),
    height: moderateScale(24),
    resizeMode: 'contain',
    marginRight: moderateScale(8),
  },
  inputText: {
    fontFamily: 'nunito',
    fontSize: scale(14),
    color: COLORS.darkText,
    fontWeight: '400',
    letterSpacing: scale(1),
  },
  offerBox: {
    flex: 1,
    marginTop: verticalScale(20),
    width: '95%',
    alignSelf: 'center',
  },
  offerBtn: {
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(16),
    fontSize: scale(14),
    backgroundColor: '#C1F5CF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    resizeMode: 'contain',
    justifyContent: 'flex-start',
    paddingVertical: moderateVerticalScale(16),
    paddingHorizontal: moderateScale(32),
  },
  offerTxt: {
    fontFamily: 'nunito',
    fontSize: scale(14),
    color: COLORS.darkText,
    fontWeight: '600',
    letterSpacing: scale(1),
  },
  offerText: {
    fontFamily: 'nunito',
    fontSize: scale(12),
    color: COLORS.darkText,
    fontWeight: '600',
    letterSpacing: scale(1),
  },
  sportScroll: {
    marginTop: moderateScale(10),
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: moderateScale(10),
    marginTop: moderateScale(10),
  },
  sportCard: {
    width: moderateScale(100),
    height: moderateScale(110),
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.darkText,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sportImg: {
    width: moderateScale(40),
    height: moderateScale(40),
    marginBottom: moderateScale(8),
  },
  sportName: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: COLORS.darkText,
    textAlign: 'center',
  },
  noSportText: {
    textAlign: 'center',
    color: '#888',
    marginTop: moderateScale(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateVerticalScale(2),
    width: '95%',
  },
  seeAll: {
    fontSize: moderateScale(15),
    color: COLORS.primary,
    fontWeight: '400',
    fontFamily: 'Inria Sans',
    marginTop: moderateVerticalScale(5),
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: verticalScale(2),
    justifyContent: 'flex-start',
  },
  amenityCard: {
    width: '47%',
    height: moderateScale(70),
    marginBottom: verticalScale(8),
    marginRight: '3%',
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(12),
  },
  amenityImg: {
    width: moderateScale(24),
    height: moderateScale(24),
    marginHorizontal: moderateScale(10),
  },
  amenityName: {
    fontSize: scale(14),
    color: COLORS.darkText,
    fontWeight: '400',
    fontFamily: 'nunito',
  },
  policyList: {
    marginTop: verticalScale(8),
    paddingLeft: moderateScale(10),
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(4),
  },
  bullet: {
    fontSize: scale(16),
    color: COLORS.darkText,
    marginRight: moderateScale(6),
    lineHeight: scale(20),
  },
  policyText: {
    fontSize: scale(14),
    color: '#555',
    fontWeight: '400',
    flexShrink: 1,
    lineHeight: scale(20),
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: moderateScale(8),
    borderBottomWidth: 1,
    borderColor: COLORS.borderColor,
    justifyContent: 'space-between',
  },
  avatarCircle: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: '#AEC6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(10),
  },
  avatarLetter: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: scale(14),
  },
  clientInfo: {
    flex: 1,
  },
  userName: {
    fontSize: scale(14),
    fontWeight: '600',
    color: COLORS.darkText,
  },
  userReview: {
    fontSize: scale(12),
    color: '#666',
    marginTop: 2,
  },
  reviewDate: {
    fontSize: scale(10),
    color: '#999',
  },
  buttonContainer: {
    width: '85%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: moderateScale(100),
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: moderateScale(18),
    paddingHorizontal: moderateScale(10),
    justifyContent: 'flex-start',
    zIndex: 10,
  },
  headerBackBtn: {
    marginRight: moderateScale(10),
  },
  headerTitle: {
    color: COLORS.secondary,
    fontSize: moderateScale(16),
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubTitle: {
    color: COLORS.secondary,
    fontSize: moderateScale(12),
    fontWeight: '400',
    opacity: 0.9,
  },
  locationHeader: {
    color: COLORS.secondary,
    fontSize: moderateScale(12),
    fontWeight: '400',
    justifyContent: 'flex-start',
    marginLeft: moderateScale(10),
  },
});
