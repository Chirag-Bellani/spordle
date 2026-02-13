// navigationTypes.ts

import {
  CompositeNavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  BottomTabNavigationProp,
  BottomTabScreenProps as RNBottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { UserInfo } from '../context/AuthContext';
import { BookingResponse } from '../types/booking';
import { Box } from '../types/Box';
import { courtItem, NormalizedSlot } from '../types/court';
import { BookingReview } from '../types/review';

export type AuthStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  OtpScreen: {
    mobileNo: string;
    serverOtp: string;
  };

  OnboardingScreen: undefined;
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;
  ProfileNameScreen: { userDetail: UserInfo };
};

// Update BottomTabParamList to accept params for Booking
export type BottomTabParamList = {
  Home: undefined;
  Booking: {
    refresh?: boolean;
    bookingDetails?: any;
  };
  Bookmark: undefined;
};

// Update AppStackParamList - BottomTab now accepts NavigatorScreenParams
export type AppStackParamList = {
  BottomTab: NavigatorScreenParams<BottomTabParamList> | undefined;
  SelectLocation: undefined;
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  SettingScreen: undefined;
  DeleteAccountScreen: undefined;
  NotificationScreen: undefined;
  LocationScreen: undefined;
  SportFilterScreen: {
    sport: {
      id: number;
      name: string;
      image: string;
    }[];
  };
  BoxDetails: {
    item: Box;
    onBookmarkChange?: (boxId: number, isBookmarked: boolean) => void;
  };
  ReviewScreen: {
    item: Box;
    bookingRatingReview: BookingReview[];
  };
  BookSlotScreen: {
    box: Box;
  };

  ConfirmationBookingScreen: {
    box: Box;
    totalAmount: number;
    selectedSlots: NormalizedSlot[];
    selectedDate: string;
    selectedCourt: courtItem | undefined;
    boxCourtId: number | null;
  };
  PaymentScreen: undefined;
  BookingDetailScreen: {
    booking: BookingResponse;
  };
  AddRatingAndReview: {
    bookingId: number;
  };
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;
  EnableLocation: undefined;
};

// Props for Screens with Navigation & Route
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

export type BottomTabScreenProps<T extends keyof BottomTabParamList> =
  RNBottomTabScreenProps<BottomTabParamList, T>;

// Route Props
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

// Composite navigation type for navigating from Bottom Tab to App Stack
export type TabWithStackNavProp<T extends keyof BottomTabParamList> =
  CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabParamList, T>,
    NativeStackNavigationProp<AppStackParamList>
  >;

// Composite navigation type for navigating from App Stack to Bottom Tab
export type StackWithTabNavProp<T extends keyof AppStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<AppStackParamList, T>,
    BottomTabNavigationProp<BottomTabParamList>
  >;
