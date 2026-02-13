import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { X } from 'lucide-react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { COLORS } from '../constants/color';

interface BackCompProps {
  navigation?: NavigationProp<ParamListBase>;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
}

const BackComp: React.FC<BackCompProps> = ({ navigation, onPress, style }) => {
  const handleClose = () => {
    if (onPress) {
      onPress();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.closeButton, style]}
      onPress={handleClose}
      activeOpacity={0.7}
    >
      <X size={25} color="#181919" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    bottom: verticalScale(20),
    right: moderateScale(20),
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 5,
  },
}); 

export default BackComp;
