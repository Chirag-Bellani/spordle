import API_ENDPOINTS from "../constants/apiEndpoints";
import { apiPost } from "./api/apiService";

export const sendOTP = async (form:FormData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.AUTH.SEND_OTP, form);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const authenticateUser = async (form:FormData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.AUTH.AUTHENTICATE_USER, form);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserName = async (form:FormData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.AUTH.UPDATE_USERNAME, form);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};