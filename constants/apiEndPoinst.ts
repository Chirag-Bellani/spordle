export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'authenticate-user',
    LOGOUT: 'logout-user',
    OTP: 'send-otp-authenticate-user',
  },
  USER: {
    UPDATE_PROFILE: 'update-profile',
    GET_USER_DETAIL: 'get-user-detail',
    UPDATE_USERNAME:'update-username'
  },
  SPORTS: {
    GET_SPORT_LIST: 'get-sport-list',
  },
  BOX: {
    GET_BOX_DETAILS: 'get-box-details',
  },
  BOOKMARK:{
    UPDATE_BOOKMARK:'update-bookmark'
  },
  BOOKING:{
  GET_BOX_BY_COURT:'get-box-by-court',
  GET_BOX_COURT_DATE_BY_SLOT:'get-box-court-date-by-slot',
  ADD_BOOKING:'add-booking',
  GET_BOOKING_LIST:'get-booking-list',


  },
  REVIEW_AND_RATING:{
   UPDATE_BOOKING_RATING_REVIEW: 'update-booking-rating-review',
  GET_BOOKING_RATING_REVIEW: 'get-booking-rating-review'
  },
  NOTIFICATION: {
    GET_NOTIFICATION_LIST: 'get-notification-list',
  },
};
