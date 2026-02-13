import API_ENDPOINTS from "../constants/apiEndpoints";
import { apiPost } from "./api/apiService";

export const bookingList = async (formData:FormData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.BOOKING.GET_BOOKING_LIST, formData);
    return response;
  } catch (error) {
    
    console.error(error);
    throw error;
  }
};

export const addBooking = async (payload:{box_id:Number,selectedSlots:String}) => {
  try {
    const response = await apiPost(
        API_ENDPOINTS.BOOKING.ADD_BOOKING,
        payload,
      );
    return response;
  } catch (error) {
    console.log(error)
    throw error;
  }
};


export const bookMark = async (formData:FormData) => {
  try {
    const response = await apiPost(
        API_ENDPOINTS.BOOKING.UPDATE_BOOKMARK,
        formData,
      );
    return response;
  } catch (error) {
    console.log(error)
    throw error;
  }
};