import React from 'react';
import { Image, Text, View} from 'react-native';
import ErrorBoundary, {
  FallbackComponentProps,
  ErrorBoundaryProps,
} from 'react-native-error-boundary';
import { verticalScale } from 'react-native-size-matters';
import ButtonComp from './ButtonComp';
import imagePath from '../constants/imagePath';


// ✅ Typed props for fallback component
const CustomFallback: React.FC<FallbackComponentProps> = ({
  error,
  resetError,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
      }}
    >
      <Image
        source={imagePath.warning}
        style={{ height: verticalScale(60), width: verticalScale(60) }}
      />
      <Text style={{ paddingVertical: verticalScale(14) }}>
        Something went wrong. Please try again
      </Text>
      <ButtonComp btnText="Try Again" onPress={resetError}   />
    </View>
  );
};

// ✅ Typed AppErrorBoundary
interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({
  children,
}) => {
  const TypedErrorBoundary =
    ErrorBoundary as React.ComponentType<ErrorBoundaryProps>;

  return (
    <TypedErrorBoundary FallbackComponent={CustomFallback}>
      {children}
    </TypedErrorBoundary>
  );
};
