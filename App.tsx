import React, {useEffect} from 'react';
import AppNav from './src/navigation/appNav';
import {AuthProvider} from './src/context/authContext';

import {ToastMessage} from './src/components/toastMessage';
import InternetCheck from './src/utils/internetCheck';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <>
      <AuthProvider>
        <InternetCheck>
          <SafeAreaProvider>
            <AppNav />
          </SafeAreaProvider>
        </InternetCheck>
      </AuthProvider>
      <ToastMessage />
    </>
  );
};

export default App;
