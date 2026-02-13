import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import ImageComp from '../../components/ImageComp';
import {
  moderateScale,
  verticalScale,
  moderateVerticalScale,
} from 'react-native-size-matters';
import imagePath from '../../constants/imagePath';
import ButtonComp from '../../components/ButtonComp';
import BackComp from '../../components/BackComp';
import StatusComp from '../../components/StatusComp';
import { AuthStackScreenProps } from '../../navigation/navigationTypes';
import { sendOTP } from '../../services';
import { COLORS } from '../../constants/color';
const LoginScreen: React.FC<AuthStackScreenProps<'LoginScreen'>> = ({
  navigation,
}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert('Invalid', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('mobile_no', mobileNumber);

      const data = await sendOTP(form);
      console.log(data,"data")
      if (data && (data.success === true || data.status === 200)) {
        navigation.navigate('OtpScreen', {
          mobileNo: mobileNumber,
          serverOtp: (data.data.verify_otp || '').toString(),
        });
      } else {
        Alert.alert(
          'Error',
          data.message || 'Unable to send OTP. Please try again.',
        );
      }
    } catch (error) {
      console.log('handleSendOtp error', error);
      Alert.alert('Network Error', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) setMobileNumber(cleaned);
  };

  const isValid = agree && mobileNumber.length === 10;

  return (
    <>
      <View style={styles.imageSection}>
        <BackComp navigation={navigation} />
        <ImageComp />
        <StatusComp />
      </View>

      <View style={styles.container}>
        <Text style={styles.text}>You're So Close!</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>
            Enter Phone Number<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <View style={styles.btnStyle}>
            <View style={styles.countryCodeText}>
              <Text>+91</Text>
              <Image
                style={{ width: moderateScale(20), height: verticalScale(15) }}
                source={imagePath.indiaFlag}
              />
              <Text style={styles.separator}>|</Text>
              <TextInput
                style={styles.input}
                placeholder="0123-456-789"
                keyboardType="phone-pad"
                onChangeText={handleMobileChange}
                value={mobileNumber}
                maxLength={10}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              value={agree}
              onValueChange={setAgree}
              style={styles.checkbox}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.link}>Terms of Service</Text>{' '}
                & <Text style={styles.link}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              marginTop: moderateVerticalScale(20),
            }}
          >
            {loading && (
              <ActivityIndicator
                size="large"
                color="red"
                style={{ marginTop: 10, marginBottom: 10 }}
              />
            )}

            <ButtonComp
              btnText={loading ? 'SEND OTP' : 'SEND OTP'}
              onPress={handleSendOtp}
              disabled={!isValid || loading}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  imageSection: {
    minHeight: verticalScale(200),
  },
  container: {
    flex: 2,
    borderTopLeftRadius: moderateScale(50),
    borderTopRightRadius: moderateScale(50),
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  text: {
    fontSize: moderateScale(22),
    fontFamily: 'Inria Sans',
    fontWeight: 'bold',
    color: COLORS.darkText,
    letterSpacing: moderateScale(0.7),
    marginLeft: moderateVerticalScale(20),
    marginTop: moderateVerticalScale(30),
  },
  inputContainer: {
    marginLeft: moderateVerticalScale(28),
    marginTop: moderateVerticalScale(25),
  },
  btnStyle: {
    width: '90%',
    backgroundColor: 'white',
    height: verticalScale(50),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  },
  inputText: {
    fontSize: moderateScale(16),
    fontFamily: 'Nunito',
    color: COLORS.lightText,
    fontWeight: '600',
    marginBottom: moderateScale(8),
  },
  countryCodeText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: moderateScale(10),
    gap: moderateScale(5),
    width: '100%',
  },
  separator: {
    color: COLORS.borderColor,
    fontSize: moderateScale(30),
    marginHorizontal: moderateVerticalScale(12),
    marginBottom: moderateScale(7),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(16),
    marginLeft: moderateScale(8),
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: moderateScale(15),
    marginRight: moderateScale(40),
  },
  checkbox: {
    marginRight: moderateScale(10),
  },
  termsText: {
    fontSize: moderateScale(14),
    color: '#333',
    flexShrink: 1,
    flexWrap: 'wrap',
    fontStyle: 'italic',
    fontWeight: '600',
    fontFamily: 'Nunito',
  },
  link: {
    color: COLORS.linkingColor,
    textDecorationLine: 'underline',
    fontFamily: 'Nunito',
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
});
