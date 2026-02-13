import React, { useEffect } from 'react';
import { StyleSheet, BackHandler } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const GoBack: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  useEffect((): (() => void) => {
    const backAction = (): boolean => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  return null; // component has no UI
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GoBack;
