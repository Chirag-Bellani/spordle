import { createNativeStackNavigator } from '@react-navigation/native-stack';
import navigationString from '../constants/navigationString';
import OnboardingScreen from '../screens/onBoarding/OnBoarding';
import LoginScreen from '../screens/login/Login';
import { AuthStackParamList } from './navigationTypes';
import OtpScreen from '../screens/otpScreen/OtpScreen';
import ProfileNameScreen from '../screens/profile/ProfileNameScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={navigationString.ONBOARDING}
        component={OnboardingScreen}
      />
      <Stack.Screen
        name={navigationString.LOGINSCREEN}
        component={LoginScreen}
      />
      <Stack.Screen name={navigationString.OTPSCREEN} component={OtpScreen} />
      <Stack.Screen
        name={navigationString.PROFILENAMESCREEN}
        component={ProfileNameScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
