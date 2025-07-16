import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {scale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {icons} from '../constants/Icon';
import boxCardStyles from '../assets/styles/boxCardStyles';
import {updateBookmark} from '../services/bookmarkService';
import {showToast} from './toastMessage';
import {LazyImage} from 'react-native-lazy-image-loader';
import {images} from '../constants/image';
import {Box} from '../screens/types/box';
import {BoxImage} from '../screens/types/boxImage';
import {AppStackParamList} from '../navigation/navigationTypes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
const {width: screenWidth} = Dimensions.get('window');

interface BoxCardProps {
  boxData: Box;
  onAction?: (boxData?: Box | null) => void;
}

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'BoxDetail'>;

const BoxCard: React.FC<BoxCardProps> = ({boxData, onAction}) => {
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState<number>(
    boxData?.get_selected_user_book_mark?.length > 0 ? 1 : 0,
  );
  const navigation = useNavigation<NavigationProp>();

  // Entrance Animation (fade in & slide up)
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  // Offer Pulse Animation (scale up & down)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  const renderImageItem = ({item}: {item: BoxImage}) => {
    return (
      <LazyImage
        source={{uri: item.image}}
        style={boxCardStyles.sliderImage}
        priority="normal"
        blurRadius={5}
        cullingDistance={200}
        fallbackSource={images.scenic}
      />
    );
  };

  const handleBookmarkPress = async () => {
    let formData = new FormData();
    formData.append('box_id', boxData.id);

    try {
      const {success, message} = await updateBookmark(formData);
      if (success) {
        setIsBookmarked(isBookmarked ? 0 : 1);
        if (onAction) {
          onAction();
        }
      } else {
        showToast('error', message || 'Failed to update bookmark!');
        console.log(message);
      }
    } catch (error: unknown) {
      if (error instanceof Error)
        showToast('error', error.message || 'Failed to update bookmark!');
    }
  };

  const handleBoxCardPress = () => {
    navigation.navigate('BoxDetail', {
      boxDetail: boxData,
      isBookmarked: isBookmarked,
    });
    onAction?.(boxData);
  };

  return (
    <Pressable onPress={handleBoxCardPress}>
      <Animated.View
        style={[
          boxCardStyles.cardContainer,
          {
            opacity: animatedValue,
            transform: [{translateY}],
          },
        ]}>
        {/* Image slider */}
        <View style={boxCardStyles.sliderContainer}>
          <Carousel
            ref={carouselRef}
            data={boxData?.get_selected_box_images}
            renderItem={renderImageItem}
            sliderWidth={screenWidth - scale(32)}
            itemWidth={screenWidth - scale(40)}
            onSnapToItem={index => setActiveSlide(index)}
            autoplay
            loop
            inactiveSlideOpacity={0.8}
            inactiveSlideScale={0.95}
          />
          <Pagination
            dotsLength={boxData?.get_selected_box_images?.length}
            activeDotIndex={activeSlide}
            containerStyle={boxCardStyles.paginationContainer}
            dotStyle={boxCardStyles.paginationDotActive}
            inactiveDotStyle={boxCardStyles.paginationDotInactive}
            inactiveDotOpacity={1}
            inactiveDotScale={1}
          />
          {/* Sports category label */}
          <View style={boxCardStyles.sportsCategoryLabel}>
            {boxData?.get_selected_available_sport
              ?.slice(0, 2)
              .map((sport, index) => (
                <React.Fragment key={sport.id}>
                  <Image
                    source={{uri: sport.get_single_sports?.icon}}
                    style={boxCardStyles.categoryIcon}
                  />
                  {index === 0 && (
                    <Text style={boxCardStyles.categorySeparator}>|</Text>
                  )}
                </React.Fragment>
              ))}

            {boxData?.get_selected_available_sport?.length > 2 && (
              <Text style={boxCardStyles.categorySeparator}>
                + {boxData.get_selected_available_sport?.length - 2} more
              </Text>
            )}
          </View>
          {/* Bookmark icon */}
          <View style={boxCardStyles.bookMarkContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleBookmarkPress}>
              <Image
                source={
                  isBookmarked ? icons.heartIconFilled : icons.heartIconActive
                }
                style={[
                  boxCardStyles.bookmarkIcon,
                  !!isBookmarked && boxCardStyles.bookmarkIconToggled,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Details */}
        <View style={boxCardStyles.detailsContainer}>
          {/* First Row: Title, Rating, Address */}
          <View style={boxCardStyles.firstRow}>
            <View style={boxCardStyles.titleContainer}>
              <Text style={boxCardStyles.boxTitle} numberOfLines={2}>
                {boxData.title || 'Cricket Arena'}
              </Text>
              <Text style={boxCardStyles.address} numberOfLines={2}>
                {boxData.address || '123 Cricket Lane, Sportstown'}
              </Text>
            </View>
            <Text style={boxCardStyles.rating}>
              ⭐ {boxData?.avg_rating || 'N/A'}
            </Text>
          </View>
          {/* Second Row: Starting Price and Offers */}
          <View style={boxCardStyles.secondRow}>
            <Animated.View
              style={[
                boxCardStyles.offerContainer,
                {transform: [{scale: pulseAnim}]},
              ]}>
              <Image source={icons.offerIcon} style={boxCardStyles.offerIcon} />
              <Text style={boxCardStyles.offers}>{'Upto 30% Off'}</Text>
            </Animated.View>
            <Text style={boxCardStyles.price}>
              {' '}
              INR {boxData?.price_start_from || ' N/A '} Onwards
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default BoxCard;
