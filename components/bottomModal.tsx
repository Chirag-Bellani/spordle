import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import PrimaryButton from './primaryButton';
import {
  verticalScale,
  scale,
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';
import SecondaryButton from './secondaryButton';
import {images} from '../constants/image';
import {COLORS} from '../constants/color';
import {FONTS} from '../constants/font';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  requestCameraPermission,
  requestNotificationPermission,
} from '../utils/permissionUtil';

interface BottomModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  type: 'notification' | 'imageUpload' | 'deleteAccount' | 'other';
  profileImage?: any; // or a more specific type if known (e.g. string | ImageAsset)
  setProfileImage?: (image: any) => void;
  serverProfileImage?: string;
  setDisplayProfileImage?: (image: string) => void;
}

const BottomModal: React.FC<BottomModalProps> = ({
  isModalVisible,
  toggleModal,
  type,
  profileImage,
  setProfileImage,
  serverProfileImage,
  setDisplayProfileImage,
}) => {
  const modalContentMapping = {
    notification: {
      image: images.liveNotification,
      title: 'Can We Notify You?',
      subtitle: 'Please allow us to send you Notifications',
      primaryButtonTitle: 'ALLOW',
      secondaryButtonTitle: 'NO,OTHER TIME',
      onPrimaryButtonPress: () => handlePermissionRequest(),
      onSecondaryButtonPress: toggleModal,
    },
    imageUpload: {
      image: images.uploadImage, // Replace with appropriate image
      title: 'Upload Your Profile',
      subtitle: 'Choose Your Profile  from Gallery Or Take a photo in camera',
      primaryButtonTitle: 'UPLOAD FROM GALLERY',
      secondaryButtonTitle: 'OPEN,CAMERA',
      onPrimaryButtonPress: () => chooseImageFromGallery(),
      onSecondaryButtonPress: () => captureImageWithCamera(),
    },
    deleteAccount: {
      image: images.deleteImage, // Replace with appropriate image
      title: 'Delete Account?',
      subtitle: 'Are Your Sure You Want To Delete Your Account?',
      primaryButtonTitle: 'DELETE',
      secondaryButtonTitle: 'NO,KEEP MY ACCOUNT',
    },
    other: {
      image: images.scenic, // Replace as needed
      title: 'Default Title',
      subtitle: 'Default message goes here.',
    },
  };

  const chooseImageFromGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedImage = response.assets[0];
        setProfileImage(selectedImage.uri);
        setDisplayProfileImage(selectedImage.uri);
        toggleModal();
      }
    });
  };

  const captureImageWithCamera = async () => {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        console.log('Camera Error: ', response.errorMessage);
      } else {
        const capturedImage = response.assets[0];
        setProfileImage(capturedImage.uri);
        setDisplayProfileImage(capturedImage.uri);

        toggleModal();
      }
    });
  };
  const handlePermissionRequest = async () => {
    const granted = await requestNotificationPermission();
    toggleModal();
    if (granted) {
      Alert.alert('Permission Granted', 'You will now receive notifications.');
    } else {
      Alert.alert(
        'Permission Denied',
        'You can enable notifications in settings.',
      );
    }
  };

  const content = modalContentMapping[type] || modalContentMapping.other;

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={toggleModal}
      backdropOpacity={0.4}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      statusBarTranslucent={true}
      style={styles.modal}>
      <View style={styles.container}>
        {/* highlight dots */}
        <View
          style={{
            width: scale(7),
            height: verticalScale(7),
            backgroundColor: '#C7C700',
            borderRadius: moderateScale(7),
          }}
        />
        <View
          style={{
            width: scale(7),
            height: verticalScale(7),
            backgroundColor: '#C1F5CF',
            borderRadius: moderateScale(10),
            position: 'absolute',
            zIndex: 1,
            top: verticalScale(80),
            left: 100,
          }}
        />
        <View style={styles.imageContainer}>
          <Image source={content.image} style={styles.image} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.subtitle}>{content.subtitle}</Text>
        </View>

        <PrimaryButton
          onPress={content.onPrimaryButtonPress}
          title={content.primaryButtonTitle}
          disabled={undefined}
          style={undefined}
        />
        <SecondaryButton
          onPress={content.onSecondaryButtonPress}
          title={content.secondaryButtonTitle}
          disabled={undefined}
          style={undefined}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(13),
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
  },
  imageContainer: {
    backgroundColor: COLORS.primary,
    width: moderateScale(83, 0.3),
    height: moderateVerticalScale(79, 0.4),
    borderRadius: moderateScale(60, 0.3),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    // paddingTop:verticalScale(10),
    marginTop: verticalScale(16),
  },
  image: {
    width: scale(50),
    height: verticalScale(50),
  },
  textContainer: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(35),
    alignSelf: 'center',
    width: '80%',
  },
  title: {
    fontFamily: FONTS.inriaSansRegular,
    fontSize: scale(20),
    color: COLORS.darkText,
    marginVertical: verticalScale(5),
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.nunitoMedium,
    fontSize: scale(13),
    color: COLORS.lightText,
    textAlign: 'center',
  },
});

export default BottomModal;
