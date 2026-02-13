import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import Routes from './src/navigation/AppNav';
import { AuthProvider } from './src/context/AuthContext';
import { NetInfoProvider } from './src/context/NetInfoContext';
import { AppErrorBoundary } from './src/components/AppErrorBoundary';

export default function App() {
  useEffect(() => {
    changeNavigationBarColor('transparent', true);
  }, []);

  return (
    <SafeAreaProvider>
      <AppErrorBoundary>
        <AuthProvider>
          <KeyboardProvider navigationBarTranslucent preserveEdgeToEdge>
            <NetInfoProvider>
              <NavigationContainer>
                <Routes />
              </NavigationContainer>
            </NetInfoProvider>
          </KeyboardProvider>
        </AuthProvider>
      </AppErrorBoundary>
    </SafeAreaProvider>
  );
}
