import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import HeaderComp from '../../components/HeaderComp';
import GoBack from '../../components/GoBack';
import { COLORS } from '../../constants/color';
import NetInfoComponent from '../../components/NetInfoComponent';
import { AppStackScreenProps } from '../../navigation/navigationTypes';

const ReviewScreen : React.FC<AppStackScreenProps<'ReviewScreen'>> = ({ route }) => {
  const { bookingRatingReview } = route.params || {};

  return (
    <View style={styles.container}>
       <NetInfoComponent />
      <HeaderComp headerText="What Client Says" />
      <GoBack/>

      {Array.isArray(bookingRatingReview) && bookingRatingReview.length > 0 ? (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(30) }}
        >
          {bookingRatingReview.map((review, index) => {
            const user = review?.get_selected_user;
            const firstLetter =
              user?.first_name?.charAt(0)?.toUpperCase() || 'U';
            const userName = user?.name || 'Unknown User';
            const reviewText = review?.review || 'No review provided';
            const bookingDate = review?.booking_date || '';

            return (
              <View style={styles.reviewCard} key={index}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarLetter}>{firstLetter}</Text>
                </View>

                <View style={styles.reviewContent}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{userName}</Text>
                    {bookingDate ? (
                      <Text style={styles.reviewDate}>{bookingDate}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.reviewText}>{reviewText}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No reviews available.</Text>
        </View>
      )}
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  scrollView: {
    paddingHorizontal: moderateScale(20),
    marginTop: verticalScale(10),
  },
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    marginBottom: verticalScale(10),
    shadowColor: COLORS.darkText,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#AEC6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(10),
  },
  avatarLetter: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: moderateScale(16),
  },
  reviewContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.darkText,
  },
  reviewDate: {
    fontSize: moderateScale(11),
    color: '#777',
  },
  reviewText: {
    fontSize: moderateScale(13),
    color: '#555',
    marginTop: verticalScale(4),
    lineHeight: moderateScale(18),
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: moderateScale(14),
    color: '#777',
  },
});
