import API_ENDPOINTS from "../constants/apiEndpoints";
import { apiPost } from "./api/apiService";

export const boxDetails = async (formData:FormData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.BOX.GET_BOX_DETAIL, formData);
    return response;
  } catch (error) {
    // console.log()
    console.error(error);
    throw error;
  }
};

export const sportList = async (formData:FormData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.SPORT.GET_SPORT_LIST, formData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const ratingReview = async (formData:FormData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.BOX.GET_BOOKING_RATING_REVIEW, formData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};