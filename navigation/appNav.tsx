import React, {useState, useEffect, useContext} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './authStack';
import AppStack from './appStack';
import SplashScreen from '../screens/splashScreen/splashScreen';
import {COLORS} from '../constants/color';
import {useAuth} from '../customHooks/useAuth';

function AppNav() {
  const [isSplashVisible, setIsSplashVisible] = useState(true); // Show splash initially
  const {userToken, isLoading} = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false); // Hide splash after 3 sec
    }, 3000);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <ActivityIndicator color={COLORS.primary} size={'large'} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isSplashVisible ? (
        <SplashScreen />
      ) : userToken !== null ? (
        <AppStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

export default AppNav;
