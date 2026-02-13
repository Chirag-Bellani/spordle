import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { COLORS } from '../constants/color';
import { Search } from 'lucide-react-native';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  containerStyle?: ViewStyle | ViewStyle[];
  inputStyle?: TextStyle | TextStyle[];
  iconStyle?: TextStyle | TextStyle[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search',
  value,
  onChangeText,
  containerStyle,
  inputStyle,
  iconStyle,
}) => {
  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.lightText}
        style={[styles.searchInput, inputStyle]}
        value={value}
        onChangeText={onChangeText}
      />
      <Search style={[styles.searchIcon, iconStyle]} />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: verticalScale(40),
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    marginVertical: moderateScale(10),
    borderColor: COLORS.lightBorder,
    borderWidth: moderateScale(1),
    backgroundColor: COLORS.secondary,
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: 'Nunito',
    color: COLORS.darkText,
    fontWeight: '500',
    paddingVertical: 1,
  },
  searchIcon: {
    color: COLORS.borderColor,
    fontSize: moderateScale(24),
    marginLeft: moderateScale(8),
  },
});
