import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, StatusBar } from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';
import { useAuth } from '../../context/AuthContext';
import ButtonComp from '../../components/ButtonComp';
import HeaderComp from '../../components/HeaderComp';
import { AuthStackScreenProps } from '../../navigation/navigationTypes';
import { updateUserName } from '../../services';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/color';
import ToastUtil from '../../utils/toastUtil';
const ProfileNameScreen: React.FC<
  AuthStackScreenProps<'ProfileNameScreen'>
> = ({ navigation, route }) => {
  const { userDetail } = route.params || {};
  const insets = useSafeAreaInsets();

  const { login } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const handleNext = async () => {
    if (!firstName) {
      ToastUtil.error('Please enter your first name.');
      return;
    }
    try {
      const form = new FormData();
      form.append('user_id', String(userDetail.id));
      form.append('first_name', firstName);
      form.append('last_name', lastName);
      const response = await updateUserName(form);

      if (response.success) {
        await login(response.data);
      } else {
        ToastUtil.error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.log('CompleteProfile error', err);
      alert('Something went wrong.');
    } finally {
      ToastUtil.success('Profile updated successfully.');
    }
  };
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, marginBottom: insets.bottom > 24 ? insets.bottom : 0 }}
    >
      <View style={styles.container}>
        <HeaderComp headerText="Fill Out Your Profile" />
        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>
            Enter First Name <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <Text style={styles.label}>Enter Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        {/* Button */}
        <View
          style={[styles.buttonWrapper, { marginBottom: verticalScale(20) }]}
        >
          <ButtonComp
            btnText="NEXT"
            onPress={handleNext}
            disabled={!firstName}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default ProfileNameScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  headerWrapper: {
    backgroundColor: COLORS.secondary,
    paddingTop: StatusBar.currentHeight || verticalScale(20),
    shadowColor: COLORS.darkText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
  },
  backButton: { width: moderateScale(24) },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: scale(18),
    fontWeight: '600',
    color: COLORS.darkText,
    fontFamily: 'Inria Sans',
  },
  form: {
    flex: 1,
    marginTop: verticalScale(20),
    width: '85%',
    alignSelf: 'center',
  },
  label: {
    fontSize: scale(16),
    color: COLORS.lightText,
    marginBottom: verticalScale(6),
    marginTop: verticalScale(12),
    fontFamily: 'Nunito',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(16),
    fontSize: scale(14),
    backgroundColor: '#fafafa',
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: moderateVerticalScale(20),
  },
});
