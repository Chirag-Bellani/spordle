export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    SEND_OTP: '/send-otp-authenticate-user', // instead of /send-otp-authenticate-user
    AUTHENTICATE_USER: '/authenticate-user',
    UPDATE_USERNAME: '/update-username',
  },

  // Sport endpoints
  SPORT: {
    GET_SPORT_LIST: '/get-sport-list',
  },

  BOX: {
    GET_BOX_DETAIL: '/get-box-details',
    GET_BOOKING_RATING_REVIEW: '/get-booking-rating-review',
    GET_BOX_BY_COURT: '/get-box-by-court',
    GET_BOX_COURT_DATE_BY_SLOT: '/get-box-court-date-by-slot',
  },

  // User endpoints
  USER: {
    UPDATE_PROFILE: '/update-profile',
    DELETE_ACCOUNT: '/user/delete',
    PROFILE: '/get-user-detail',
  },

  BOOKING: {
    ADD_BOOKING: '/add-booking',
    GET_BOOKING_LIST: '/get-booking-list',
    UPDATE_BOOKMARK: '/update-bookmark',
  },
  REVIEW_AND_RATING: {
    UPDATE_BOOKING_RATING_REVIEW: '/update-booking-rating-review',
  },
};

export default API_ENDPOINTS;
