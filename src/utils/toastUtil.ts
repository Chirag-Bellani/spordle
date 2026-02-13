import { ToastAndroid } from 'react-native';

const ToastUtil = {
  success: (message: string) => {
    ToastAndroid.show(`✅ ${message}`, ToastAndroid.SHORT);
  },

  error: (message: string) => {
    ToastAndroid.show(`❌ ${message}`, ToastAndroid.SHORT);
  },

  info: (message: string) => {
    ToastAndroid.show(`ℹ️ ${message}`, ToastAndroid.SHORT);
  },

  long: (message: string) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  },
};

export default ToastUtil;
