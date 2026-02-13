import React, { FC } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { COLORS } from '../constants/color';

interface TextInputCompProps {
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  onChangeText?: (text: string) => void;
  value?: string;
  maxLength?: number;
}

const TextInputComp: FC<TextInputCompProps> = ({
  placeholder,
  keyboardType,
  onChangeText,
  value,
  maxLength,
}) => {
  return (
    <View style={styles.textStyle}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        value={value}
        maxLength={maxLength}
      />
    </View>
  );
};

export default TextInputComp;

const styles = StyleSheet.create({
  textStyle: {
    width: '90%',
    backgroundColor: 'white',
    height: verticalScale(50),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:COLORS.lightText,
    borderWidth: 1,
  },
  inputText: {
    fontSize: moderateScale(16),
    fontFamily: 'Nunito',
    color: '#969696ff',
    fontWeight: '600',
    marginBottom: moderateScale(8),
  },
  countryCodeText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: moderateScale(10),
    gap: moderateScale(5),
  },
  input: {
    fontSize: moderateScale(16),
    marginRight: moderateScale(200),
  },
});
