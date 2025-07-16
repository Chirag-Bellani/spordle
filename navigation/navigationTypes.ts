// navigationTypes.ts

import {RouteProp} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps as RNBottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {UserInfo} from '../context/authContext';
import {Box} from '../screens/types/box';
import {BookingItem, BookingResponse} from '../screens/types/booking';
import {SelectedSlotType} from '../screens/types/slot';

export type AuthStackParamList = {
  Login: undefined;
  OTP: {
    mobileNo: string;
    actualOtp: string;
  };
  OnboardingScreen: undefined;
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;
  ProfileName: {userDetail: UserInfo};
};

export type AppStackParamList = {
  BottomNav: {
    screen: 'Home';
    location?: string[];
    lat?: number;
    long?: number;
  };
  SelectLocation: undefined;
  ProfileScreen: undefined;
  EditProfile: undefined;
  Settings: undefined;
  DeleteAccount: undefined;
  NotificationScreen: undefined;
  BoxDetail: {
    boxDetail: Box;
    isBookmarked: number;
  };
  BookingDetail: {bookingDetail: BookingResponse};
  SlotBooking: {
    boxInfo: Box;
  };
  BookingConfirmation: {
    slotBookingData: SelectedSlotType;
    boxData: Box;
    totalAmountToBePaid: string;
  };
  ClientReview: {
    boxDetail: Box;
  };
  AddRatingAndReview: undefined;
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;
};

export type BottomTabParamList = {
  Home: {
    location?: string[];
    lat?: number;
    long?: number;
  };
  Booking: undefined;
  Bookmark: undefined;
};

// Props for Screens with Navigation & Route
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;
export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;
export type BottomTabScreenProps<T extends keyof BottomTabParamList> =
  RNBottomTabScreenProps<BottomTabParamList, T>;

// Route Props (If you only need route, without navigation)
export type AuthStackRouteProp<T extends keyof AuthStackParamList> = RouteProp<
  AuthStackParamList,
  T
>;
export type AppStackRouteProp<T extends keyof AppStackParamList> = RouteProp<
  AppStackParamList,
  T
>;
export type BottomTabRouteProp<T extends keyof BottomTabParamList> = RouteProp<
  BottomTabParamList,
  T
>;
