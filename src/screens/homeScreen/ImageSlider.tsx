import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  ViewToken,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import imagePath from '../../constants/imagePath';

const { width } = Dimensions.get('window');

const carouselImages = [
  { id: '1', image: imagePath.scenic },
  { id: '2', image: imagePath.scenic },
  { id: '3', image: imagePath.scenic },
];

const ImageSlide = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken<{ id: string; image: number }>[];
    }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  /* ✅ AUTO SCROLL EVERY 4 SECONDS */
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={carouselImages}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <Image source={item.image} style={styles.image} resizeMode="cover" />
        )}
      />
    </View>
  );
};

export default ImageSlide;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBlock: verticalScale(20),
  },
  image: {
    width: width - moderateScale(18),
    height: verticalScale(140),
    borderRadius: moderateScale(12),
    marginHorizontal: moderateScale(8),
  },
});
