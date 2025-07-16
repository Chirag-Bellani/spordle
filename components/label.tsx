import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../constants/color';
import { FONTS } from '../constants/font';

interface LabelProps{
  text:string;
  required:boolean;
}
const Label:React.FC<LabelProps> = ({ text, required = false }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{text}</Text>
      {required ? (
        <Text style={styles.requiredText}>*</Text>
      ) : (
        <Text style={styles.optionalText}>(Optional)</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(5),
  },
  label: {
    fontFamily: FONTS.nunitoSemiBold,
    fontSize: scale(13),
    color: COLORS.lightText,
  },
  requiredText: {
    color: 'red',
    fontSize: scale(14),
    marginLeft: scale(3),
  },
  optionalText: {
    color: COLORS.lightText,
    fontSize: scale(12),
    marginLeft: scale(5),
  },
});

export default Label;
