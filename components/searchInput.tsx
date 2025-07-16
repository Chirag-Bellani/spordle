import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../constants/color';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { FONTS } from '../constants/font';


interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
const SearchInput:React.FC<SearchInputProps> = ({ value, onChangeText,onFocus,onBlur}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Clear input text and re-focus the input (keeps keyboard open)
  const handleClear = () => {
    onChangeText(''); // Update parent state
    if (inputRef.current) {
      inputRef.current.clear();
      // Delay the focus call to ensure the keyboard stays open.
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 100);
    }
  };

  // Decide which icon to show: search or close
  const showClearIcon = isFocused && value && value.length > 0;
  const iconName = showClearIcon ? 'close' : 'search1';

  // If the clear icon is shown, then clear text on press, otherwise call onSearchPress if provided.
  const handleIconPress = () => {
    if (showClearIcon) {
      handleClear();
    } 
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Search"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          setIsFocused(true);
          if (onFocus) onFocus(); // Trigger the onFocus prop
        }}
        onBlur={() => {
          setIsFocused(false);
          if (onBlur) onBlur(); // Trigger the onBlur prop
        }}
        placeholderTextColor={COLORS.lightText}
      />
      <TouchableOpacity style={styles.iconContainer} onPress={handleIconPress}>
        <AntDesign name={iconName} size={22} color={COLORS.borderColor} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.lightBorder,
    borderWidth: 1,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(3),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
  },
  input: {
    flex: 1,
    color: COLORS.darkText,
    fontSize: moderateScale(15),
    fontFamily: FONTS.nunitoMedium,
    minHeight: verticalScale(30),
  },
  iconContainer: {
    padding: 4,
  },
});
