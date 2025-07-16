// CustomCheckBox.js
import React from 'react';
import { TouchableOpacity, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Icon } from 'react-native-elements';
import { moderateScale, moderateVerticalScale, scale, verticalScale } from 'react-native-size-matters';
import mainStyles from '../assets/styles/mainStyles';

const CustomCheckBox: React.FC<{
  value?: boolean;
  onValueChange?: (newValue: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ value = false, onValueChange = () => {}, disabled = false, style }) => {
  
  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.checkBoxSquare,
          mainStyles.primaryBorderColor,
          value && mainStyles.successBackgroudColor,
          style
        ]}
      >
        {value && (
          <Icon
            type="material-community"
            name="check"
            color="#FFF"
            size={20}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomCheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxSquare: {
    width: moderateScale(20),
    height: moderateVerticalScale(20),
    borderWidth: 1,
    borderRadius: moderateScale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});
