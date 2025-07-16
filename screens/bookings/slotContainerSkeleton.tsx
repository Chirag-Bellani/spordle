import React from 'react';
import { View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SlotContainerSkeleton = () => (
    <SkeletonPlaceholder backgroundColor="#e0e0e0" highlightColor="#f5f5f5" speed={1000}>
  <View
    style={{
      marginTop: verticalScale(10),
      paddingHorizontal: scale(16),
      paddingBottom: verticalScale(12),
    }}
  >
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View>
    
        <View style={{ width: scale(120), height: verticalScale(16), borderRadius: 4 }} />
        <View style={{ width: scale(24), height: verticalScale(24), marginTop: verticalScale(5), borderRadius: 12 }} />
        </View>
        <View
          style={{
            width: '53%',
            height: verticalScale(75),
            borderRadius: moderateScale(10),
          }}
        />
    
    </View>
  </View>
  </SkeletonPlaceholder>
);

export default SlotContainerSkeleton;
