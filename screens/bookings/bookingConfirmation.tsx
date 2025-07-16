import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import mainStyles from '../../assets/styles/mainStyles';
import {scale, verticalScale} from 'react-native-size-matters';
import PrimaryButton from '../../components/primaryButton';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {COLORS} from '../../constants/color';
import CustomCheckBox from '../../components/checkbox';
import bookingListStyles from '../../assets/styles/bookingListStyles';
import {icons} from '../../constants/Icon';
import bookingConfirmationStyles from '../../assets/styles/bookingConfirmationStyles';
import {addBooking} from '../../services/bookingService';
import Toast from 'react-native-toast-message';
import {showToast} from '../../components/toastMessage';
import {AppStackScreenProps} from '../../navigation/navigationTypes';
import ScreenWrapper from '../../components/screenWrapper';

const BookingConfirmation: React.FC<
  AppStackScreenProps<'BookingConfirmation'>
> = ({navigation, route}) => {
  const {slotBookingData, boxData, totalAmountToBePaid} = route?.params;
  const [isTandCChecked, setIsTandCChecked] = useState(false);
  const [paymentOption, setPaymentOption] = useState('100%');

  const handlePay = async () => {
    const requestData = {
      box_id: boxData?.id,
      total_amount: totalAmountToBePaid,
      selectedSlots: slotBookingData,
    };
    const {success, message} = await addBooking(requestData);
    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Success!!!',
        text2: message || 'Something went wrong!',
      });
      navigation.navigate('BottomNav', {screen: 'Booking'});
    } else {
      console.log(message);
      showToast('error', 'Failed to add booking');
    }
  };
  return (
    <ScreenWrapper
      safeTop={true}
      safeBottom={true}
      scrollable={false}
      padding={true}
      withHeader={true}>
      {/* box and booking detail card */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, paddingBottom: verticalScale(50)}}>
        <View
          style={[
            bookingListStyles.bookingCardContainer,
            mainStyles.secondaryBackgroundColor,
            mainStyles.secondaryBorderColor,
            mainStyles.widthFull,
            mainStyles.flexContainer,
            mainStyles.borderWidth1,
            bookingConfirmationStyles.bookingCardContainer,
          ]}>
          <Image
            source={{uri: boxData?.get_selected_box_images[0]?.image}}
            style={bookingConfirmationStyles.bookingImage}
          />
          <View style={bookingConfirmationStyles.bookingDetailsContainer}>
            {/* Box title, address */}

            <View style={bookingConfirmationStyles.bookingTitleContainer}>
              <Text
                style={[
                  mainStyles.darkTextColor,
                  mainStyles.fontInriaSansRegular,
                  mainStyles.fontSize18,
                ]}
                numberOfLines={1}>
                {/* {item.title} */}

                {boxData?.title || 'N/A'}
              </Text>
              <View
                style={[
                  mainStyles.flexContainer,
                  bookingConfirmationStyles.addressContainer,
                ]}>
                <Image
                  source={icons.locationIcon}
                  style={bookingConfirmationStyles.locationIcon}
                />
                <Text
                  style={[
                    mainStyles.lightTextColor,
                    mainStyles.fontNunitoMedium,
                    mainStyles.fontSize14,
                    bookingListStyles.addressText,
                  ]}
                  numberOfLines={3}>
                  {/* {item.address} */}
                  {boxData.address}
                </Text>
              </View>
            </View>

            {/* Date and slot time container */}
            {/* <View
          style={bookingConfirmationStyles.dateSlotContainer}
        >
          <Text
            style={[
              mainStyles.lightTextColor,
              mainStyles.fontSize12,
              mainStyles.fontNunitoMedium,
            ]}
          >
            
            Date:- 8 Oct 2020
          </Text>
          <Text
            style={[
              mainStyles.lightTextColor,
              mainStyles.fontSize12,
              mainStyles.fontNunitoMedium,
            ]}
          >
            Time:- 4:00 PM to 6:00 PM
          </Text>
        </View> */}
          </View>
        </View>
        {/* apply for offers container */}

        <View
          style={[
            mainStyles.flexContainer,
            mainStyles.secondaryBorderColor,
            bookingConfirmationStyles.offersContainer,
          ]}>
          <Text
            style={[
              mainStyles.primaryTextColor,
              mainStyles.fontInriaSansRegular,
              mainStyles.fontSize18,
            ]}>
            APPLY OFFERS
          </Text>
          <EvilIcons
            name="chevron-right"
            size={42}
            color={COLORS.primary}
            onPress={undefined}
          />
        </View>
        {/* payment  details container */}
        <View style={{marginTop: verticalScale(10)}}>
          <View style={[mainStyles.flexContainer]}>
            <Text
              style={[
                mainStyles.fontInriaSansRegular,
                mainStyles.fontSize18,
                mainStyles.darkTextColor,
              ]}>
              Payment
            </Text>
            {/* advance payment percentage */}
            <View style={bookingConfirmationStyles.paymentOptionContainer}>
              {['20%', '100%'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    bookingConfirmationStyles.paymentOptionButton,
                    paymentOption !== option && [
                      mainStyles.secondaryBorderColor,
                      {borderWidth: 1},
                    ],
                    paymentOption === option && mainStyles.itemBackgroundColor,
                  ]}
                  onPress={() => setPaymentOption(option)}>
                  <Text
                    style={[
                      mainStyles.primaryTextColor,
                      mainStyles.fontSize12,
                      mainStyles.fontNunitoMedium,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View
            style={[
              mainStyles.primaryBorderColor,
              bookingConfirmationStyles.paymentDetailsContainer,
            ]}>
            <View style={mainStyles.flexContainer}>
              <Text
                style={[
                  mainStyles.fontInriaSansRegular,
                  mainStyles.fontSize16,
                  mainStyles.darkTextColor,
                ]}>
                COURT FEE
              </Text>
              <Text
                style={[
                  mainStyles.fontInriaSansRegular,
                  mainStyles.fontSize16,
                  mainStyles.darkTextColor,
                ]}>
                ₹ {totalAmountToBePaid}
              </Text>
            </View>
            <View style={[mainStyles.flexContainer]}>
              <Text
                style={[
                  mainStyles.fontSize16,
                  mainStyles.fontInriaSansRegular,
                  mainStyles.darkTextColor,
                ]}>
                CONVENIENCE FEE
              </Text>
              <Text
                style={[
                  mainStyles.fontSize16,
                  mainStyles.fontInriaSansRegular,
                  mainStyles.darkTextColor,
                ]}>
                ₹ 0.00
              </Text>
            </View>
            <View style={mainStyles.flexContainer}>
              <Text
                style={[
                  mainStyles.fontSize18,
                  mainStyles.fontInriaSansBold,
                  mainStyles.lightTextColor,
                ]}>
                TOTAL
              </Text>
              <Text
                style={[
                  mainStyles.fontSize18,
                  mainStyles.fontInriaSansBold,
                  mainStyles.lightTextColor,
                ]}>
                ₹ {totalAmountToBePaid}
              </Text>
            </View>
          </View>
        </View>
        {/* T and C container */}
        <View style={bookingConfirmationStyles.tncContainer}>
          <CustomCheckBox
            value={isTandCChecked}
            onValueChange={setIsTandCChecked}
            style={{marginBottom: verticalScale(15)}}
          />
          <View>
            <Text
              style={[
                mainStyles.fontSize14,
                mainStyles.fontNunitoSemibold,
                mainStyles.lightTextColor,
                {textAlign: 'center'},
              ]}>
              I agree to the{' '}
              <Text
                style={[
                  mainStyles.fontSize14,
                  mainStyles.fontNunitoMedium,
                  mainStyles.linkTextColor,
                  {textDecorationLine: 'underline', fontStyle: 'italic'},
                ]}
                onPress={() => navigation.navigate('TermsAndConditions')}>
                Terms and Conditions
              </Text>{' '}
              &{' '}
              <Text
                style={[
                  mainStyles.fontSize14,
                  mainStyles.fontNunitoSemibold,
                  mainStyles.linkTextColor,
                  {textDecorationLine: 'underline', fontStyle: 'italic'},
                ]}
                onPress={() => navigation.navigate('PrivacyPolicy')}>
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
        {/* Cancelation Policy Container */}

        <View style={bookingConfirmationStyles.cancellationContainer}>
          <Text
            style={[
              mainStyles.darkTextColor,
              mainStyles.fontInriaSansRegular,
              mainStyles.fontSize18,
            ]}>
            Cancellation Policy
          </Text>
          <View
            style={[
              mainStyles.marginTop10,
              bookingConfirmationStyles.cancellationItem,
            ]}>
            {(boxData?.get_box_cancellation_policy || []).map(item => (
              <Text
                key={item.id}
                style={[
                  mainStyles.lightTextColor,
                  mainStyles.fontNunitoSemibold,
                  mainStyles.fontSize14,
                ]}>
                <Text style={{fontSize: scale(9)}}>{'\u2B24'}</Text> {item.text}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* Button to open payment gateway */}
      <PrimaryButton
        title={`Pay ₹ ${totalAmountToBePaid} SECURELY`}
        onPress={handlePay}
        style={bookingConfirmationStyles.primaryButton}
        disabled={!isTandCChecked}
      />
    </ScreenWrapper>
  );
};

export default BookingConfirmation;
