import {View, Text, Image, StyleProp,ViewStyle} from 'react-native';
import React, {useMemo} from 'react';
import mainStyles from '../assets/styles/mainStyles';
import {images} from '../constants/image';
import {moderateVerticalScale, scale, verticalScale, } from 'react-native-size-matters';

interface NoDataContainerProps {
  style?: StyleProp<ViewStyle>;  
  noDataText?: string;
}

const NoDataContainer:React.FC<NoDataContainerProps> = ({style,noDataText}) => {
  const randomImage = useMemo(() => {
    const noDataImages = [images.noData1, images.noData2, images.noData3];
    return noDataImages[Math.floor(Math.random() * noDataImages.length)];
  }, []);

  return (
    <View
      style={[
        {flex: 1, justifyContent: 'center', alignItems: 'center', width: '90%'},
        style,
      ]}>
      <Image
        source={randomImage}
        style={{
          height: moderateVerticalScale(170),
          width: scale(200),
          resizeMode: 'contain',
        }}
      />

      <Text
        style={[
          mainStyles.fontNunitoMedium,
          mainStyles.fontSize18,
          mainStyles.darkTextColor,
        ]}>
        {' '}
        Data Not found!!..
      </Text>

      <Text
        style={[
          mainStyles.fontNunitoMedium,
          mainStyles.fontSize14,
          mainStyles.lightTextColor,
          {textAlign: 'center'},
        ]}>
       {noDataText}
        
      </Text>
    </View>
  );
};

export default NoDataContainer;
