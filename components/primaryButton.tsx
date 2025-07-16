import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {COLORS} from '../constants/color';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import mainStyles from '../assets/styles/mainStyles';

interface PrimaryButtonProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  disabled?: boolean;
  onPress: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  disabled,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled ? styles.disabledButton : styles.enabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text
        style={[
          mainStyles.fontSize16,
          mainStyles.fontInriaSansBold,
          mainStyles.secondaryTextColor,
          disabled && mainStyles.lightTextColor,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: moderateVerticalScale(13, 0.8),
    width: '95%',
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  enabledButton: {
    backgroundColor: COLORS.primary,
    elevation: 7,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled, // Light gray for disabled state
    elevation: 0, // Removes shadow
    shadowColor: 'transparent', // Ensures no shadow effect
  },
});

export default PrimaryButton;
