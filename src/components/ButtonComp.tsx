import React from 'react';
import {
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { COLORS  }from '../constants/color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ButtonCompProps {
  btnText?: string;
  btnStyle?: ViewStyle | ViewStyle[];
  btnTextStyle?: TextStyle | TextStyle[];
  onPress?: () => void;
  img?: ImageSourcePropType;
  disabled?: boolean;
}

const ButtonComp: React.FC<ButtonCompProps> = ({
  btnText = '',
  btnStyle = {},
  btnTextStyle = {},
  onPress = () => {},
  img,
  disabled = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.btnStyle,
        disabled && styles.buttonDisabled,
        btnStyle,
      ]}
    >
      {img ? (
        <Image source={img} style={{ tintColor: COLORS.secondary }} />
      ) : (
        <Text
          style={[
            styles.btnTextStyle,
            disabled && styles.disabledText,
            btnTextStyle,
          ]}
        >
          {btnText}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    width: '100%',
    maxWidth: moderateScale(300),
    height: verticalScale(40),
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(6),
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
    shadowColor: '#000',
  },
  btnTextStyle: {
    fontSize: moderateScale(18),
    fontFamily: 'Inria Sans',
    fontWeight: 'bold',
    color: COLORS.secondary,
    letterSpacing: moderateScale(1),
  },
  disabledText: {
    color: COLORS.lightText,
  },
});

export default ButtonComp;
