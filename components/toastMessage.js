// ToastMessage.js
import React from 'react';
import Toast, { BaseToast, ErrorToast, InfoToast, SuccessToast } from 'react-native-toast-message';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { FONTS } from '../constants/font';

const toastConfig = {
    success: (props) => (
        <SuccessToast
            {...props}
            style={{ borderLeftColor: 'green' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: moderateScale(15),
                fontFamily: FONTS.nunitoMedium
            }}
            text2Style={{
                fontFamily: FONTS.nunitoMedium,
                fontSize: moderateScale(14)
            }}
        />
    ),

    error: (props) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor: 'red', elevation: 4, height: verticalScale(50) }}
            contentContainerStyle={{ paddingHorizontal: scale(12) }}
            text1Style={{
                fontSize: moderateScale(15),
                fontFamily: FONTS.nunitoMedium
            }}
            text2Style={{
                fontFamily: FONTS.nunitoMedium,
                fontSize: moderateScale(13)
            }}
        />
    ),

    warning: (props) => (
        <InfoToast
            {...props}
            style={{ borderLeftColor: 'orange', elevation: 4, height: verticalScale(50) }}
            contentContainerStyle={{ paddingHorizontal: scale(12) }}
            text1Style={{
                fontSize: moderateScale(15),
                fontFamily: FONTS.nunitoMedium
            }}
            text2Style={{
                fontFamily: FONTS.nunitoMedium,
                fontSize: moderateScale(13)
            }}
        />
    ),
};

export const showToast = (type, message) => {
    Toast.show({
        type,
        text1: type === 'success' ? 'Success!' : type === 'error' ? 'Failed!' : 'Warning!',
        text2: message || 'Something went wrong!',
    });
};

export const ToastMessage = () => (
    <Toast config={toastConfig} position='bottom' visibilityTime={2500} />
);
