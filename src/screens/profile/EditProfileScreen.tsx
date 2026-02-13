import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import { useAuth } from '../../context/AuthContext';
import HeaderComp from '../../components/HeaderComp';
import GoBack from '../../components/GoBack';
import { AppStackScreenProps } from '../../navigation/navigationTypes';
import { Camera, Folders, User } from 'lucide-react-native';
import {
  updateUserProfile,
  updateUserName,
} from '../../services/profileService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import ToastUtil from '../../utils/toastUtil';
import Toast from 'react-native-toast-message';
import NetInfoComponent from '../../components/NetInfoComponent';

type ImagePickerType = 'camera' | 'gallery';

interface ProfileImage extends Asset {
  uri: string;
  type?: string;
  fileName?: string;
}

const EditProfileScreen: React.FC<AppStackScreenProps<'EditProfileScreen'>> = ({
  navigation,
}) => {
  const { user, updateUser } = useAuth();
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobileNo, setMobileNo] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [profilePic, setProfilePic] = useState<ProfileImage | string | null>(
    null,
  );
  const [profilePicChanged, setProfilePicChanged] = useState<boolean>(false);

  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || user.firstName || '');
      setEmail(user.email || '');
      setMobileNo(user.mobile_no || user.mobileNo || '');
      setDob(user.dob || '');
      setProfilePic(user.profile_pic || user.profileImage || null);

      if (user.dob) {
        let dateObj: Date;
        if (user.dob.includes('-')) {
          const parts: string[] = user.dob.split('-');
          if (parts[0].length === 4) {
            dateObj = new Date(user.dob);
          } else {
            const [day, month, year] = parts;
            dateObj = new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day),
            );
          }
          if (!isNaN(dateObj.getTime())) {
            setSelectedDate(dateObj);
          }
        }
      }
    }
  }, [user]);

  const handleImagePicker = (type: ImagePickerType): void => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    const callback = (response: ImagePickerResponse): void => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets[0]) {
        setProfilePic(response.assets[0] as ProfileImage);
        setProfilePicChanged(true);
      }
      setShowImageModal(false);
    };

    if (type === 'camera') {
      launchCamera(options, callback);
    } else {
      launchImageLibrary(options, callback);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date): void => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      const year: number = date.getFullYear();
      const month: string = String(date.getMonth() + 1).padStart(2, '0');
      const day: string = String(date.getDate()).padStart(2, '0');
      setDob(`${year}-${month}-${day}`);
    }
  };

  const handleSave = async (): Promise<void> => {
    const trimmedFirstName: string = firstName.trim();

    if (!trimmedFirstName) {
      Alert.alert('Validation Error', 'First name is required');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('first_name', trimmedFirstName);

      const trimmedEmail: string = email.trim();
      if (trimmedEmail) {
        formData.append('email', trimmedEmail);
      }

      if (dob) {
        formData.append('dob', dob);
      }

      if (
        profilePicChanged &&
        profilePic &&
        typeof profilePic !== 'string' &&
        profilePic.uri
      ) {
        const imageUri: string =
          Platform.OS === 'ios'
            ? profilePic.uri.replace('file://', '')
            : profilePic.uri;

        formData.append('profile_pic', {
          uri: imageUri,
          type: profilePic.type || 'image/jpeg',
          name: profilePic.fileName || `profile_${Date.now()}.jpg`,
        } as any);
      }

      console.log('Updating profile with data:', {
        first_name: trimmedFirstName,
        email: trimmedEmail,
        dob: dob,
        has_profile_pic:
          profilePicChanged &&
          typeof profilePic !== 'string' &&
          !!profilePic?.uri,
      });

      // Call the profile service
      const responseData = await updateUserProfile(formData);

      if (responseData && responseData.success) {
        console.log('Profile updated, now updating username...');
        await updateUsernameAndRefresh(trimmedFirstName);

         ToastUtil.success('Profile updated successfully');
        navigation.goBack();
      } else {
       ToastUtil.error('Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      ToastUtil.error(
        error?.message || 'An error occurred while updating profile',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateUsernameAndRefresh = async (firstName: string): Promise<void> => {
    try {
      console.log('Calling update-username API...');

      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('first_name', firstName);

      // Call the username service
      const responseData = await updateUserName(formData);

      if (responseData && responseData.success && responseData.data) {
        const updatedUserData = {
          ...user,
          ...responseData.data,
          first_name: firstName,
          firstName: firstName,
          name: `${firstName}`.trim(),
        };

        await updateUser(updatedUserData);
        console.log('User context updated with latest data');
      } else {
        console.warn('Update username returned no data, using local values');
        await updateUser({
          first_name: firstName,
          firstName: firstName,
          name: `${firstName}`.trim(),
        });
      }
    } catch (error: any) {
      console.error('Error in updateUsernameAndRefresh:', error);
      await updateUser({
        first_name: firstName,
        firstName: firstName,
        name: `${firstName}`.trim(),
      });
    }
  };

  const isSaveDisabled: boolean = !firstName.trim() || isLoading;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        flex: 1,
        paddingBottom: insets.bottom > 24 ? insets.bottom + 24 : 24,
      }}
    >
      <View style={[styles.container]}>
        <NetInfoComponent />
        <HeaderComp headerText="Account" />
        <GoBack />

        <ScrollView
          // automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={[styles.scrollContent]}
          showsVerticalScrollIndicator={false}
        >
          {/* Card Container */}
          <View style={styles.cardContainer}>
            {/* Profile Picture Section */}
            <View style={styles.profilePicSection}>
              <TouchableOpacity
                style={styles.profilePicContainer}
                onPress={() => setShowImageModal(true)}
                activeOpacity={0.8}
              >
                {profilePic ? (
                  <Image
                    source={{
                      uri:
                        typeof profilePic === 'string'
                          ? profilePic
                          : profilePic.uri,
                    }}
                    style={styles.profilePic}
                  />
                ) : (
                  <View style={styles.profilePicPlaceholder}>
                    <User size={moderateScale(40)} color="#C0C0C0" />
                  </View>
                )}

                {/* Camera Icon Overlay */}
                <View style={styles.cameraIcon}>
                  <Camera size={moderateScale(18)} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* First Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  First Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter your first name"
                  placeholderTextColor="#B8B8B8"
                />
              </View>

              {/* Phone (Disabled) */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone</Text>
                <View style={[styles.input, styles.disabledInput]}>
                  <Text style={styles.disabledText}>{mobileNo}</Text>
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#B8B8B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Date of Birth */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Date Of Birth</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={dob ? styles.dateText : styles.placeholder}>
                    {dob ? formatDateDisplay(dob) : 'Select your DOB'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.saveButton,
              isSaveDisabled && styles.saveButtonDisabled,
              { marginBottom: insets.bottom },
            ]}
            onPress={handleSave}
            disabled={isSaveDisabled}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>SAVE</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
        {/* Save Button */}

        {/* Image Picker Modal */}
        <Modal
          visible={showImageModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowImageModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowImageModal(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Profile Picture</Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImagePicker('camera')}
              >
                <Camera size={24} color="#FF5A00" />
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImagePicker('gallery')}
              >
                <Folders size={24} color="#FF5A00" />
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalOption, styles.cancelOption]}
                onPress={() => setShowImageModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1950, 0, 1)}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const formatDateDisplay = (dateStr: string): string => {
  if (!dateStr) return '';

  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }

  return dateStr;
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    // paddingTop: verticalScale(10),
  },
  scrollContent: {
    // paddingBottom: verticalScale(30),
    paddingTop: verticalScale(15),
  },
  cardContainer: {
    backgroundColor: '#fff',
    marginHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(20),

    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profilePicSection: {
    alignItems: 'center',
    marginVertical: moderateScale(20),
  },

  profilePicContainer: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(50),
    position: 'relative',
  },

  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(50),
  },

  profilePicPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(50),
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: moderateScale(25),
    height: moderateScale(25),
    borderRadius: moderateScale(15),
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  formSection: {
    marginBottom: verticalScale(10),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: scale(13.5),
    color: '#8A8A8A',
    marginBottom: verticalScale(8),
    fontWeight: '400',
  },
  required: {
    color: '#FF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(14),
    fontSize: scale(15),
    color: '#000',
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
  },
  disabledText: {
    fontSize: scale(15),
    color: '#000',
  },
  dateText: {
    fontSize: scale(15),
    color: '#000',
  },
  placeholder: {
    fontSize: scale(15),
    color: '#B8B8B8',
  },
  saveButton: {
    backgroundColor: '#FF5A00',
    marginTop: verticalScale(15),
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    marginHorizontal: moderateScale(16),
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingVertical: verticalScale(25),
    paddingHorizontal: moderateScale(20),
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionText: {
    fontSize: scale(16),
    color: '#333',
    marginLeft: moderateScale(16),
  },
  cancelOption: {
    borderBottomWidth: 0,
    justifyContent: 'center',
    marginTop: verticalScale(10),
  },
  cancelText: {
    fontSize: scale(16),
    color: '#FF5A00',
    fontWeight: '600',
    textAlign: 'center',
  },
});
