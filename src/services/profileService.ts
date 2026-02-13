import API_ENDPOINTS from '../constants/apiEndpoints';
import { apiPost } from './api/apiService';

export const updateUserProfile = async (form: FormData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.USER.UPDATE_PROFILE, form);
    return response;
  } catch (error) {
    console.error('Error updating profile:', error);

    throw error;
  }
};

export const updateUserName = async (form: FormData) => {
  try {
    const response = await apiPost(API_ENDPOINTS.AUTH.UPDATE_USERNAME, form);
    return response;
  } catch (error) {
    console.error('Error updating username:', error);
    throw error;
  }
};
