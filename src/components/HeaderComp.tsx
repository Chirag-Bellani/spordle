import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS } from '../constants/color';

/* ---------- Props Type ---------- */
interface HeaderCompProps {
  headerText: string;
}

/* ---------- Component ---------- */
const HeaderComp: React.FC<HeaderCompProps> = ({ headerText }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.headerWrapper}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={moderateScale(24)} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{headerText}</Text>

        {/* Placeholder to keep title centered */}
        <View style={{ width: moderateScale(24) }} />
      </View>
    </View>
  );
};

export default HeaderComp;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: moderateScale(15),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(10),
    backgroundColor: COLORS.secondary,
    elevation: 3,
    height: verticalScale(80),
    shadowColor: COLORS.darkText,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    width: moderateScale(24),
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: scale(18),
    fontWeight: '600',
    color: COLORS.darkText,
    fontFamily: 'Inria Sans',
  },
});
