import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';
import {COLORS} from '../constants/color';
import {FONTS} from '../constants/font';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';

interface TextInputComponentProps extends TextInputProps {
  value: string;
  label?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  error?: boolean;
  required?: boolean;
  errorLabel?: string;
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({
  value,
  label,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  maxLength,
  error,
  style,
  required = false,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      {/* Text Input */}
      <TextInput
        style={[styles.input, style, error ? styles.inputError : {}]}
        value={value}
        onChangeText={onChangeText}
        onBlur={props.onBlur} // Ensure onBlur can be passed down from react-hook-form
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        placeholderTextColor={COLORS.lightText}
        {...props} // Spread additional props (e.g., autoCapitalize, returnKeyType)
      />

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(7),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    width: '100%',
  },
  label: {
    fontFamily: FONTS.nunitoSemiBold,
    fontSize: scale(13),
    color: COLORS.lightText,
    marginBottom: verticalScale(6),
  },
  required: {
    color: COLORS.errorColor,
  },
  input: {
    height: verticalScale(44),
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(10),
    fontSize: scale(13),
    color: COLORS.darkText,
    fontFamily: FONTS.nunitoMedium,
  },
  inputError: {
    borderColor: COLORS.errorColor,
  },
  errorText: {
    color: COLORS.errorColor,
    fontSize: scale(12),
    marginTop: verticalScale(5),
    fontFamily: FONTS.nunitoRegular,
  },
});

export default TextInputComponent;
