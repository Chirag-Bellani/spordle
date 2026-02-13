import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  apiPost,
  saveAuthToken,
  clearAuthToken,
} from '../services/api/apiService';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { Alert } from 'react-native';

export interface UserInfo {
  id?: number;
  api_token: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string | null;
  mobile_no?: string;
  profile_pic?: string;
  role?: number;
  status?: number;
  dob?: string;

  // Normalized aliases
  firstName?: string;
  lastName?: string;
  mobileNo?: string;
  profileImage?: string;
}

interface City {
  id: number;
  name: string;
  formattedAddress?: string;
  lat?: number;
  lng?: number;
  [key: string]: any;
}

type locationType = {
  latitude: number | null;
  longitude: number | null;
  address?: string; 
};

interface AuthContextType {
  login: (mobileOrUser: string | UserInfo, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  authToken: string | null;
  user: UserInfo | null;
  loginError: string;
  isAuthenticated: boolean;

  isLocation: locationType | null;
  setIsLocation: React.Dispatch<React.SetStateAction<locationType | null>>;

  updateUser: (data: Partial<UserInfo>) => Promise<void>;
  fetchUpdatedUsername: (
    userId: number,
    token: string,
  ) => Promise<UserInfo | null>;

  bookmarkedBoxIds: Set<number>;
  updateBookmark: (boxId: number, isBookmarked: boolean) => Promise<void>;
  isBoxBookmarked: (boxId: number) => boolean;
  initializeBookmarks: (boxes: any[]) => void;

  selectedCity: City | null;
  updateSelectedCity: (city: City | null) => Promise<void>;
  loadSelectedCity: () => Promise<City | null>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

const normalizeUserData = (userData: any): UserInfo | null => {
  if (!userData) {
    return null;
  }

  const first_name = userData.first_name || userData.firstName || '';
  const last_name = userData.last_name || userData.lastName || '';
  const profile_pic = userData.profile_pic || userData.profileImage || '';
  const mobile_no = userData.mobile_no || userData.mobileNo || '';

  return {
    ...userData,
    first_name,
    last_name,
    profile_pic,
    mobile_no,

    firstName: first_name,
    lastName: last_name,
    profileImage: profile_pic,
    mobileNo: mobile_no,

    name: first_name
      ? `${first_name} ${last_name || ''}`.trim()
      : userData.name || 'User',
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocation, setIsLocation] = useState<locationType | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loginError, setLoginError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [bookmarkedBoxIds, setBookmarkedBoxIds] = useState<Set<number>>(
    new Set(),
  );

  const updateLocation = useCallback(async (location: locationType | null) => {
    try {
      if (location) {
        await AsyncStorage.setItem('userLocation', JSON.stringify(location));
      } else {
        await AsyncStorage.removeItem('userLocation');
      }
      setIsLocation(location);
    } catch (error) {
      console.error('Error saving location to AsyncStorage:', error);
      setIsLocation(location);
    }
  }, []);


  const updateSelectedCity = useCallback(async (city: City | null) => {
    try {
      if (city) {
        await AsyncStorage.setItem('selectedCity', JSON.stringify(city));
      
        if (city.lat && city.lng) {
          const locationData = {
            latitude: city.lat,
            longitude: city.lng,
            address: city.name,
          };
          await AsyncStorage.setItem('userLocation', JSON.stringify(locationData));
          setIsLocation(locationData);
         
        }
        
        setSelectedCity(city);
      } else {
        await AsyncStorage.removeItem('selectedCity');
        setSelectedCity(null);
      }
    } catch (error) {
      console.error(' Error saving city:', error);
    }
  }, []);

  const loadSelectedCity = useCallback(async (): Promise<City | null> => {
    try {
      const cityStr = await AsyncStorage.getItem('selectedCity');
      if (cityStr) {
        const city: City = JSON.parse(cityStr);
        setSelectedCity(city);
        
        return city;
      }
    } catch (error) {
      console.error(' Error loading city:', error);
    }
    return null;
  }, []);

  const fetchUpdatedUsername = useCallback(
    async (userId: number, token: string): Promise<UserInfo | null> => {
      try {
        const formData = new FormData();
        formData.append('user_id', String(userId));

        const currentUser =
          user || JSON.parse((await AsyncStorage.getItem('userInfo')) || '{}');

        if (currentUser?.first_name) {
          formData.append('first_name', currentUser.first_name);
        }
        if (currentUser?.last_name) {
          formData.append('last_name', currentUser.last_name);
        }

        const response = await apiPost(
          API_ENDPOINTS.AUTH.UPDATE_USERNAME,
          formData,
        );

        if (response?.success && response.data) {
          const normalizedUser = normalizeUserData(response.data);
          if (normalizedUser) {
            await AsyncStorage.setItem(
              'userInfo',
              JSON.stringify(normalizedUser),
            );
            setUser(normalizedUser);
            return normalizedUser;
          }
        }
      } catch (error) {
        console.error('fetchUpdatedUsername error:', error);
      }
      return null;
    },
    [user],
  );

  const login = async (
    mobileOrUser: string | UserInfo,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Case: already has user object
      if (typeof mobileOrUser === 'object' && mobileOrUser.api_token) {
        const userInfo = normalizeUserData(mobileOrUser);
        if (!userInfo) {
          return;
        }

        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        await saveAuthToken(userInfo.api_token);

        setUser(userInfo);
        setAuthToken(userInfo.api_token);
        setIsAuthenticated(true);
        setLoginError('');

        if (userInfo.id) {
          setTimeout(() => {
            fetchUpdatedUsername(userInfo.id!, userInfo.api_token);
          }, 500);
        }
        return;
      }

      // TYPE NARROWING FIX
      if (typeof mobileOrUser !== 'string') {
        throw new Error('Invalid mobile number');
      }

      const mobile: string = mobileOrUser;
    } catch (error: any) {
      setLoginError('Network or server error');
      Alert.alert('Login Error', error?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setBookmarkedBoxIds(new Set());
      setSelectedCity(null);
      setIsLocation(null);

      await clearAuthToken();
      await AsyncStorage.multiRemove([
        'userInfo',
        'bookmarkedBoxIds',
        'selectedCity',
        'userLocation',
      ]);
    } catch (error) {
      console.warn(' Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const restoreSession = async (): Promise<void> => {
    setIsLoading(true);
    try {
      
      const [token, userStr, bookmarksStr, locationStr, cityStr] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('userInfo'),
        AsyncStorage.getItem('bookmarkedBoxIds'),
        AsyncStorage.getItem('userLocation'),
        AsyncStorage.getItem('selectedCity'),
      ]);

      // Restore user & auth
      if (token && userStr) {
        const userInfo = normalizeUserData(JSON.parse(userStr));
        if (userInfo) {
          setAuthToken(token);
          setUser(userInfo);
          setIsAuthenticated(true);

          if (userInfo.id) {
            setTimeout(() => {
              fetchUpdatedUsername(userInfo.id!, token);
            }, 1000);
          }
        }
      }

      // Restore bookmarks
      if (bookmarksStr) {
        setBookmarkedBoxIds(new Set(JSON.parse(bookmarksStr)));
      }

      if (cityStr) {
        const city = JSON.parse(cityStr);
        setSelectedCity(city);
        
        // If city has location, use it as isLocation
        if (city.lat && city.lng) {
          const locationFromCity = {
            latitude: city.lat,
            longitude: city.lng,
            address: city.name,
          };
          setIsLocation(locationFromCity);
        }
      } else if (locationStr) {
        // Fallback: use standalone location if no city
        const location = JSON.parse(locationStr);
        setIsLocation(location);
      }

    } catch (error) {
      console.error('❌ restoreSession error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = useCallback(
    async (updatedData: Partial<UserInfo>): Promise<void> => {
      setUser(prev => {
        const merged = { ...prev, ...updatedData };
        const normalized = normalizeUserData(merged);
        if (normalized) {
          AsyncStorage.setItem('userInfo', JSON.stringify(normalized));
        }
        return normalized;
      });
    },
    [],
  );

  const updateBookmark = useCallback(
    async (boxId: number, isBookmarked: boolean): Promise<void> => {
      setBookmarkedBoxIds(prev => {
        const newSet = new Set(prev);
        isBookmarked ? newSet.add(boxId) : newSet.delete(boxId);
        AsyncStorage.setItem('bookmarkedBoxIds', JSON.stringify([...newSet]));
        return newSet;
      });
    },
    [],
  );

  const isBoxBookmarked = useCallback(
    (boxId: number): boolean => bookmarkedBoxIds.has(boxId),
    [bookmarkedBoxIds],
  );

  const initializeBookmarks = useCallback((boxes: any[]) => {
    if (!Array.isArray(boxes)) {
      return;
    }

    const bookmarkedIds = boxes
      .filter(
        box =>
          box.is_bookmark === 1 ||
          box.is_bookmark === '1' ||
          (Array.isArray(box.get_selected_user_book_mark) &&
            box.get_selected_user_book_mark.length > 0),
      )
      .map(box => box.id);

    if (bookmarkedIds.length > 0) {
      setBookmarkedBoxIds(new Set(bookmarkedIds));
      AsyncStorage.setItem('bookmarkedBoxIds', JSON.stringify(bookmarkedIds));
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      isLocation,
      setIsLocation: updateLocation,
      login,
      logout,
      isLoading,
      authToken,
      user,
      loginError,
      isAuthenticated,
      updateUser,
      fetchUpdatedUsername,
      bookmarkedBoxIds,
      updateBookmark,
      isBoxBookmarked,
      initializeBookmarks,
      selectedCity,
      updateSelectedCity,
      loadSelectedCity,
    }),
    [
      isLocation,
      updateLocation,
      isLoading,
      authToken,
      user,
      loginError,
      isAuthenticated,
      bookmarkedBoxIds,
      selectedCity,
      updateSelectedCity,
      loadSelectedCity,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};