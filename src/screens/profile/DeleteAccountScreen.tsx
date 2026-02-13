import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
  Image,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import { Check, Key, Trash } from 'lucide-react-native';
import GoBack from '../../components/GoBack';
import { AppStackScreenProps } from '../../navigation/navigationTypes';
import { icon } from '../../constants/icon';
import imagePath from '../../constants/imagePath';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { COLORS } from '../../constants/color';
import NetInfoComponent from '../../components/NetInfoComponent';

const DeleteAccountScreen: React.FC<
  AppStackScreenProps<'DeleteAccountScreen'>
> = () => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const insets = useSafeAreaInsets();

  const reasons = [
    { id: '1', label: 'Booking Was Difficult' },
    { id: '2', label: 'Difficult To Use The App' },
    { id: '3', label: 'Missing Features I Needed' },
    { id: '4', label: 'Other' },
  ];

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSelectReason = (id: string) => {
    setSelectedReason(id === selectedReason ? '' : id);
    if (id !== '4') setCustomReason('');
  };

  const handleDeletePress = () => {
    if (!selectedReason) {
      alert('Please select a reason before deleting your account.');
      return;
    }
    setShowModal(true);
  };

  const confirmDelete = () => {
    setShowModal(false);
    alert('Your account has been deleted successfully.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <GoBack />
        <NetInfoComponent />
    
       
        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: verticalScale(100) }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.warningText}>
            Are You Sure You Want To Delete Your Account? You'll Lose
          </Text>

          {!keyboardVisible && (
            <View style={styles.lossContainer}>
              <View style={styles.lossItem}>
                <View style={styles.iconCircle}>
                  <Image
                    source={icon.offerIcon}
                    style={{
                      width: scale(20),
                      height: verticalScale(20),
                      tintColor: '#fff',
                    }}
                  />
                </View>
                <Text style={styles.lossLabel}>Ongoing Offers</Text>
              </View>

              <View style={styles.lossItem}>
                <View
                  style={[styles.iconCircle, { backgroundColor: '#FF4D4D' }]}
                >
                  <Image
                    source={imagePath.football}
                    style={{
                      width: scale(20),
                      height: verticalScale(20),
                      tintColor: '#fff',
                    }}
                  />
                </View>
                <Text style={[styles.lossLabel, { color: '#FF4D4D' }]}>
                  Latest Match
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.sectionTitle}>
            Why Are You Closing The Account?
          </Text>

          <View style={styles.reasonBox}>
            {reasons.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.reasonItem}
                activeOpacity={0.7}
                onPress={() => handleSelectReason(item.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor:
                        selectedReason === item.id ? '#FF4D4D' : '#ccc',
                      backgroundColor:
                        selectedReason === item.id ? '#FF4D4D' : 'transparent',
                    },
                  ]}
                >
                  {selectedReason === item.id && (
                    <Check size={16} color={COLORS.secondary} />
                  )}
                </View>
                <Text style={styles.reasonLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedReason === '4' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Type Your Reason</Text>
              <TextInput
                style={[
                  styles.input,
                  keyboardVisible && {
                    height: verticalScale(60),
                    fontSize: moderateScale(14),
                  },
                ]}
                placeholder="Optional"
                placeholderTextColor="#888"
                value={customReason}
                onChangeText={setCustomReason}
                multiline
                numberOfLines={keyboardVisible ? 2 : 4}
              />
            </View>
          )}
        </ScrollView>

        {/* Fixed Bottom Delete Button */}
        {!keyboardVisible && (
          <View style={[styles.bottomContainer]}>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                {
                  backgroundColor: selectedReason ? '#FF4D4D' : '#F1F3F2',
                },
              ]}
              activeOpacity={0.7}
              onPress={handleDeletePress}
              disabled={!selectedReason}
            >
              <Text
                style={[
                  styles.deleteButtonText,
                  { color: selectedReason ? '#fff' : '#999' },
                ]}
              >
                DELETE MY ACCOUNT
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Modal Confirmation */}
      <Modal
        transparent
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Trash size={35} color={COLORS.secondary} />
              </View>
            </View>
            <Text style={styles.modalTitle}>Delete Account?</Text>
            <Text style={styles.modalSubtitle}>
              Are You Sure You Want To Delete Your Account?
            </Text>

            <TouchableOpacity
              style={styles.modalDeleteButton}
              activeOpacity={0.8}
              onPress={confirmDelete}
            >
              <Text style={styles.modalDeleteText}>DELETE</Text>
            </TouchableOpacity>

            <Pressable onPress={() => setShowModal(false)}>
              <Text style={styles.keepText}>NO, KEEP MY ACCOUNT</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  scrollContainer: {
    paddingHorizontal: moderateScale(20),
  },
  warningText: {
    fontSize: moderateScale(18),
    color: COLORS.darkText,
    marginTop: verticalScale(10),
    fontWeight: '400',
    fontFamily: 'Inria Sans',
  },
  lossContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(15),
  },
  lossItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: moderateScale(15),
    backgroundColor: COLORS.disabled,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(5),
  },
  iconCircle: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(6),
  },
  lossLabel: {
    fontSize: moderateScale(12),
    color: COLORS.success,
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    color: COLORS.darkText,
    marginTop: verticalScale(20),
    fontWeight: '500',
    fontFamily: 'Inria Sans',
  },
  reasonBox: {
    marginTop: verticalScale(10),
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: moderateScale(8),
    padding: moderateVerticalScale(10),
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  checkbox: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(10),
  },
  reasonLabel: {
    fontSize: moderateScale(16),
    color: COLORS.darkText,
    fontWeight: '300',
    fontFamily: 'Inria Sans',
  },
  inputContainer: {
    marginTop: verticalScale(10),
  },
  inputLabel: {
    fontSize: moderateScale(13),
    color: '#555',
    marginBottom: verticalScale(5),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    fontSize: moderateScale(13),
    minHeight: verticalScale(80),
    textAlignVertical: 'top',
  },

  // Fixed button container
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(15),
    borderTopWidth: 1,
    borderColor: COLORS.lightBorder,
  },
  deleteButton: {
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },

  // ===== Modal Styles =====
  modalOverlay: {
    flex: 1,
    backgroundColor: "'rgba(0,0,0,0.4)'",
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: moderateScale(20),
    alignItems: 'center',
  },
  modalIconContainer: {
    marginTop: verticalScale(-35),
  },
  modalIconCircle: {
    backgroundColor: COLORS.primary,
    width: moderateScale(70),
    height: moderateVerticalScale(64),
    borderRadius: moderateScale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: moderateScale(18),
    color:COLORS.darkText,
    fontWeight: '600',
    marginTop: verticalScale(10),
  },
  modalSubtitle: {
    color: COLORS.lightText,
    fontSize: moderateScale(13),
    textAlign: 'center',
    marginVertical: verticalScale(10),
  },
  modalDeleteButton: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(8),
    width: '100%',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    marginTop: verticalScale(10),
  },
  modalDeleteText: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
  keepText: {
    color: COLORS.primary,
    marginTop: verticalScale(15),
    fontWeight: '600',
    fontSize: moderateScale(13),
  },
});
