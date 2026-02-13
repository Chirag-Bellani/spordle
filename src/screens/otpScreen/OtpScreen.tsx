import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ImageComp from '../../components/ImageComp';
import {
  moderateScale,
  verticalScale,
  moderateVerticalScale,
} from 'react-native-size-matters';
import { OtpInput } from 'react-native-otp-entry';
import BackComp from '../../components/BackComp';
import ButtonComp from '../../components/ButtonComp';
import StatusComp from '../../components/StatusComp';
import { useAuth } from '../../context/AuthContext';
import { authenticateUser, sendOTP } from '../../services';
import { AuthStackScreenProps } from '../../navigation/navigationTypes';
import { COLORS } from '../../constants/color';
import ToastUtil from '../../utils/toastUtil';

const OtpScreen: React.FC<AuthStackScreenProps<'OtpScreen'>> = ({
  route,
  navigation,
}) => {
  const { mobileNo ,serverOtp } = route.params || {};

  const [otp, setOtp] = useState('');

  const [timer, setTimer] = useState(120);
  const [isResendActive, setIsResendActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  /** ✅ OTP must be exactly 4 digits */
  const isOtpValid = otp.toString().length === 4 || null;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else {
      setIsResendActive(true);
    }
    return () => interval && clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (!isOtpValid) return;
    if (otp !== serverOtp) {
      ToastUtil.error('Invalid OTP. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('mobile_no', mobileNo);
      // form.append('role', 3); // app user

      const data = await authenticateUser(form);
     

      if (data?.success) {
        const user = data.data;
        if (user.user === 'New' || !user.first_name) {
          navigation.replace('ProfileNameScreen', { userDetail: user });
        } else {
          await login(user);
        }
      } else {
        Alert.alert('Error', data.message || 'OTP verification failed.');
      }
    } catch (err) {
      console.log('handleVerify error', err);
      Alert.alert('Network Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isResendActive) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append('mobile_no', mobileNo);

      const data = await sendOTP(form);
    

      if (data?.success) {
        setTimer(120);
        setIsResendActive(false);
        Alert.alert('OTP Sent', `OTP resent to +91 ${mobileNo}`);
      } else {
        Alert.alert('Error', data.message || 'Could not resend OTP.');
      }
    } catch (err) {
      console.log('resend error', err);
      Alert.alert('Network Error', 'Unable to resend OTP now.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <>
      <View style={styles.imageSection}>
        <BackComp navigation={navigation} />
        <ImageComp />
        <StatusComp />
      </View>

      <View style={styles.container}>
        <Text style={styles.heading}>You're So Close!</Text>
        <View style={styles.inputHeader}>
          <Text style={styles.inputLabel}>
            Enter OTP<Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.phoneText}>+91 {mobileNo}</Text>
        </View>

        <OtpInput
          numberOfDigits={4}
          onTextChange={setOtp}
          focusColor="#007AFF"
          theme={{
            containerStyle: styles.otpInputContainer,
            pinCodeContainerStyle: styles.otpBox,
            pinCodeTextStyle: styles.otpText,
          }}
        />

        {loading && (
          <ActivityIndicator
            size="large"
            color="red"
            style={{ marginTop: 10, marginBottom: 10 }}
          />
        )}

        <View
          style={{
            alignItems: 'center',
            marginTop: moderateVerticalScale(20),
            width: '100%',
          }}
        >
          <ButtonComp
            btnText="VERIFY"
            onPress={handleVerify}
            disabled={!isOtpValid || loading}
            btnStyle={{
              backgroundColor: isOtpValid ? COLORS.primary : '#D3D3D3',
            }}
          />
        </View>

        <View style={styles.resendContainer}>
          {isResendActive ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>RESEND OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend OTP in {formatTime(timer)}
            </Text>
          )}
        </View>
      </View>
    </>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  imageSection: { minHeight: verticalScale(200) },
  container: {
    flex: 2,
    borderTopLeftRadius: moderateScale(40),
    borderTopRightRadius: moderateScale(40),
    backgroundColor: 'white',
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateVerticalScale(30),
    alignItems: 'center',
  },
  heading: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: verticalScale(20),
    alignSelf: 'flex-start',
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: verticalScale(15),
  },
  inputLabel: {
    fontSize: moderateScale(16),
    color: '#969696ff',
    fontWeight: '600',
    marginBottom: moderateScale(8),
  },
  required: { color: 'red' },
  phoneText: { fontSize: moderateScale(14), color: '#555' },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  otpInputContainer: { justifyContent: 'space-between', width: '90%' },
  otpBox: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: moderateScale(8),
    width: moderateScale(45),
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  otpText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#000',
  },
  resendContainer: {
    marginTop: moderateScale(15),
    alignItems: 'center',
  },
  resendText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: 'red',
  },
  timerText: {
    fontSize: moderateScale(15),
    color: '#919191',
    fontWeight: '600',
  },
});
