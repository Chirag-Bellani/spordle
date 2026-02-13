import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { moderateScale, scale } from 'react-native-size-matters';
import HeaderComp from '../../components/HeaderComp';
import { useAuth, UserInfo } from '../../context/AuthContext';
import GoBack from '../../components/GoBack';
import { AppStackScreenProps } from '../../navigation/navigationTypes';
import { COLORS } from '../../constants/color';

import {
  User,
  Edit2,
  Settings,
  ShieldCheck,
  HelpCircle,
  UserX,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import NetInfoComponent from '../../components/NetInfoComponent';

interface OptionItemProps {
  icon: React.FC<{ size?: number; color?: string }>;
  title: string;
  onPress: () => void;
}

const ProfileScreen: React.FC<AppStackScreenProps<'ProfileScreen'>> = ({
  navigation,
}) => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<UserInfo | null>(user);

  useFocusEffect(
    useCallback(() => {
      
      if (user) {
        setProfileData(user);
      }
    }, [user]),
  );

  const getDisplayName = () => {
    if (profileData?.name) return profileData.name;
    const first = profileData?.first_name || profileData?.firstName || '';
    const last = profileData?.last_name || profileData?.lastName || '';
    return first || last ? `${first} ${last}`.trim() : 'User';
  };

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => navigation.navigate('DeleteAccountScreen'),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <NetInfoComponent  />
      <HeaderComp headerText="Account" />
      <GoBack />

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileInfo}>
          {profileData?.profile_pic ? (
            <Image
              source={{ uri: profileData.profile_pic }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={34} color="#aaa" />
            </View>
          )}

          <View style={styles.profileTextContainer}>
            <Text style={styles.nameText}>{getDisplayName()}</Text>
            <Text style={styles.phoneText}>
              {profileData?.mobile_no ||
                profileData?.mobileNo ||
                '+91 0000000000'}
            </Text>
            {!!profileData?.email && (
              <Text style={styles.emailText}>{profileData.email}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfileScreen')}
          style={styles.editIconButton}
        >
          <Edit2 size={22} color="#FF5A00" />
        </TouchableOpacity>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <OptionItem
          icon={Settings}
          title="Settings"
          onPress={() => navigation.navigate('SettingScreen')}
        />
        <Separator />

        <OptionItem
          icon={ShieldCheck}
          title="Privacy Policy"
          onPress={() => {}}
        />
        <Separator />

        <OptionItem
          icon={HelpCircle}
          title="Help & Support"
          onPress={() => {}}
        />
        <Separator />

        <OptionItem
          icon={UserX}
          title="Delete Account"
          onPress={handleDeleteAccount}
        />
        <Separator />

        <OptionItem icon={LogOut} title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};

const OptionItem: React.FC<OptionItemProps> = ({
  icon: Icon,
  title,
  onPress,
}) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <View style={styles.optionLeft}>
      <View style={styles.iconWrapper}>
        <Icon size={20} color={COLORS.primary} />
      </View>
      <Text style={styles.optionText}>{title}</Text>
    </View>
    <ChevronRight size={22} color="#ccc" />
  </TouchableOpacity>
);

const Separator = () => <View style={styles.separator} />;

export default ProfileScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:COLORS.secondary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(20),
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(16),
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#E6E6E6',
    elevation: moderateScale(2),
    shadowColor: COLORS.darkText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    marginRight: moderateScale(12),
  },
  profileTextContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: scale(15),
    fontWeight: '600',
    color: '#222',
  },
  phoneText: {
    fontSize: scale(13),
    color: '#666',
    marginTop: 2,
  },
  emailText: {
    fontSize: scale(12),
    color: '#999',
    marginTop: 2,
  },
  editIconButton: {
    padding: moderateScale(8),
  },
  optionsContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: COLORS.lightBorder,
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(12),
    paddingVertical: moderateScale(6),
    elevation: moderateScale(2),
    shadowColor: COLORS.darkText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: '#FFF4EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(14),
  },
  optionText: {
    fontSize: scale(15),
    color: '#222',
  },
  separator: {
    height: moderateScale(1),
    backgroundColor: '#EAEAEA',
    marginHorizontal: moderateScale(16),
  },
});
