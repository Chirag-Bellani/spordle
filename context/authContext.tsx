import React, {createContext, ReactNode, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiPost, saveAuthToken} from '../services/apiService/apiService';
import {API_ENDPOINTS} from '../constants/apiEndPoinst';

interface AuthProviderProps {
  children: ReactNode; // Accepts React children
}

export interface UserInfo {
  api_token: string;
  name: string | null;
  profile_pic: string;
  user: 'New' | 'Old';
  email: string | null;
  role: number;
  mobile_no: string;
  status: number;
}

interface AuthContextType {
  login: (
    mobileNo: string,
    registerNewUser: (userInfo: UserInfo) => void,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  userToken: string | null;
  userInfo: UserInfo | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  loginError: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loginError, setLoginError] = useState<string>('');

  const login = async (
    mobileNo: string,
    registerNewUser: (userInfo: UserInfo) => void,
  ): Promise<void> => {
    try {
      // let fcmToken = await AsyncStorage.getItem('fcmToken');

      const formData = new FormData();
      formData.append('mobile_no', mobileNo);

      const response = await apiPost(API_ENDPOINTS.AUTH.LOGIN, formData);

      if (response.success) {
        const userInfo = response.data;
        await AsyncStorage.setItem('profileImage', userInfo.profile_pic);

        if (userInfo.user === 'New') {
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          registerNewUser(userInfo);
        } else {
          // Assuming `setUserToken` is in scope
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          await saveAuthToken(userInfo.api_token);
          setUserInfo(userInfo); // Assuming `setUserInfo` is in scope
          setUserToken(userInfo.api_token);
        }
      } else {
        setLoginError(response.message); // Assuming `setLoginError` is in scope
      }
    } catch (error: unknown) {
      setLoginError('Invaild username or password');
      console.error('Login Error:', error);
    } finally {
      setIsLoading(false); // Ensure loading stops only for old users
    }
  };

  const isLoggedIn = async (): Promise<void> => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('authToken');
      const userInfoString = await AsyncStorage.getItem('userInfo');

      if (userInfoString) {
        const userInfo: UserInfo = JSON.parse(userInfoString);
        setUserToken(userToken);
        setUserInfo(userInfo);
      }

      setIsLoading(false);
    } catch (e) {
      console.log('is logged in error $(e)');
    }
  };

  const logout = async (): Promise<void> => {
    setUserToken(null);
    setUserInfo(null);
    // await clearAuthToken();
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userInfo');
    setIsLoading(false);
    setLoginError('');
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoading,
        userToken,
        userInfo,
        setUserToken,
        setUserInfo,
        loginError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
