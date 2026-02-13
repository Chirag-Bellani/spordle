import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import StarRating from 'react-native-star-rating-widget';
import { COLORS } from '../../constants/color';
import { updateReviewAndRating } from '../../services/ratingAndReviewService';
import { AppStackScreenProps } from '../../navigation/navigationTypes';
import navigationString from '../../constants/navigationString';
import ToastUtil from '../../utils/toastUtil';
import ButtonComp from '../../components/ButtonComp';
import { FONTS } from '../../constants/font';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

const AddRatingAndReview: React.FC<
  AppStackScreenProps<'AddRatingAndReview'>
> = ({ navigation, route }) => {
  const { bookingId } = route.params;

  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  /* Disable hardware back */
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleAddRatingAndReview = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('booking_id', bookingId.toString());
    formData.append('rating', rating.toString());
    formData.append('review', review);

    try {
      const { success, message } = await updateReviewAndRating(formData);

      if (success) {
        ToastUtil.success('Review Added successfully!');
        navigation.navigate(navigationString.BOTTOMTAB, {
          screen: navigationString.HOMESCREEN,
        });
      } else {
        ToastUtil.error(message);
      }
    } catch (error) {
      if (error instanceof Error) {
        ToastUtil.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainContainer}>
            {/* Skip */}
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => navigation.navigate(navigationString.BOTTOMTAB)}
            >
              <Text style={styles.skipText}>SKIP</Text>
            </TouchableOpacity>

            {/* Stars */}
            <StarRating
              rating={rating}
              onChange={setRating}
              color={COLORS.primary}
              emptyColor={COLORS.primary}
              starSize={47}
              maxStars={5}
            />

            <Text style={styles.title}>How Was Your Experience?</Text>
            <Text style={styles.subtitle}>
              Give Us Rating and Your Review
            </Text>

            {/* Input & Button */}
            <View style={styles.bottomContainer}>
              <TextInput
                style={styles.input}
                value={review}
                onChangeText={setReview}
                placeholder="Write your review..."
                placeholderTextColor="#B8B8B8"
                multiline
              />

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (!rating || isLoading) && styles.disabledBtn,
                ]}
                disabled={!rating || isLoading}
                onPress={handleAddRatingAndReview}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>
                    Share Your Experience
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddRatingAndReview;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },

  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  skipBtn: {
    position: 'absolute',
    top: verticalScale(50),
    right: scale(16),
  },

  skipText: {
    fontFamily: FONTS.nunitoMedium,
    fontSize: scale(12),
    color: COLORS.lightText,
  },

  title: {
    fontFamily: FONTS.inriaSansRegular,
    fontSize: scale(20),
    color: COLORS.darkText,
    marginTop: verticalScale(10),
  },

  subtitle: {
    fontFamily: FONTS.nunitoMedium,
    fontSize: scale(14),
    color: COLORS.lightText,
  },

  bottomContainer: {
    width: '90%',
    position: 'absolute',
    bottom: verticalScale(20),
    gap: verticalScale(12),
  },

  input: {
    width: '100%',
    minHeight: verticalScale(70),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    fontSize: scale(15),
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },

  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },

  disabledBtn: {
    opacity: 0.5,
  },

  submitText: {
    color: '#fff',
    fontSize: scale(15),
    fontFamily: FONTS.nunitoMedium,
  },
});

