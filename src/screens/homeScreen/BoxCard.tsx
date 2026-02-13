import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useAuth } from '../../context/AuthContext';
import { icon } from '../../constants/icon';
import { COLORS } from '../../constants/color';
import { Heart, Star } from 'lucide-react-native';
import { bookMark } from '../../services';
import { Sport } from '../../types/sport';

const { width } = Dimensions.get('window');

interface BoxCardProps {
  boxId: number;
  images?: string[];
  title?: string;
  location?: string;
  rating?: number | null;
  discount?: string;
  price?: string;
  bookable?: boolean;
  sports?: Sport[];
  isBookmarked?: boolean;
  onBookmarkChange?: (boxId: number, isBookmarked: boolean) => void;
}

const BoxCard: React.FC<BoxCardProps> = ({
  boxId,
  images = [],
  title = 'No Title',
  location = 'No Address',
  rating = null,
  discount = 'Upto 30% Off',
  price = 'Price on request',
  bookable = false,
  sports = [],
  isBookmarked = false,
  onBookmarkChange,
}) => {
  const { updateBookmark } = useAuth();
console.log(sports,"sports")
  const [fav, setFav] = useState<boolean>(isBookmarked);
  const [loading, setLoading] = useState<boolean>(false);

  // Animated value for discount badge
  const discountAnim = useRef(new Animated.Value(0)).current;

  // Start discount animation loop
  const startDiscountAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(discountAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(discountAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  useEffect(() => {
    startDiscountAnimation();
  }, []);

  // Sync local favorite state with prop changes
  useEffect(() => {
    setFav(isBookmarked);
  }, [isBookmarked]);

  // Toggle favorite / bookmark
  const handleFavoriteToggle = async (): Promise<void> => {
    if (loading) return;

    const newFavState = !fav;

    try {
      setLoading(true);
      setFav(newFavState);

      const formData = new FormData();
      formData.append('box_id', String(boxId));
      formData.append('is_bookmark', newFavState ? '0' : '1');

      const response = await bookMark(formData);

      if (response?.success) {
        updateBookmark(boxId, newFavState);
        if (onBookmarkChange) {
          onBookmarkChange(boxId, newFavState);
        }
        const message = newFavState
          ? ' Added to bookmarks!'
          : ' Removed from bookmarks';
      } else {
        setFav(!newFavState);
        Alert.alert('Error', response?.message || 'Failed to update bookmark');
      }
    } catch (error) {
      setFav(!newFavState);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
     
      <View style={styles.imageContainer}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          autoplay
          autoplayTimeout={3}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          paginationStyle={{ bottom: 8 }}
        >
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
 <View style={{ position: 'absolute',
    alignSelf: 'flex-start',
    bottom: verticalScale(5),
    left: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),}}>
            {sports?.slice(0, 2)
              .map((sport:Sport, index:number) => (
                <React.Fragment key={sport?.id}>
                  <Image
                    source={{uri: sport?.get_single_sports?.icon}}
                    style={{  width: moderateScale(15),
    height: moderateScale(15)}}
                  />
                  {index === 0 && (
                    <Text style={{ color: COLORS.secondary,
    fontSize: moderateScale(12),}}>|</Text>
                  )}
                </React.Fragment>
              ))}

            {sports.length > 2 && (
              <Text style={{ color: COLORS.secondary,
    fontSize: moderateScale(12),}}>
                + {sports?.length - 2} more
              </Text>
            )}
          </View>
        {/* Bookable Badge */}
        {bookable && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Bookable</Text>
          </View>
        )}

        {/* Favorite / Heart Icon */}
        <TouchableOpacity
          style={styles.favIcon}
          onPress={handleFavoriteToggle}
          disabled={loading}
        >
          {loading ? (
            <Text style={{ color: COLORS.secondary, fontSize: 18 }}>⏳</Text>
          ) : (
            <Heart
              size={24}
              color={fav ? COLORS.primary : COLORS.secondary}
              fill={fav ? COLORS.primary : 'none'}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {rating !== null && rating > 0 ? (
            <View style={styles.ratingBox}>
              <Star size={14} color={COLORS.secondary} />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          ) : (
            <Text style={styles.noRating}>No Rating</Text>
          )}
        </View>
        <Text style={styles.location} numberOfLines={2}>
          {location}
        </Text>
      </View>

      {/* Footer: Discount + Price */}
      <View style={styles.footer}>
        <Animated.View
          style={[
            styles.discountCard,
            {
              transform: [
                {
                  scale: discountAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.1, 0.9],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            style={{ width: moderateScale(25), height: moderateScale(25) }}
            source={icon.offerIcon}
          />
          <Text style={styles.discount}>{discount}</Text>
        </Animated.View>
        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  );
};

export default BoxCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(10),
    shadowColor: COLORS.darkText,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: verticalScale(180),
  },
  image: {
    width: width - moderateScale(30),
    height: '100%',
    borderRadius: 8,
  },
  wrapper: {},
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
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'orange',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  badgeText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  favIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 6,
    minWidth: 36,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    padding: moderateScale(10),
    backgroundColor: COLORS.secondary,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    flex: 1,
    marginRight: 8,
  },
  location: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
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
    fontWeight: '600',
  },
  noRating: {
    fontSize: 12,
    color: '#888',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: COLORS.lightBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(10),
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
  },
  discount: {
    color: COLORS.success,
    fontWeight: '600',
    fontSize: 12,
    marginLeft: moderateScale(8),
  },
  price: {
    fontWeight: '600',
    color: COLORS.darkText,
    fontSize: 14,
  },
  discountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
