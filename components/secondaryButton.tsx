import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from '../constants/color';
import {FONTS} from '../constants/font';

interface PrimaryButtonProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  disabled?: boolean;
  onPress: () => void;
}

const SecondaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        // disabled ? styles.disabledButton : styles.enabledButton
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    marginVertical: verticalScale(20),
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: scale(15),
    fontFamily: FONTS.inriaSansBold,
    lineHeight: verticalScale(17),
    color: COLORS.primary,
  },
  disabledText: {
    color: COLORS.lightText,
    fontFamily: FONTS.nunitoSemiBold, // Lighter text when disabled
  },
});

export default SecondaryButton;
