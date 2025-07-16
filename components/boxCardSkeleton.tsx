import { View, Text } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { scale, verticalScale } from 'react-native-size-matters';

const BoxCardSkeleton = () => {
  return (
    <SkeletonPlaceholder backgroundColor="#e0e0e0" highlightColor="#f5f5f5" speed={1000}>
      <View
        style={{
          borderRadius: scale(10),
          paddingHorizontal:scale(8),
          alignSelf:'center',
          marginVertical:verticalScale(20)
        }}
      >
        {/* Image Slider Placeholder */}
        <View style={{ height: verticalScale(130), borderRadius: scale(8) }} />

        {/* Details Placeholder */}
        <View style={{ padding: scale(12) }}>
          {/* Title & Rating */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: verticalScale(6),
            }}
          >
            <View style={{ width: '70%', height: verticalScale(16), borderRadius: scale(4) }} />
            <View style={{ width: '20%', height: verticalScale(16), borderRadius: scale(4) }} />
          </View>

          {/* Address Placeholder */}
          <View style={{ width: '70%', height: verticalScale(14), borderRadius: scale(4), marginBottom: verticalScale(6) }} />
          <View style={{ width: '60%', height: verticalScale(14), borderRadius: scale(4), marginBottom: verticalScale(12) }} />

          {/* Offers & Price Placeholder */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ width: '40%', height: verticalScale(14), borderRadius: scale(4) }} />
            <View style={{ width: '30%', height: verticalScale(14), borderRadius: scale(4) }} />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default BoxCardSkeleton;
