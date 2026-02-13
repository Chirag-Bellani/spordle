import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Bookmark,  } from 'lucide-react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import BookingScreen from '../screens/booking/BookingScreen';
import BookmarksScreen from '../screens/bookMarkScreen/BookMarkScreen';
import HomeHeader from '../components/HomeHeader';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/color';
import navigationString from '../constants/navigationString';
import { BottomTabParamList } from './navigationTypes';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTab = () => {
  const { selectedCity } = useAuth();
  const insets = useSafeAreaInsets();

  const renderIcon = (routeName: string, focused: boolean, color: string) => {
    const iconSize = moderateScale(24);

    switch (routeName) {
      case 'Home':
        return (
          <Home size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />
        );
      case 'Booking':
        return (
          <Calendar
            size={iconSize}
            color={color}
            strokeWidth={focused ? 2.5 : 2}
          />
        );
      case 'Bookmark':
        return (
          <Bookmark
            size={iconSize}
            color={color}
            strokeWidth={focused ? 2.5 : 2}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => (
          <HomeHeader currentRoute={route.name} selectedCity={selectedCity} />
        ),
        tabBarIcon: ({ focused, color }) =>
          renderIcon(route.name, focused, color),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.lightText,
        tabBarStyle: {
          height:
            insets.bottom > 25
              ? insets.bottom + verticalScale(45)
              : verticalScale(55),
          paddingTop: verticalScale(0),
          paddingBottom:
            insets.bottom > 25
              ? insets.bottom + verticalScale(20)
              : verticalScale(0),
        },
        tabBarLabelStyle: {
          fontSize: moderateScale(12),
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name={navigationString.HOMESCREEN} component={HomeScreen} />
      <Tab.Screen name={navigationString.BOOKING} component={BookingScreen} />
      <Tab.Screen  name={navigationString.BOOKMARKSCREEN} component={BookmarksScreen} />
    </Tab.Navigator>
  );
};

export default BottomTab;
