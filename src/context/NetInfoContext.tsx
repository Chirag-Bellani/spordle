import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { StyleSheet } from 'react-native';
import ToastUtil from '../utils/toastUtil';



export interface NetInfoContextType {
  isConnected: boolean;
  hasLostConnection: boolean;
  retryConnection: () => Promise<boolean>;
}

interface NetInfoProviderProps {
  children: ReactNode;
}



export const NetInfoContext =
  createContext<NetInfoContextType | null>(null);


export const NetInfoProvider: React.FC<NetInfoProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [hasLostConnection, setHasLostConnection] =
    useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(
      (state: NetInfoState) => {
        const connected = Boolean(state.isConnected);

   
        if (!connected && isConnected) {
          setIsConnected(false);
          setHasLostConnection(true);

          ToastUtil.error(
            'You are offline. Some features may not work.',
          );
        }

        
        if (connected && !isConnected) {
          ToastUtil.success(
            "You're back online! Press Retry to continue.",
          );
        }
      },
    );

    return () => unsubscribe();
  }, [isConnected]);

 
  const retryConnection = async (): Promise<boolean> => {
    const state = await NetInfo.fetch();

    if (state.isConnected) {
      ToastUtil.success('Connection restored!');

      setIsConnected(true);
      setHasLostConnection(false);
      return true;
    }

    ToastUtil.error('Still offline. Try again.');
    return false;
  };

  return (
    <NetInfoContext.Provider
      value={{ isConnected, hasLostConnection, retryConnection }}
    >
      {children}
    </NetInfoContext.Provider>
  );
};

export default NetInfoContext;

const styles = StyleSheet.create({
  flashWrapper: {
    alignSelf: 'center',
    width: '90%',
    marginBottom: 50,
    borderRadius: 8,
    paddingVertical: 10,
  },
  flashText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});
