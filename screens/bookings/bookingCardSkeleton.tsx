import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'; 

const BookingCardSkeleton = () => (
  <SkeletonPlaceholder backgroundColor="#e0e0e0" highlightColor="#f5f5f5" speed={1000}>
    
     <View style={{ width: '97%',
          height: verticalScale(112),
          borderRadius: moderateScale(8),
          marginTop:verticalScale(20),
          marginHorizontal:scale(10)}}
          >
    </View>
  </SkeletonPlaceholder>
);

export default BookingCardSkeleton;
