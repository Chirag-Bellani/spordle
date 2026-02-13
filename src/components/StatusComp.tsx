import React, { FC } from 'react';
import { StyleSheet, StatusBar } from 'react-native';

const StatusComp: FC = () => {
  return (
    <StatusBar
      translucent
      barStyle="dark-content"
      backgroundColor="transparent"
    />
  );
};

export default StatusComp;
