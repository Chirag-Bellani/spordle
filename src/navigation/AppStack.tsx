import { createNativeStackNavigator } from '@react-navigation/native-stack';
import navigationString from '../constants/navigationString';
import NotificationScreen from '../screens/notificationScreen/NotificationScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import LocationScreen from '../screens/locationScreen/LocationScreen';
import BottomTab from './BottomTab';
import BoxDetails from '../screens/boxDetails/BoxDetail';
import ReviewScreen from '../screens/clientReview/ReviewScreen';
import BookSlotScreen from '../screens/bookSlot/BookSlotScreen';
import ConfirmationBookingScreen from '../screens/confirmationBooking/ConfirmationBookingScreen';
import BookingDetailScreen from '../screens/bookingDetails/BookingDetailScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import DeleteAccountScreen from '../screens/profile/DeleteAccountScreen';
import SettingScreen from '../screens/profile/SettingScreen';
import HeaderComp from '../components/HeaderComp';
import { AppStackParamList } from './navigationTypes';
import SportFilterScreen from '../screens/homeScreen/SportFilterScreen';
import AddRatingAndReview from '../screens/clientReview/addRatingAndReview';
import EnableLocation from '../screens/locationScreen/EnableLocation';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native'; 
import { COLORS } from '../constants/color'; 

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  const { isLocation, isLoading } = useAuth(); 

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondary }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const hasLocationPermission =
    !!isLocation?.latitude && !!isLocation?.longitude && !!isLocation?.address;

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }} 
      initialRouteName={hasLocationPermission ? navigationString.BOTTOMTAB : navigationString.ENABLELOCATION}
    >
      <Stack.Screen
        name={navigationString.ENABLELOCATION}
        component={EnableLocation}
      />
      <Stack.Screen name={navigationString.BOTTOMTAB} component={BottomTab} />

      <Stack.Screen
        name={navigationString.NOTIFICATION}
        component={NotificationScreen}
      />

      <Stack.Screen
        name={navigationString.PROFILESCREEN}
        component={ProfileScreen}
      />

      <Stack.Screen
        name={navigationString.LOCATION}
        component={LocationScreen}
      />
      <Stack.Screen name={navigationString.BOXDETAILS} component={BoxDetails} />
      <Stack.Screen name={navigationString.REVIEW} component={ReviewScreen} />

      <Stack.Screen
        name={navigationString.BOOKSLOTSCREEEN}
        component={BookSlotScreen}
      />

      <Stack.Screen
        name={navigationString.CONFIRMATIONBOOKINGSCREEN}
        component={ConfirmationBookingScreen}
      />

      <Stack.Screen
        name={navigationString.BOOKINGDETAILSCREEN}
        component={BookingDetailScreen}
      />

      <Stack.Screen
        name={navigationString.EDITPROFILESCREEN}
        component={EditProfileScreen}
      />

      <Stack.Screen
        name={navigationString.SETTINGSCREEN}
        component={SettingScreen}
      />

      <Stack.Screen
        name={navigationString.DELETEACCOUNTSCREEN}
        component={DeleteAccountScreen}
        options={{
          headerShown: true,
          header: () => <HeaderComp headerText="Delete My Account" />,
        }}
      />
      <Stack.Screen
        name={navigationString.SPORTFILTERSCREEN}
        component={SportFilterScreen}/>

      <Stack.Screen
        name={navigationString.ADDRATINGANDREVIEW}
        component={AddRatingAndReview}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
