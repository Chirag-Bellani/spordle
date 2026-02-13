import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { COLORS } from '../../constants/color';

type AnimatedBookNowButtonProps = {
  handleBookNow: () => void;
};

const AnimatedBookNowButton = ({ handleBookNow }: AnimatedBookNowButtonProps) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleBookNow}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: moderateScale(15),
    marginVertical: moderateScale(10),
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(30),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor:COLORS.darkText,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.secondary,
    fontSize: moderateScale(16),
    fontWeight: '600',
    fontFamily: 'nunito',
  },
});

export default AnimatedBookNowButton;