import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  moderateScale,
  verticalScale,
  scale,
} from 'react-native-size-matters';
import { COLORS } from '../constants/color';

/* -------------------- TYPES -------------------- */

interface PolicyItem {
  text: string;
}

interface CancelPolicyCompProps {
  policyList?: PolicyItem[];
}

/* -------------------- COMPONENT -------------------- */

const CancelPolicyComp: React.FC<CancelPolicyCompProps> = ({
  policyList = [],
}) => {
  return (
    <View style={styles.form}>
      <Text style={styles.offerTxt}>Cancellation Policy</Text>

      {Array.isArray(policyList) && policyList.length > 0 ? (
        <View style={styles.policyList}>
          {policyList.map((policy: PolicyItem, index: number) => (
            <View style={styles.policyRow} key={index}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.policyText}>{policy.text}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noSportText}>
          No cancellation policy available
        </Text>
      )}
    </View>
  );
};

export default CancelPolicyComp;

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  form: {
    flex: 1,
    marginTop: verticalScale(20),
    width: '95%',
    alignSelf: 'center',
  },
  offerTxt: {
    fontFamily: 'nunito',
    fontSize: scale(14),
    color: COLORS.darkText,
    fontWeight: '600',
    letterSpacing: scale(1),
  },
  policyList: {
    marginTop: verticalScale(8),
    paddingLeft: moderateScale(10),
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(4),
  },
  bullet: {
    fontSize: scale(16),
    color: COLORS.darkText,
    marginRight: moderateScale(6),
    lineHeight: scale(20),
  },
  policyText: {
    fontSize: scale(14),
    color: COLORS.lightText,
    fontWeight: '400',
    flexShrink: 1,
    lineHeight: scale(20),
  },
  noSportText: {
    fontSize: scale(14),
    color: COLORS.lightText,
    marginTop: verticalScale(8),
  },
});
