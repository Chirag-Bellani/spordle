import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/onboarding/onboardingScreen';
import Login from '../screens/login/login';
import Otp from '../screens/otp/otp';
import TermsAndCondition from '../screens/policy/termsAndCondition';
import PrivacyPolicy from '../screens/policy/privacyPolicy';
import ProfileName from '../screens/profile/profileName';
import {AuthStackParamList} from './navigationTypes';
import {FONTS} from '../constants/font';
import {TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const navigation = useNavigation();
  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false, animation: 'none'}}>
        <Stack.Screen
          name="OnboardingScreen"
          component={OnboardingScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="OTP"
          component={Otp}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndCondition}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ProfileName"
          component={ProfileName}
          options={{
            headerShown: true,
            title: 'Fill Out Your Profile',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: FONTS.inriaSansRegular,
              fontSize: 21,
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{paddingRight: 20}}>
                <Entypo name="chevron-thin-left" size={20} color="#000" />
              </TouchableOpacity>
            ),
            headerBackTitle: 'Back',
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
          }}
        />
      </Stack.Navigator>
    </>
  );
};

export default AuthStack;
