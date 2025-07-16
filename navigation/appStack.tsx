import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';

import BottomNav from './bottomNav';
import ProfileScreen from '../screens/profile/profileScreen';
import NotificationScreen from '../screens/notification/notificationScreen';
import ClientReview from '../screens/clientReview/clientReview';
import EditProfile from '../screens/profile/editProfile';
import SettingsScreen from '../screens/profile/settings';
import DeleteAccount from '../screens/profile/deleteAccount';
import BoxDetail from '../screens/boxDetail/boxDetail';
import BookingConfirmation from '../screens/bookings/bookingConfirmation';
import SlotBooking from '../screens/bookings/slotBooking';
import AddRatingAndReview from '../screens/clientReview/addRatingAndReview';
import BookingDetail from '../screens/bookings/bookingDetail';
import SelectLocation from '../screens/selectLocation/selectLocation';
import {AppStackParamList} from './navigationTypes';
import {FONTS} from '../constants/font';

const Stack = createNativeStackNavigator<AppStackParamList>();

// ✅ Generalized header options defined inside same file
const getHeaderOptions = (title: string, navigation: {goBack: () => void}) => ({
  headerShown: true,
  title,
  headerTitleAlign: 'center' as const,
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
});

const AppStack = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animation: 'fade_from_bottom'}}>
      <Stack.Screen name="BottomNav" component={BottomNav} />

      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
        options={getHeaderOptions('Select Location', navigation)}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={getHeaderOptions('Account', navigation)}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={getHeaderOptions('Account', navigation)}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={getHeaderOptions('Settings', navigation)}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={getHeaderOptions('Delete Account', navigation)}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={getHeaderOptions('Notification', navigation)}
      />
      <Stack.Screen name="BoxDetail" component={BoxDetail} />
      <Stack.Screen name="BookingDetail" component={BookingDetail} />
      <Stack.Screen
        name="SlotBooking"
        component={SlotBooking}
        options={getHeaderOptions('Slot Booking', navigation)}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmation}
        options={getHeaderOptions('Confirmation', navigation)}
      />
      <Stack.Screen
        name="ClientReview"
        component={ClientReview}
        options={getHeaderOptions('What Client Says', navigation)}
      />
      <Stack.Screen name="AddRatingAndReview" component={AddRatingAndReview} />
    </Stack.Navigator>
  );
};

export default AppStack;
