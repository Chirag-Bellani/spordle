import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import HeaderComp from '../../components/HeaderComp';
import { moderateScale, scale } from 'react-native-size-matters';
import GoBack from '../../components/GoBack';
import { COLORS } from '../../constants/color';
import NetInfoComponent from '../../components/NetInfoComponent';

const SettingScreen = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <NetInfoComponent />
      <HeaderComp headerText="Settings" />
      <GoBack />

      <View style={styles.card}>
        {/* Push Notifications */}
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Push Notifications</Text>
          <Switch
            trackColor={{ false: '#E5E5E5', true: '#FFD7C2' }}
            thumbColor={pushEnabled ? '#FF5A00' : '#f4f3f4'}
            ios_backgroundColor="#E5E5E5"
            onValueChange={() => setPushEnabled(!pushEnabled)}
            value={pushEnabled}
          />
        </View>

        <View style={styles.separator} />

        {/* SMS Notifications */}
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>SMS Notifications</Text>
          <Switch
            trackColor={{ false: '#E5E5E5', true: '#FFD7C2' }}
            thumbColor={smsEnabled ? '#FF5A00' : '#f4f3f4'}
            ios_backgroundColor="#E5E5E5"
            onValueChange={() => setSmsEnabled(!smsEnabled)}
            value={smsEnabled}
          />
        </View>
      </View>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(20),
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(16),
  },
  settingText: {
    fontSize: scale(15),
    color: '#222',
  },
  separator: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginHorizontal: moderateScale(12),
  },
});
